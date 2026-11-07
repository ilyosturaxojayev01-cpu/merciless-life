// AI suhbatdosh: kasbga qarab kiyimi (dress-kod) o'zgaradi; ovoz balandligiga qarab lablari harakatlanadi.
const SKIN = '#e3b48f';
const HAT = ['military', 'police', 'pilot', 'fire', 'hardhat', 'chef'];
const GLASSES = ['teacher', 'creative'];

function Torso({ kind, color, accent }) {
  const shade = 'rgba(0,0,0,.22)';
  const base = <path d="M30 520 C30 410 100 372 200 372 C300 372 370 410 370 520Z" fill={kind === 'hardhat' ? '#475569' : color} />;
  switch (kind) {
    case 'suit': return (<>{base}
      <path d="M200 382 L148 372 L176 480 Z" fill={shade} /><path d="M200 382 L252 372 L224 480 Z" fill={shade} />
      <path d="M165 374 L200 440 L235 374Z" fill="#f8fafc" />
      <rect x="191" y="398" width="18" height="16" rx="3" fill={accent} /><path d="M193 412h14l7 72-14 14-14-14z" fill={accent} /></>);
    case 'smart': return (<>{base}
      <path d="M200 386 L150 372 L178 470 Z" fill={shade} /><path d="M200 386 L250 372 L222 470 Z" fill={shade} />
      <path d="M168 374 Q200 420 232 374Z" fill="#e5e7eb" /><circle cx="270" cy="440" r="5" fill={accent} /></>);
    case 'military': return (<>{base}
      <path d="M160 374 L200 392 L240 374 L236 412 L200 424 L164 412Z" fill={shade} stroke={accent} strokeWidth="2" />
      <rect x="62" y="408" width="66" height="14" rx="3" fill={accent} transform="rotate(-16 95 415)" />
      <rect x="272" y="408" width="66" height="14" rx="3" fill={accent} transform="rotate(16 305 415)" />
      {[0, 1, 2].map((i) => <rect key={i} x={248 + i * 14} y="448" width="10" height="14" fill={['#b91c1c', accent, '#1d4ed8'][i]} />)}
      <rect x="100" y="456" width="48" height="34" rx="3" fill="none" stroke={shade} strokeWidth="3" />
      <path d="M192 424h16l4 70-12 8-12-8z" fill="#111827" /></>);
    case 'police': return (<>{base}
      <path d="M160 374 L200 396 L240 374 L236 410 L200 422 L164 410Z" fill={shade} />
      <path d="M266 428 l16 -5 l16 5 v20 q0 13 -16 20 q-16 -7 -16 -20z" fill={accent} stroke="#92400e" strokeWidth="2" />
      <rect x="64" y="412" width="58" height="10" rx="3" fill={accent} transform="rotate(-16 93 417)" />
      <rect x="278" y="412" width="58" height="10" rx="3" fill={accent} transform="rotate(16 307 417)" />
      <path d="M192 422h16l3 62-11 8-11-8z" fill="#0b1224" /></>);
    case 'medical': return (<>{base}
      <path d="M165 374 L200 436 L235 374Z" fill="#14b8a6" />
      <path d="M200 382 L150 372 L172 500 Z" fill="rgba(0,0,0,.08)" /><path d="M200 382 L250 372 L228 500 Z" fill="rgba(0,0,0,.08)" />
      <path d="M163 378 C146 462 192 486 200 452 M237 378 C254 462 208 486 200 452" stroke="#334155" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="200" cy="470" r="9" fill={accent} stroke="#334155" strokeWidth="3" /></>);
    case 'teacher': return (<>{base}
      <path d="M170 374 L200 430 L230 374Z" fill="#f8fafc" />
      <path d="M200 430 V520" stroke={shade} strokeWidth="4" />{[450, 480].map((y) => <circle key={y} cx="190" cy={y} r="4" fill={accent} />)}</>);
    case 'creative': return (<>{base}
      <rect x="158" y="338" width="84" height="48" rx="22" fill={color} /><rect x="158" y="338" width="84" height="48" rx="22" fill="rgba(255,255,255,.1)" />
      <circle cx="200" cy="450" r="7" fill={accent} /></>);
    case 'chef': return (<>{base}
      <path d="M170 376 L230 376 L200 414Z" fill={accent} />
      <path d="M200 400 V520" stroke="#cbd5e1" strokeWidth="3" />
      {[430, 462, 494].map((y) => <g key={y}><circle cx="178" cy={y} r="5" fill="#cbd5e1" /><circle cx="222" cy={y} r="5" fill="#cbd5e1" /></g>)}</>);
    case 'pilot': return (<>{base}
      <path d="M165 374 L200 432 L235 374Z" fill="#f8fafc" /><path d="M192 410h16l3 76-11 8-11-8z" fill="#0b1224" />
      {[0, 1, 2].map((i) => <rect key={i} x="66" y={410 + i * 9} width="56" height="5" fill={accent} transform="rotate(-16 94 420)" />)}
      {[0, 1, 2].map((i) => <rect key={i} x="278" y={410 + i * 9} width="56" height="5" fill={accent} transform="rotate(16 306 420)" />)}
      <path d="M250 450 q28 -16 54 -4 q-24 6 -54 14z" fill={accent} /></>);
    case 'fire': return (<>
      <clipPath id="tc"><path d="M30 520 C30 410 100 372 200 372 C300 372 370 410 370 520Z" /></clipPath>{base}
      <g clipPath="url(#tc)"><rect x="0" y="440" width="400" height="14" fill={accent} /><rect x="0" y="476" width="400" height="14" fill={accent} /></g>
      <path d="M200 380 V520" stroke="rgba(0,0,0,.35)" strokeWidth="4" /></>);
    case 'hardhat': return (<>{base}
      <path d="M92 520 L116 402 L172 378 L190 520Z" fill={color} /><path d="M308 520 L284 402 L228 378 L210 520Z" fill={color} />
      <path d="M104 470 L184 470 M298 470 L216 470 M100 496 L186 496 M300 496 L214 496" stroke={accent} strokeWidth="9" /></>);
    default: return base;
  }
}

