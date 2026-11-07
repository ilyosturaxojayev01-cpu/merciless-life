// Eskiz.uz orqali SMS yuborish (O'zbekiston). Sozlanmasa kod konsolga chiqadi.
let cached;
async function eskizToken() {
  if (cached && cached.exp > Date.now()) return cached.token;
  const body = new URLSearchParams({ email: process.env.ESKIZ_EMAIL, password: process.env.ESKIZ_PASSWORD });
  const r = await fetch('https://notify.eskiz.uz/api/auth/login', { method: 'POST', body });
  const j = await r.json();
  cached = { token: j.data.token, exp: Date.now() + 25 * 24 * 3600 * 1000 };
  return cached.token;
}

export async function sendSmsCode(phone, code) {
  const message = `AI Interview Simulator tasdiqlash kodi: ${code}`;
  if (!process.env.ESKIZ_EMAIL) { console.log(`[SMS → ${phone}] ${message}`); return; }
  const token = await eskizToken();
  const body = new URLSearchParams({ mobile_phone: phone, message, from: process.env.ESKIZ_FROM || '4546' });
  const r = await fetch('https://notify.eskiz.uz/api/message/sms/send', {
    method: 'POST', headers: { Authorization: `Bearer ${token}` }, body,
  });
  if (!r.ok) throw new Error('SMS yuborilmadi');
}
