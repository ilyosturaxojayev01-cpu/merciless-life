import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useApp } from '../ctx.js';

export default function Auth({ mode }) {
  const { consent, login } = useApp();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', password: '' });
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

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { const r = await api.post(`/auth/${mode}`, f); login(r.token, r.user); nav('/fields'); }
    catch (x) { setErr(x.message); } finally { setBusy(false); }
  };

  return (
    <div className="auth-wrap"><form className="card auth" onSubmit={submit}>
      <h2>{mode === 'register' ? "Ro'yxatdan o'tish" : 'Tizimga kirish'}</h2>
      <label>Ism<input className="input" value={f.name} onChange={set('name')} autoComplete="username" required /></label>
      <label>Parol<input className="input" type="password" value={f.password} onChange={set('password')} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} required minLength={mode === 'register' ? 8 : 1} /></label>
      {err && <p className="error">{err}</p>}
      <button className="btn primary wide" disabled={busy}>{busy ? '…' : mode === 'register' ? "Ro'yxatdan o'tish" : 'Kirish'}</button>
      <p className="muted small center">{mode === 'register' ? <>Hisobingiz bormi? <Link to="/login">Kirish</Link></> : <>Hisobingiz yo'qmi? <Link to="/#about">Ro'yxatdan o'tish</Link></>}</p>
    </form></div>
  );
}
