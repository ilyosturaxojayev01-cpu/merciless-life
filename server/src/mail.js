import nodemailer from 'nodemailer';
let transport;
const getTransport = () => {
  if (!process.env.SMTP_HOST) return null;
  transport ||= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transport;
};

export async function sendEmailCode(to, code, purpose) {
  const t = getTransport();
  const title = purpose === 'register' ? "Ro'yxatdan o'tishni tasdiqlang" : 'Tizimga kirishni tasdiqlang (autentifikatsiya)';
  if (!t) { console.log(`[EMAIL → ${to}] ${title}: ${code}`); return; }
  await t.sendMail({
    from: process.env.MAIL_FROM, to, subject: `${title} — AI Interview Simulator`,
    html: `<div style="font-family:Arial;background:#0c1024;color:#e8ebff;padding:32px;border-radius:12px">
      <h2 style="margin:0 0 12px">${title}</h2>
      <p>Tasdiqlash kodingiz:</p>
      <p style="font-size:34px;letter-spacing:8px;font-weight:700;color:#ffb454">${code}</p>
      <p style="color:#98a0c8">Kod 10 daqiqa amal qiladi. Agar bu siz bo'lmasangiz, xatni e'tiborsiz qoldiring.</p></div>`,
  });
}
