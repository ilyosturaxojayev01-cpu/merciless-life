import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { requireAuth } from '../middleware.js';
import { Interview, User } from '../models.js';
import { FIELDS, publicFields } from '../fields.js';
import { dayKey } from '../tz.js';

const r = Router();
const LANG = { uz: "o'zbek tilida (lotin yozuvi)", ru: 'rus tilida', en: 'ingliz tilida' };

function systemPrompt(field, language, userName) {
  return `Siz "${field.org}" tashkilotidagi "${field.title}" lavozimi uchun HAQIQIY ish suhbatini o'tkazayotgan tajribali intervyuersiz.
Suhbat tili: ${LANG[language] || LANG.uz}. Nomzodning ismi: ${userName}.

Qoidalar:
- Rolingizdan chiqmang. Siz haqiqiy ishga qabul qiluvchi mutaxassissiz, ${field.title} sohasining dress-kodidagi kiyimda o'tirgansiz.
- Avval qisqa salomlashing, o'zingizni tanishtiring va suhbat qanday o'tishini ayting.
- Savollarni BITTADAN bering. Nomzod javob bergach, javobiga qarab aniqlashtiruvchi savol bering, keyin keyingi mavzuga o'ting.
- Savollar shu soha intervyularida haqiqatan so'raladigan savollar bo'lsin: ${field.topics}.
- Taxminan 8–12 ta asosiy savol bering: tanishuv va motivatsiya, texnik/kasbiy bilim, vaziyatli (kazus) savol, jamoa va stress, kelajak rejalari.
- Gaplaringiz qisqa va tabiiy bo'lsin (1–3 jumla), xuddi jonli suhbatdagidek. Ro'yxat yoki belgilar ishlatmang.
- Nomzodning kamerada ko'rinishi, ovoz ohangi va ishonchini hisobga oling, lekin tashqi ko'rinishini kamsitmang.
- Nomzod "tugatamiz" desa yoki savollar tugasa, qisqa yakuniy fikr-mulohaza bering: 2 ta kuchli tomon, 2 ta yaxshilash kerak bo'lgan jihat.
- Hech qachon shaxsiy maxfiy ma'lumotlarni (parol, karta raqami) so'ramang.

ESHITISH VA MULOQOT QOIDALARI (ENG MUHIMI):
- Siz nomzodni diqqat bilan ESHITASIZ. Har bir savoldan keyin to'xtang va nomzod gapirib bo'lguncha kuting. Nomzod javob bermaguncha keyingi savolni BERMANG.
- Nomzod nima desa, aynan shunga mazmunan munosabat bildiring (nimasi yaxshi, nimasi aniqlashtirilishi kerak), keyin davom eting. Javobni e'tiborsiz qoldirib, indamasdan keyingi savolga o'tib ketmang.
- Nomzod SIZGA savol bersa (lavozim, tashkilot, ish sharoiti, suhbat jarayoni, yoki sizning savolingiz mazmuni haqida), avval o'sha savolga aniq va to'liq javob bering, so'ng \"Tushunarlimi?\" deb qisqa so'rang va suhbatga qayting. Bilmagan tafsilotni (maosh, aniq raqamlar) to'qimang: \"Buni HR bo'limi aniqlashtiradi\" deng.
- Nomzod \"takrorlang\", \"tushunmadim\", \"boshqacha tushuntiring\" desa, savolni soddaroq so'zlar yoki misol bilan qayta ayting.
- Nomzod \"bilmayman\" desa, qisqa yo'naltiruvchi maslahat bering va uni ranjitmasdan keyingi savolga o'ting.
- Nomzod mavzudan chetga chiqsa yoki erkin gapirsa, iliq javob qaytaring va muloyimlik bilan suhbatga qaytaring.
- Nomzod gapingizni bo'lsa, darhol jim bo'lib, uni oxirigacha tinglang.
- Ovoz noaniq bo'lsa: \"Uzr, aniq eshitmadim, takrorlay olasizmi?\" deng. Uzoq jimlik bo'lsa: \"Eshityapsizmi? Fikrlashga vaqt kerakmi?\" deb so'rang.
- Bir gapirishda faqat BITTA savol bering va uzun monolog qilmang.`;
}

async function ephemeralToken() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, httpOptions: { apiVersion: 'v1alpha' } });
  const t = await ai.authTokens.create({
    config: {
      uses: 1,
      expireTime: new Date(Date.now() + 40 * 60 * 1000).toISOString(),
      newSessionExpireTime: new Date(Date.now() + 90 * 1000).toISOString(),
      httpOptions: { apiVersion: 'v1alpha' },
    },
  });
  return t.name;
}

r.get('/fields', (req, res) => res.json(publicFields()));

r.post('/interviews/start', requireAuth, async (req, res) => {
  try {
    const field = FIELDS.find((f) => f.id === req.body.fieldId);
    if (!field) return res.status(400).json({ error: "Yo'nalish topilmadi" });
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'Serverda GEMINI_API_KEY sozlanmagan' });
    const language = ['uz', 'ru', 'en'].includes(req.body.language) ? req.body.language : 'uz';
    const user = await User.findById(req.userId);
    const now = new Date();
    const iv = await Interview.create({
      user: req.userId, fieldId: field.id, fieldTitle: field.title, language,
      startedAt: now, dayKey: dayKey(now),
    });
    res.json({
      interviewId: iv._id,
      token: await ephemeralToken(),
      model: process.env.GEMINI_LIVE_MODEL || 'gemini-2.5-flash-native-audio-preview-09-2025',
      systemInstruction: systemPrompt(field, language, user.name),
      field: publicFields().find((f) => f.id === field.id),
      language,
    });
  } catch (e) { console.error(e); res.status(500).json({ error: "Suhbatni boshlab bo'lmadi" }); }
});

r.patch('/interviews/:id/finish', requireAuth, async (req, res) => {
  const iv = await Interview.findOne({ _id: req.params.id, user: req.userId });
  if (!iv) return res.status(404).json({ error: 'Topilmadi' });
  const end = new Date();
  iv.transcript = (req.body.transcript || []).slice(0, 2000).map((m) => ({
    role: m.role === 'ai' ? 'ai' : 'user', text: String(m.text || '').slice(0, 4000), at: new Date(m.at || end),
  }));
  iv.status = 'finished'; iv.endedAt = end; iv.durationSec = Math.round((end - iv.startedAt) / 1000);
  await iv.save();
  res.json({ id: iv._id });
});

r.get('/interviews', requireAuth, async (req, res) => {
  const list = await Interview.find({ user: req.userId, status: 'finished' }).sort({ startedAt: -1 })
    .select('fieldId fieldTitle startedAt endedAt dayKey durationSec language').lean();
  res.json(list);
});
r.get('/interviews/:id', requireAuth, async (req, res) => {
  const iv = await Interview.findOne({ _id: req.params.id, user: req.userId }).lean();
  iv ? res.json(iv) : res.status(404).json({ error: 'Topilmadi' });
});
r.delete('/interviews/:id', requireAuth, async (req, res) => {
  await Interview.deleteOne({ _id: req.params.id, user: req.userId });
  res.json({ ok: true });
});

export default r;
