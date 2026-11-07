import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppCtx } from './ctx.js';
import Navbar from './components/Navbar.jsx';
import Landing from './pages/Landing.jsx';
import Auth from './pages/Auth.jsx';
import Fields from './pages/Fields.jsx';
import Interview from './pages/Interview.jsx';
import { HistoryList, HistoryDetail } from './pages/History.jsx';

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [consent, setConsentState] = useState(() => !!localStorage.getItem('consent'));
  const ctx = {
    user, consent,
    login: (token, u) => { localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(u)); setUser(u); },
    logout: () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); },
    setConsent: (v) => {
      v ? localStorage.setItem('consent', new Date().toISOString()) : localStorage.removeItem('consent');
      setConsentState(v);
    },
  };
  const Guard = ({ children }) => (user ? children : <Navigate to="/login" replace />);
  return (
    <AppCtx.Provider value={ctx}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/fields" element={<Guard><Fields /></Guard>} />
          <Route path="/interview" element={<Guard><Interview /></Guard>} />
          <Route path="/history" element={<Guard><HistoryList /></Guard>} />
          <Route path="/history/:id" element={<Guard><HistoryDetail /></Guard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </AppCtx.Provider>
  );
}
