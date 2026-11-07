import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api.js';
import { useApp } from '../ctx.js';
import Avatar from '../components/Avatar.jsx';
import { IllusCall, IllusSteps, IllusShield } from '../components/Illustrations.jsx';

const PREVIEW = [
  { title: 'Full-Stack dasturchi', kind: 'smart', color: '#27304f', accent: '#6d7cff' },
  { title: 'Harbiy xizmat', kind: 'military', color: '#4b5320', accent: '#d4af37' },
  { title: 'Ichki ishlar organlari', kind: 'police', color: '#1e3a8a', accent: '#fbbf24' },
  { title: 'Shifokor', kind: 'medical', color: '#f4f7fb', accent: '#14b8a6' },
  { title: 'Pilot / Aviatsiya', kind: 'pilot', color: '#1c2a4a', accent: '#fbbf24' },
];

export default function Landing() {
  const { consent, setConsent } = useApp();
  const { hash } = useLocation();
  const [i, setI] = useState(0);
  const [reachedEnd, setReachedEnd] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % PREVIEW.length), 2800); return () => clearInterval(t); }, []);
  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  }, [hash]);
  useEffect(() => {
    if (consent) { setReachedEnd(true); return; }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setReachedEnd(true), { threshold: 1 });
    endRef.current && io.observe(endRef.current);
    return () => io.disconnect();
  }, [consent]);

  const p = PREVIEW[i];
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h1>Haqiqiy suhbatdan oldin, haqiqiydek mashq qiling</h1>
          <p className="lead">Kamera va mikrofon orqali sun'iy intellekt bilan jonli ish suhbati o'tkazing. U sizni ko'radi, tinglaydi, soha bo'yicha haqiqiy savollar beradi va suhbat tugagach barcha savol-javoblaringizni matn qilib saqlaydi.</p>
          <div className="row">
            <a href="#about" className="btn primary">Sayt haqida o'qish</a>
            <a href="#security" className="btn ghost">Xavfsizlik siyosati</a>
          </div>
        </div>
        <div className="call-frame" aria-label="Suhbat oynasi namunasi">
          <div className="call-bar"><span className="rec" /> Jonli suhbat · {p.title}</div>
          <div className="call-stage"><Avatar key={i} outfit={p} level={0} /></div>
          <div className="call-cap">Dress-kod yo'nalishga qarab o'zgaradi</div>
        </div>
      </section>

      <div className="doc" id="info">
        <section id="about" className="doc-sec">
          <IllusCall />
          <div>
            <h2>Sayt haqida</h2>
            <p>AI Interview Simulator — ish suhbatiga tayyorlanish uchun yaratilgan onlayn mashq maydoni. Siz yo'nalishni tanlaysiz, kamerani yoqasiz va ekranda shu soha vakili kiyimida o'tirgan AI intervyuer bilan o'zingiz xohlagancha gaplashasiz.</p>
            <p>Dasturchi uchun savollar bir xil, harbiy xizmat yoki ichki ishlar organlariga kirish uchun esa butunlay boshqa: intizom, qonunga rioya, stressga chidamlilik, vaziyatli masalalar. AI intervyuer har bir javobingizga qarab aniqlashtiruvchi savol beradi, xuddi jonli suhbatdagidek.</p>
            <p>Dasturda 20 ga yaqin kasb yo'nalishi bor: IT, tibbiyot, ta'lim, huquq, bank, qurilish, aviatsiya, harbiy va huquq-tartibot xizmatlari, media, dizayn va boshqalar. Suhbat tilini ham tanlashingiz mumkin: o'zbek, rus yoki ingliz.</p>
            <p>Suhbat siz qizil telefon tugmasini bosmaguningizcha davom etadi. Tugagach, aytilgan savollar va sizning javoblaringiz matnga aylantirilib, sana va vaqt (Toshkent vaqti, UTC+5) bilan «Suhbatlar tarixi» bo'limida saqlanadi. Keyinroq ularni qayta o'qib, qayerda xato qilganingizni topishingiz mumkin.</p>
          </div>
        </section>

        <section id="howto" className="doc-sec flip">
          <IllusSteps />
          <div>
            <h2>Ro'yxatdan o'tish yo'riqnomasi</h2>
            <ol className="steps">
              <li><b>Quyida pastga tushing.</b> Shu bo'limni oxirigacha o'qib chiqing va «Men barchasini o'qib chiqib roziligimni bildirdim» katakchasini belgilang. Shundan so'ng yuqoridagi menyuda «Ro'yxatdan o'tish» tugmasi paydo bo'ladi.</li>
              <li><b>Ma'lumotlarni kiriting.</b> Ism (kamida 3 belgi), parol (kamida 8 belgi) va elektron pochta manzilingiz kerak bo'ladi.</li>
              <li><b>Emailingiz yo'qmi?</b> «Emailingiz yo'qmi?» tugmasini bosing va telefon raqamingizni kiriting (masalan, 90 123 45 67). Tasdiqlash kodi SMS orqali yuboriladi.</li>
              <li><b>Kodni tasdiqlang.</b> 6 xonali kod 10 daqiqa amal qiladi. Email bilan ro'yxatdan o'tgan bo'lsangiz, har safar tizimga kirganingizda ham elektron pochtangizga autentifikatsiya kodi yuboriladi.</li>
              <li><b>Yo'nalishni tanlang.</b> Kirgandan so'ng kasb yo'nalishi va til tanlanadi, brauzer kamera va mikrofonga ruxsat so'raydi. Ruxsat bering va suhbat boshlanadi.</li>
              <li><b>Suhbatni tugating.</b> Tayyor bo'lganingizda qizil telefon tugmasini bosing. Matn ko'rinishidagi yozuv avtomatik saqlanadi.</li>
            </ol>
            <p>Maslahat: tinch xonada, naushnik taqib va yuzingiz yaxshi yoritilgan holda o'tiring. Shunda AI sizni aniqroq eshitadi va ko'radi.</p>
          </div>
        </section>

        <section id="security" className="doc-sec">
          <IllusShield />
          <div>
            <h2>Xavfsizlik siyosati</h2>
            <h3>Qanday ma'lumotlar yig'iladi</h3>
            <p>Ism, parol (faqat kuchli shifrlangan ko'rinishda), email yoki telefon raqami hamda suhbat matni (savollar va javoblar). Kamera tasviri va ovozingiz saqlanmaydi: suhbat vaqtida ular faqat AI xizmatiga jonli uzatiladi.</p>
            <h3>AI xizmati</h3>
            <p>Jonli suhbat Google Gemini Live xizmati orqali ishlaydi. Kamera kadrlari va ovoz suhbat davomida Google serverlariga uzatiladi va ular Google shartlariga muvofiq qayta ishlanadi. Suhbat paytida parol, bank kartasi raqami, pasport ma'lumotlari kabi maxfiy ma'lumotlarni aytmang.</p>
            <h3>Hisobingiz himoyasi</h3>
            <p>Parollar bcrypt yordamida shifrlab saqlanadi. Tasdiqlash kodlari 10 daqiqadan keyin o'chib ketadi va 5 marta noto'g'ri kiritilsa bloklanadi. Seanslar 7 kun amal qiladi. Hisobingizga kirish uchun parolga qo'shimcha ravishda email yoki SMS kodi talab qilinadi.</p>
            <h3>Matn yozuvlari</h3>
            <p>Suhbat matni faqat sizga ko'rinadi. Istalgan yozuvni «Suhbatlar tarixi» bo'limida o'zingiz o'chirib tashlashingiz mumkin, o'chirilgan yozuv bazadan butunlay olib tashlanadi.</p>
            <h3>Vaqt va sana</h3>
            <p>Saytdagi barcha sana va vaqtlar O'zbekiston vaqti, ya'ni UTC+5 bo'yicha ko'rsatiladi va saqlanadi.</p>
            <h3>Muhim eslatma</h3>
            <p>AI intervyuer — mashq vositasi. Uning baholari real ishga qabul qilish qarori emas va tashkilotlarning haqiqiy talablarini to'liq aks ettirmasligi mumkin. 18 yoshdan kichik foydalanuvchilar ota-ona yoki vasiy ishtirokida foydalanishi tavsiya etiladi.</p>
          </div>
        </section>

        <div ref={endRef} className="end-marker" aria-hidden="true" />
        <section className="consent" id="consent">
          <label className={`check ${reachedEnd ? '' : 'disabled'}`}>
            <input type="checkbox" checked={consent} disabled={!reachedEnd} onChange={(e) => setConsent(e.target.checked)} />
            <span>Men barchasini o'qib chiqib roziligimni bildirdim</span>
          </label>
          <p className="hint">
            {consent ? "Rahmat! Endi yuqoridagi menyuda «Ro'yxatdan o'tish» tugmasi paydo bo'ldi." : reachedEnd ? 'Katakchani belgilang, shunda ro\'yxatdan o\'tish ochiladi.' : "Katakcha bo'limni oxirigacha o'qib chiqqaningizdan keyin ochiladi."}
          </p>
        </section>
      </div>
    </>
  );
}
