import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User, Code } from '../models.js';
import { sendEmailCode } from '../mail.js';
import { sendSmsCode } from '../sms.js';

const r = Router();
const sha = (s) => crypto.createHash('sha256').update(s + process.env.JWT_SECRET).digest('hex');
const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const pub = (u) => ({ id: u._id, name: u.name, email: u.email, phone: u.phone });
const mask = (u) => u.email
  ? u.email.replace(/(.{2}).*(@.*)/, '$1***$2')
  : `+${u.phone.slice(0, 5)}*****${u.phone.slice(-2)}`;

async function issue(user, purpose) {
  const code = String(crypto.randomInt(100000, 1000000));
  await Code.deleteMany({ user: user._id, purpose });
  await Code.create({ user: user._id, purpose, hash: sha(code), expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
  if (user.email) await sendEmailCode(user.email, code, purpose);
  else await sendSmsCode(user.phone, code);
  return {
    userId: user._id, purpose, channel: user.email ? 'email' : 'sms', sentTo: mask(user),
    devCode: process.env.DEV_SHOW_CODE === 'true' ? code : undefined,
  };
}

const normPhone = (p) => {
  let d = String(p || '').replace(/\D/g, '');
  if (d.length === 9) d = '998' + d;
  return d.length >= 11 && d.length <= 15 ? d : null;
};

r.post('/register', async (req, res) => {
  try {
    const { name, password, email, phone } = req.body;
    if (!name || name.trim().length < 3) return res.status(400).json({ error: "Ism kamida 3 ta belgidan iborat bo'lsin" });
    if (!password || password.length < 8) return res.status(400).json({ error: "Parol kamida 8 ta belgidan iborat bo'lsin" });
    const mail = email ? String(email).toLowerCase().trim() : null;
    const ph = !mail ? normPhone(phone) : null;
    if (mail && !/^\S+@\S+\.\S+$/.test(mail)) return res.status(400).json({ error: "Email noto'g'ri formatda" });
    if (!mail && !ph) return res.status(400).json({ error: "Email yoki telefon raqamini kiriting (masalan 901234567)" });

    const exists = await User.findOne({ $or: [{ nameLower: name.trim().toLowerCase() }, ...(mail ? [{ email: mail }] : []), ...(ph ? [{ phone: ph }] : [])] });
    if (exists && exists.verified) return res.status(409).json({ error: "Bunday foydalanuvchi allaqachon mavjud" });
    if (exists) await User.deleteOne({ _id: exists._id }); // tasdiqlanmagan eski urinish

    const user = await User.create({
      name: name.trim(), nameLower: name.trim().toLowerCase(),
      passwordHash: await bcrypt.hash(password, 12), email: mail || undefined, phone: ph || undefined,
    });
    res.json(await issue(user, 'register'));
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server xatosi' }); }
});

r.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ nameLower: String(name || '').trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.passwordHash)))
      return res.status(401).json({ error: "Ism yoki parol noto'g'ri" });
    res.json(await issue(user, user.verified ? 'login' : 'register'));
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server xatosi' }); }
});

r.post('/resend', async (req, res) => {
  const user = await User.findById(req.body.userId);
  if (!user) return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
  res.json(await issue(user, req.body.purpose === 'register' ? 'register' : 'login'));
});

r.post('/verify', async (req, res) => {
  const { userId, code, purpose } = req.body;
  const rec = await Code.findOne({ user: userId, purpose });
  if (!rec) return res.status(400).json({ error: 'Kod muddati tugagan. Qayta yuboring' });
  if (rec.attempts >= 5) { await rec.deleteOne(); return res.status(429).json({ error: "Urinishlar ko'p. Yangi kod so'rang" }); }
  if (rec.hash !== sha(String(code || '').trim())) {
    rec.attempts += 1; await rec.save();
    return res.status(400).json({ error: "Kod noto'g'ri" });
  }
  await rec.deleteOne();
  const user = await User.findByIdAndUpdate(userId, { verified: true }, { new: true });
  res.json({ token: sign(user), user: pub(user) });
});

export default r;
