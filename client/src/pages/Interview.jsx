import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { startLive } from '../live.js';
import { useClock, fmtTime } from '../time.js';
import Avatar from '../components/Avatar.jsx';

const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function Interview() {
  const session = useLocation().state?.session;
  const nav = useNavigate();
  const now = useClock();
  const videoRef = useRef(null), ctl = useRef(null), streamRef = useRef(null), started = useRef(false), entriesRef = useRef([]), capRef = useRef(null);
  const [status, setStatus] = useState('connecting');
  const [err, setErr] = useState('');
  const [level, setLevel] = useState(0);
  const [entries, setEntries] = useState([]);
  const [partial, setPartial] = useState(null);
  const [mic, setMic] = useState(true), [cam, setCam] = useState(true);
  const [secs, setSecs] = useState(0);
  const [saving, setSaving] = useState(false);

  const release = () => { ctl.current?.stop(); ctl.current = null; streamRef.current?.getTracks().forEach((t) => t.stop()); streamRef.current = null; };

  useEffect(() => {
    if (!session) { nav('/fields', { replace: true }); return; }
    if (started.current) return;
    started.current = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: { width: 640, height: 480, facingMode: 'user' } });
        streamRef.current = stream; videoRef.current.srcObject = stream; await videoRef.current.play().catch(() => {});
        ctl.current = await startLive({
          session, stream, videoEl: videoRef.current,
          onEntry: (e) => { entriesRef.current.push(e); setEntries([...entriesRef.current]); },
          onPartial: setPartial, onLevel: setLevel, onStatus: setStatus, onClose: () => setStatus('closed'),
        });
      } catch (e) {
        setStatus('error');
        setErr(e.name === 'NotAllowedError' ? "Kamera va mikrofonga ruxsat berilmadi. Brauzer sozlamalaridan ruxsat bering." : 'Ulanib bo\'lmadi: ' + (e.message || e));
      }
    })();
    return release;
  }, []);

  useEffect(() => { if (status !== 'live') return; const t = setInterval(() => setSecs((s) => s + 1), 1000); return () => clearInterval(t); }, [status]);
  useEffect(() => { capRef.current?.scrollTo({ top: 1e6, behavior: 'smooth' }); }, [entries, partial]);

  const toggleMic = () => { ctl.current?.setMuted(mic); setMic(!mic); };
  const toggleCam = () => { const v = !cam; ctl.current?.setCam(v); streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = v)); setCam(v); };
  const hangUp = async () => {
    setSaving(true); release();
    try { const r = await api.patch(`/interviews/${session.interviewId}/finish`, { transcript: entriesRef.current }); nav(`/history/${r.id}`, { replace: true }); }
    catch (e) { setErr(e.message); setSaving(false); }
  };
  if (!session) return null;
  const label = { connecting: 'Ulanmoqda…', live: 'Jonli', error: 'Xatolik', closed: 'Aloqa uzildi' }[status];

  return (
    <div className="call">
      <div className="call-head">
        <div><b>{session.field.title}</b><span className="muted"> · {session.field.org}</span></div>
        <div className={`status ${status}`}><span className="rec" /> {label} · {mmss(secs)}</div>
        <div className="muted">Toshkent: {fmtTime(now)}</div>
      </div>
      <div className="call-body">
        <div className="stage" style={{ '--ac': session.field.accent }}>
          <Avatar outfit={session.field} level={level} />
          <div className="nameplate">AI intervyuer · {session.field.org}</div>
          <div className={`pip ${cam ? '' : 'off'}`}><video ref={videoRef} muted playsInline />{!cam && <span>Kamera o'chiq</span>}</div>
        </div>
        <aside className="captions" ref={capRef}>
          <h3>Suhbat matni</h3>
          {entries.map((e, i) => <p key={i} className={`bubble ${e.role}`}><small>{e.role === 'ai' ? 'AI' : 'Siz'} · {fmtTime(e.at)}</small>{e.text}</p>)}
          {partial && <p className={`bubble ${partial.role} live`}><small>{partial.role === 'ai' ? 'AI' : 'Siz'}</small>{partial.text}</p>}
          {!entries.length && !partial && <p className="muted">Suhbat boshlanganda savollar va javoblar shu yerda matn bo'lib chiqadi.</p>}
        </aside>
      </div>
      {err && <p className="error center">{err}</p>}
      {status === 'closed' && <p className="error center">Aloqa uzildi. Suhbatni tugatib, shu paytgacha yozilgan matnni saqlang.</p>}
      <div className="controls">
        <button className={`round ${mic ? '' : 'off'}`} onClick={toggleMic} aria-label="Mikrofon">{mic ? '🎙️' : '🔇'}</button>
        <button className="round hang" onClick={hangUp} disabled={saving} aria-label="Suhbatni tugatish">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="#fff"><path d="M12 9c-3.2 0-6.3 1-8.4 3.2-.6.7-.6 1.7 0 2.4l1.5 1.5c.5.5 1.3.6 1.9.2l2.2-1.4c.4-.3.7-.7.7-1.2v-1.4c1.2-.4 2.8-.4 4.2 0v1.4c0 .5.3.9.7 1.2l2.2 1.4c.6.4 1.4.3 1.9-.2l1.5-1.5c.6-.7.6-1.7 0-2.4C18.3 10 15.2 9 12 9z" /></svg>
        </button>
        <button className={`round ${cam ? '' : 'off'}`} onClick={toggleCam} aria-label="Kamera">{cam ? '📷' : '🚫'}</button>
      </div>
    </div>
  );
}
