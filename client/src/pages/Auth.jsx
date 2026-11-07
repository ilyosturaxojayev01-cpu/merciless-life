import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useApp } from '../ctx.js';

export default function Auth({ mode }) {
  const { consent, login } = useApp();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', password: '', email: '', phone: '' });
  const [noEmail, setNoEmail] = useState(false);
  const [pending, setPending] = useState(null);
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  if (mode === 'register' && !consent) {
    return (
      <div className="auth-wrap"><div className="card auth">
        <h2>Avval shartlar bilan tanishing</h2>
        <p className="muted">Ro'yxatdan o'tish uchun sayt haqidagi bo'limni oxirigacha o'qib, roziligingizni belgilashingiz kerak.</p>
        <Link to="/#about" className="btn primary">Bo'limga o'tish</Link>
      </div></div>
    );
  }

  const run = async (fn) => { setErr(''); setBusy(true); try { await fn(); } catch (e) { setErr(e.message); } finally { setBusy(false); } };
  const submit = (e) => { e.preventDefault(); run(async () => {
    const body = mode === 'register'
      ? { name: f.name, password: f.password, ...(noEmail ? { phone: f.phone } : { email: f.email }) }
      : { name: f.name, password: f.password };
    setPending(await api.post(`/auth/${mode}`, body));
  }); };
  const verify = (e) => { e.preventDefault(); run(async () => {
    const r = await api.post('/auth/verify', { userId: pending.userId, code, purpose: pending.purpose });
    login(r.token, r.user); nav('/fields');
  }); };
  const resend = () => run(async () => setPending(await api.post('/auth/resend', { userId: pending.userId, purpose: pending.purpose })));

  if (pending) return (
    <div className="auth-wrap"><form className="card auth" onSubmit={verify}>
      <h2>{pending.channel === 'email' ? 'Emailingizni tekshiring' : 'SMS xabarni tekshiring'}</h2>
      <p className="muted">6 xonali kod <b>{pending.sentTo}</b> manziliga yuborildi. Kod 10 daqiqa amal qiladi.</p>
      {pending.devCode && <p className="devcode">Test rejimi kodi: {pending.devCode}</p>}
      <input className="input code" inputMode="numeric" maxLength={6} autoFocus placeholder="••••••" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} />
      {err && <p className="error">{err}</p>}
      <button className="btn primary wide" disabled={busy || code.length !== 6}>Tasdiqlash</button>
      <button type="button" className="link" onClick={resend} disabled={busy}>Kodni qayta yuborish</button>
    </form></div>
  );

  return (
    <div className="auth-wrap"><form className="card auth" onSubmit={submit}>
      <h2>{mode === 'register' ? "Ro'yxatdan o'tish" : 'Tizimga kirish'}</h2>
      <label>Ism<input className="input" value={f.name} onChange={set('name')} autoComplete="username" required /></label>
      <label>Parol<input className="input" type="password" value={f.password} onChange={set('password')} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} required minLength={mode === 'register' ? 8 : 1} /></label>
      {mode === 'register' && (noEmail ? (
        <label>Telefon raqam<input className="input" type="tel" placeholder="+998 90 123 45 67" value={f.phone} onChange={set('phone')} required />
          <span className="muted small">Tasdiqlash kodi SMS orqali yuboriladi.</span></label>
      ) : (
        <label>Email<input className="input" type="email" value={f.email} onChange={set('email')} autoComplete="email" required /></label>
      ))}
      {mode === 'register' && <button type="button" className="link" onClick={() => setNoEmail(!noEmail)}>{noEmail ? 'Emailim bor' : 'Emailingiz yo\'qmi?'}</button>}
      {err && <p className="error">{err}</p>}
      <button className="btn primary wide" disabled={busy}>{mode === 'register' ? 'Kod yuborish' : 'Kirish'}</button>
      <p className="muted small center">{mode === 'register' ? <>Hisobingiz bormi? <Link to="/login">Kirish</Link></> : <>Hisobingiz yo'qmi? <Link to="/#about">Ro'yxatdan o'tish</Link></>}</p>
    </form></div>
  );
}
