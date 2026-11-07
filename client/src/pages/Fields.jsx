import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { LANGS } from '../data.js';

export default function Fields() {
  const nav = useNavigate();
  const [fields, setFields] = useState([]);
  const [sel, setSel] = useState(null);
  const [lang, setLang] = useState('uz');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  useEffect(() => { api.get('/fields').then(setFields).catch((e) => setErr(e.message)); }, []);

  const start = async () => {
    setErr(''); setBusy(true);
    try { nav('/interview', { state: { session: await api.post('/interviews/start', { fieldId: sel.id, language: lang }) } }); }
    catch (e) { setErr(e.message); setBusy(false); }
  };
  return (
    <div className="page">
      <h1 className="page-title">Qaysi soha bo'yicha suhbatlashamiz?</h1>
      <p className="muted">Yo'nalishni tanlang. AI intervyuer shu sohaga xos kiyimda chiqadi va aynan shu soha uchun savollar beradi.</p>
      <div className="grid">
        {fields.map((f) => (
          <button key={f.id} className={`field ${sel?.id === f.id ? 'on' : ''}`} style={{ '--ac': f.accent }} onClick={() => setSel(f)}>
            <span className="ficon">{f.icon}</span>
            <span className="ftitle">{f.title}</span>
            <span className="forg">{f.org}</span>
          </button>
        ))}
      </div>
      <div className="startbar">
        <div className="langs">{LANGS.map((l) => <button key={l.id} className={`chip ${lang === l.id ? 'on' : ''}`} onClick={() => setLang(l.id)}>{l.label}</button>)}</div>
        <span className="muted">{sel ? sel.title : 'Yo\'nalish tanlanmagan'}</span>
        {err && <span className="error">{err}</span>}
        <button className="btn primary" disabled={!sel || busy} onClick={start}>{busy ? 'Ulanmoqda…' : 'Suhbatni boshlash'}</button>
      </div>
    </div>
  );
}
