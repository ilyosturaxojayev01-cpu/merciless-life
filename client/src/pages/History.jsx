import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { fmt, fmtDay, fmtTime, fmtDur } from '../time.js';

export function HistoryList() {
  const [list, setList] = useState(null);
  useEffect(() => { api.get('/interviews').then(setList).catch(() => setList([])); }, []);
  if (!list) return <div className="page muted">Yuklanmoqda…</div>;
  const days = list.reduce((m, iv) => ((m[iv.dayKey] ||= []).push(iv), m), {});
  return (
    <div className="page">
      <h1 className="page-title">Suhbatlar tarixi</h1>
      {!list.length && <div className="card"><p>Hali suhbat yo'q.</p><Link className="btn primary" to="/fields">Birinchi suhbatni boshlash</Link></div>}
      {Object.entries(days).map(([k, items]) => (
        <section key={k} className="day">
          <h3>{fmtDay(items[0].startedAt)}</h3>
          {items.map((iv) => (
            <Link key={iv._id} to={`/history/${iv._id}`} className="hrow">
              <b>{iv.fieldTitle}</b>
              <span className="muted">{fmtTime(iv.startedAt)} – {fmtTime(iv.endedAt)} · {fmtDur(iv.durationSec)}</span>
            </Link>
          ))}
        </section>
      ))}
    </div>
  );
}

export function HistoryDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [iv, setIv] = useState(null);
  useEffect(() => { api.get(`/interviews/${id}`).then(setIv).catch(() => nav('/history')); }, [id]);
  if (!iv) return <div className="page muted">Yuklanmoqda…</div>;

  const download = () => {
    const txt = `${iv.fieldTitle}\n${fmt(iv.startedAt, { dateStyle: 'full', timeStyle: 'medium' })} (UTC+5)\n\n` +
      iv.transcript.map((m) => `[${fmtTime(m.at)}] ${m.role === 'ai' ? 'SAVOL (AI)' : 'JAVOB (Siz)'}: ${m.text}`).join('\n\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' }));
    a.download = `intervyu-${iv.dayKey}.txt`; a.click();
  };
  const remove = async () => { if (confirm("Bu yozuvni butunlay o'chirasizmi?")) { await api.del(`/interviews/${id}`); nav('/history'); } };

  return (
    <div className="page narrow">
      <Link to="/history" className="muted">← Tarixga qaytish</Link>
      <h1 className="page-title">{iv.fieldTitle}</h1>
      <p className="muted">{fmt(iv.startedAt, { dateStyle: 'full', timeStyle: 'medium' })} (UTC+5) · {fmtDur(iv.durationSec)}</p>
      <div className="row"><button className="btn ghost" onClick={download}>Matnni yuklab olish</button><button className="btn danger" onClick={remove}>O'chirish</button></div>
      <div className="transcript">
        {iv.transcript.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}><small>{m.role === 'ai' ? 'Savol · AI intervyuer' : 'Javob · Siz'} · {fmtTime(m.at)}</small>{m.text}</div>
        ))}
        {!iv.transcript.length && <p className="muted">Matn yozilmadi (suhbat juda qisqa bo'lgan bo'lishi mumkin).</p>}
      </div>
    </div>
  );
}
