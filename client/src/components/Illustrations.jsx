const G = ({ id }) => (
  <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff3d9a" /><stop offset="1" stopColor="#22d3ee" /></linearGradient></defs>
);
export const IllusCall = () => (
  <svg viewBox="0 0 320 200" className="illus" aria-hidden="true"><G id="g1" />
    <rect x="20" y="20" width="280" height="160" rx="16" fill="#2a1a6e" stroke="#8b5cf6" strokeWidth="2" />
    <rect x="36" y="36" width="170" height="128" rx="10" fill="#3b2a8f" />
    <circle cx="121" cy="86" r="22" fill="url(#g1)" /><path d="M76 164 q45 -56 90 0z" fill="#ffb020" />
    <rect x="218" y="36" width="66" height="50" rx="8" fill="#4c35b5" /><circle cx="251" cy="56" r="9" fill="#a3e635" /><path d="M232 86 q19 -20 38 0z" fill="#a3e635" />
    <rect x="218" y="96" width="66" height="8" rx="4" fill="#8b5cf6" /><rect x="218" y="112" width="48" height="8" rx="4" fill="#8b5cf6" /><rect x="218" y="128" width="58" height="8" rx="4" fill="#8b5cf6" />
    <circle cx="110" cy="176" r="9" fill="#ff4d5e" /></svg>
);
export const IllusSteps = () => (
  <svg viewBox="0 0 320 200" className="illus" aria-hidden="true"><G id="g2" />
    <rect x="40" y="26" width="240" height="148" rx="16" fill="#2a1a6e" stroke="#8b5cf6" strokeWidth="2" />
    <circle cx="160" cy="70" r="20" fill="url(#g2)" /><rect x="90" y="104" width="140" height="14" rx="7" fill="#8b5cf6" />
    <rect x="90" y="126" width="140" height="14" rx="7" fill="#8b5cf6" /><rect x="110" y="148" width="100" height="14" rx="7" fill="url(#g2)" />
    <path d="M250 40 l8 8 14 -16" stroke="#3ddc97" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const IllusShield = () => (
  <svg viewBox="0 0 320 200" className="illus" aria-hidden="true"><G id="g3" />
    <path d="M160 20 L240 48 V104 Q240 150 160 182 Q80 150 80 104 V48Z" fill="#2a1a6e" stroke="url(#g3)" strokeWidth="4" />
    <rect x="132" y="86" width="56" height="48" rx="8" fill="url(#g3)" /><path d="M141 86 v-12 a19 19 0 0 1 38 0 v12" stroke="#fff" strokeWidth="6" fill="none" />
    <circle cx="160" cy="110" r="6" fill="#2a1a6e" /></svg>
);
