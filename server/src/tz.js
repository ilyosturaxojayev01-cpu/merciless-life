// Barcha vaqt funksiyalari UTC+5 (Asia/Tashkent) bo'yicha.
process.env.TZ = 'Asia/Tashkent';
export const TZ = 'Asia/Tashkent';
export const dayKey = (d = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(d); // YYYY-MM-DD
export const fmtDateTime = (d = new Date()) =>
  new Intl.DateTimeFormat('uz-UZ', { timeZone: TZ, dateStyle: 'medium', timeStyle: 'medium' }).format(d);
