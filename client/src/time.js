import { useEffect, useState } from 'react';
// Saytdagi barcha vaqtlar UTC+5 (Asia/Tashkent) bo'yicha ko'rsatiladi.
export const TZ = 'Asia/Tashkent';
export const fmt = (d, opts = { dateStyle: 'medium', timeStyle: 'short' }) =>
  new Intl.DateTimeFormat('uz-UZ', { timeZone: TZ, ...opts }).format(new Date(d));
export const fmtTime = (d) => fmt(d, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
export const fmtDay = (d) => fmt(d, { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
export const dayKey = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date(d));
export const fmtDur = (s = 0) => `${Math.floor(s / 60)} daq ${String(s % 60).padStart(2, '0')} soniya`;
export function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return now;
}
