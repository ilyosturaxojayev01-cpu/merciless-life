import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { LANGS } from '../data.js';
import { getAvatarUrl, setAvatarUrl, isImageUrl } from '../avatarStore.js';

export default function Fields() {
  const nav = useNavigate();
  const [fields, setFields] = useState([]);
  const [sel, setSel] = useState(null);
  const [lang, setLang] = useState('uz');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [url, setUrl] = useState('');
  const [ver, setVer] = useState(0);
  const [imgOpen, setImgOpen] = useState(false);
  const [imgOk, setImgOk] = useState(true);
  useEffect(() => { api.get('/fields').then(setFields).catch((e) => setErr(e.message)); }, []);

  useEffect(() => { setUrl(sel ? getAvatarUrl(sel.id) : ''); setImgOk(true); }, [sel]);
  const saveImg = () => {
    if (url && !isImageUrl(url.trim())) { setErr("Rasm manzili https:// bilan boshlanishi kerak"); return; }
    setErr(''); setAvatarUrl(sel.id, url.trim()); setVer(ver + 1);
  };

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
            <span className="forg">{f.org}{getAvatarUrl(f.id) && ver >= 0 ? ' · 🖼' : ''}</span>
          </button>
        ))}
      </div>
      {sel && imgOpen && (
        <div className="imgmodal" onClick={() => setImgOpen(false)}>
        <div className="imgbox" onClick={(e) => e.stopPropagation()}>
          <div className="imgprev">
            {url && imgOk ? <img src={url} referrerPolicy="no-referrer" alt="" onError={() => setImgOk(false)} onLoad={() => setImgOk(true)} /> : <span>{url ? 'Rasm ochilmadi' : sel.icon}</span>}
          </div>
          <div className="imgform">
            <b>«{sel.title}» intervyuerining rasmi <button className="imgx" onClick={() => setImgOpen(false)} aria-label="Yopish">✕</button></b>
            <small className="muted">Google'da rasmni toping → rasm ustida o'ng tugma → «Rasm manzilini nusxalash» (Copy image address) → shu yerga qo'ying. Manzil .jpg/.png/.webp bilan tugagani yaxshi.</small>
            <input value={url} onChange={(e) => { setUrl(e.target.value); setImgOk(true); }} placeholder="https://.../rasm.jpg" />
            <div className="row">
              <button className="btn primary" onClick={saveImg}>Saqlash</button>
              <button className="btn" onClick={() => { setUrl(''); setAvatarUrl(sel.id, ''); setVer(ver + 1); }}>O'chirish</button>
            </div>
          </div>
        </div>
        </div>
      )}
      <div className="startbar">
        <div className="langs">{LANGS.map((l) => <button key={l.id} className={`chip ${lang === l.id ? 'on' : ''}`} onClick={() => setLang(l.id)}>{l.label}</button>)}</div>
        <button className="btn" disabled={!sel} onClick={() => setImgOpen(true)}>🖼 Rasm qo'yish</button>
        <span className="muted">{sel ? sel.title : 'Yo\'nalish tanlanmagan'}</span>
        {err && <span className="error">{err}</span>}
        <button className="btn primary" disabled={!sel || busy} onClick={start}>{busy ? 'Ulanmoqda…' : 'Suhbatni boshlash'}</button>
      </div>
    </div>
  );
}
