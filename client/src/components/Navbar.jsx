import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../ctx.js';
import { useClock, fmtTime } from '../time.js';

export default function Navbar() {
  const { user, consent, logout } = useApp();
  const now = useClock();
  const nav = useNavigate();
  return (
    <header className="nav">
      <Link to="/" className="brand"><span className="dot" />AI Interview</Link>
      <nav className="nav-links">
        {user ? (<>
          <NavLink to="/fields">Intervyu</NavLink>
          <NavLink to="/history">Suhbatlar tarixi</NavLink>
        </>) : (<>
          <Link to="/#about">Sayt haqida</Link>
          <Link to="/#security">Xavfsizlik</Link>
        </>)}
      </nav>
      <div className="nav-right">
        <span className="clock" title="Toshkent vaqti">UTC+5 · {fmtTime(now)}</span>
        {user ? (<>
          <span className="who">{user.name}</span>
          <button className="btn ghost" onClick={() => { logout(); nav('/'); }}>Chiqish</button>
        </>) : (<>
          <Link to="/login" className="btn ghost">Kirish</Link>
          {consent && <Link to="/register" className="btn primary pop">Ro'yxatdan o'tish</Link>}
        </>)}
      </div>
    </header>
  );
}