function Hat({ kind, color, accent }) {
  const dome = (fill) => <path d="M136 208 Q134 108 200 104 Q266 108 264 208 Z" fill={fill} />;
  switch (kind) {
    case 'military': return (<>{dome(color)}<rect x="124" y="196" width="152" height="15" rx="7" fill="#161616" /><circle cx="200" cy="164" r="10" fill={accent} /></>);
    case 'police': return (<>{dome(color)}<rect x="124" y="196" width="152" height="15" rx="7" fill="#0b1224" /><rect x="136" y="184" width="128" height="9" fill={accent} /><path d="M200 150 l9 6 v10 q0 8 -9 12 q-9 -4 -9 -12 v-10z" fill={accent} /></>);
    case 'pilot': return (<>{dome('#111827')}<rect x="124" y="196" width="152" height="15" rx="7" fill="#0b1224" /><rect x="136" y="184" width="128" height="9" fill="#f8fafc" /><path d="M176 160 q24 -14 48 0 q-24 6 -48 0z" fill={accent} /></>);
    case 'fire': return (<>{dome(accent)}<rect x="118" y="198" width="164" height="16" rx="8" fill={accent} /><path d="M200 112 V196" stroke="rgba(0,0,0,.25)" strokeWidth="6" /><rect x="178" y="150" width="44" height="26" rx="6" fill="#b91c1c" /></>);
    case 'hardhat': return (<>{dome('#f8fafc')}<rect x="118" y="198" width="164" height="16" rx="8" fill="#e2e8f0" /><path d="M200 106 V196" stroke="#cbd5e1" strokeWidth="8" /></>);
    case 'chef': return (<g fill="#fff" stroke="#e2e8f0" strokeWidth="2"><rect x="146" y="158" width="108" height="46" rx="8" /><circle cx="162" cy="136" r="34" /><circle cx="200" cy="116" r="42" /><circle cx="238" cy="136" r="34" /><rect x="146" y="158" width="108" height="46" rx="8" stroke="none" /></g>);
    default: return null;
  }
}

export default function Avatar({ outfit, level = 0 }) {
  const { kind = 'suit', color = '#27304f', accent = '#6d7cff' } = outfit || {};
  const mouthH = 3 + Math.min(1, level * 2.2) * 15;
  const hasHat = HAT.includes(kind);
  return (
    <svg viewBox="0 0 400 520" className="avatar" role="img" aria-label="AI suhbatdosh">
      <defs><linearGradient id="skin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f0c5a1" /><stop offset="1" stopColor="#d9a47c" /></linearGradient></defs>
      <rect x="172" y="318" width="56" height="70" rx="20" fill="url(#skin)" />
      <Torso kind={kind} color={color} accent={accent} />
      <ellipse cx="136" cy="252" rx="10" ry="17" fill="#d29b74" /><ellipse cx="264" cy="252" rx="10" ry="17" fill="#d29b74" />
      <ellipse cx="200" cy="250" rx="64" ry="77" fill="url(#skin)" />
      {!hasHat && <path d="M134 244 Q128 156 200 154 Q272 156 266 244 Q252 202 200 198 Q148 202 134 244Z" fill="#2b1d16" />}
      <g className="eyes">
        <ellipse cx="174" cy="240" rx="9" ry="10" fill="#fff" /><ellipse cx="226" cy="240" rx="9" ry="10" fill="#fff" />
        <circle cx="175" cy="241" r="5" fill="#2b2230" /><circle cx="227" cy="241" r="5" fill="#2b2230" />
      </g>
      <path d="M160 222 Q174 214 188 221 M212 221 Q226 214 240 222" stroke="#2b1d16" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M200 246 Q194 272 202 274" stroke="#b9805c" strokeWidth="3" fill="none" strokeLinecap="round" />
      {GLASSES.includes(kind) && <g stroke="#111" strokeWidth="3" fill="rgba(255,255,255,.06)"><circle cx="174" cy="240" r="20" /><circle cx="226" cy="240" r="20" /><path d="M194 238 H206" /></g>}
      <ellipse cx="200" cy={298 + mouthH / 4} rx={16 + mouthH / 5} ry={mouthH / 2 + 1.5} fill="#5a1f2b" />
      <path d={`M182 ${297} Q200 ${301 - mouthH / 6} 218 297`} stroke="#b4544f" strokeWidth="3" fill="none" strokeLinecap="round" />
      <Hat kind={kind} color={color} accent={accent} />
    </svg>
  );
}
