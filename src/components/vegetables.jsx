/* Premium flat-design vegetable illustrations built as inline SVGs.
   Each veggie uses soft gradients + subtle highlights for the "morning light" feel. */

export function Tomato({ className = '' }) {
  return (
    <svg viewBox="0 0 120 110" className={className} fill="none">
      <defs>
        <radialGradient id="tomato-body" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="#FF8A65" />
          <stop offset="45%" stopColor="#F44336" />
          <stop offset="100%" stopColor="#C62828" />
        </radialGradient>
        <radialGradient id="tomato-shine" cx="0.35" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="66" rx="46" ry="40" fill="url(#tomato-body)" />
      <ellipse cx="46" cy="52" rx="16" ry="13" fill="url(#tomato-shine)" opacity="0.7" />
      <path d="M60 34c0-8-4-13-10-15M60 34c0-8 4-13 10-15" stroke="#388E3C" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M60 34c-6 2-9 6-10 13M60 34c6 2 9 6 10 13" stroke="#43A047" strokeWidth="3" strokeLinecap="round" />
      <path d="M52 30c-4-1-7-3-9-7" stroke="#388E3C" strokeWidth="3" strokeLinecap="round" />
      <path d="M68 30c4-1 7-3 9-7" stroke="#388E3C" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="74" cy="50" rx="5" ry="3.5" fill="#B71C1C" opacity="0.5" />
    </svg>
  )
}

export function Carrot({ className = '' }) {
  return (
    <svg viewBox="0 0 110 130" className={className} fill="none">
      <defs>
        <linearGradient id="carrot-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFB300" />
          <stop offset="55%" stopColor="#FB8C00" />
          <stop offset="100%" stopColor="#EF6C00" />
        </linearGradient>
      </defs>
      <path d="M55 20C40 38 36 58 42 74c4 13 4 27-2 40l6 4c-2-8 4-16 10-22 8-22 8-48 12-66 2-11-4-14-13-10z" fill="url(#carrot-body)" />
      <path d="M47 30c3-3 8-5 13-6" stroke="#E65100" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M52 20C40 8 26 4 16 2M52 20c4-10 2-20-2-26" stroke="#43A047" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M52 20c-6-4-12-3-16 1M52 20c-2-8 2-14 8-17" stroke="#66BB6A" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function Capsicum({ className = '' }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <defs>
        <linearGradient id="caps-body" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#81C784" />
          <stop offset="45%" stopColor="#43A047" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
        <linearGradient id="caps-dark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#388E3C" />
          <stop offset="100%" stopColor="#1B5E20" />
        </linearGradient>
      </defs>
      {/* Main bell shape */}
      <path d="M60 30C38 32 22 44 22 62c0 20 16 30 38 32 22-2 38-12 38-32 0-18-16-30-38-32z" fill="url(#caps-body)" />
      {/* Lobes */}
      <path d="M42 62c-6 8-6 16-2 22" stroke="url(#caps-dark)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M78 62c6 8 6 16 2 22" stroke="url(#caps-dark)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M60 58v28" stroke="url(#caps-dark)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4" />
      {/* Shine */}
      <ellipse cx="44" cy="52" rx="14" ry="12" fill="white" opacity="0.28" />
      {/* Stem */}
      <rect x="56" y="16" width="8" height="16" rx="4" fill="#5D4037" />
      <path d="M60 18c-2-6 2-12 8-14M60 18c2-6-2-12-8-14" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="60" cy="32" rx="10" ry="4" fill="#2E7D32" opacity="0.6" />
    </svg>
  )
}

export function Broccoli({ className = '' }) {
  return (
    <svg viewBox="0 0 130 120" className={className} fill="none">
      <defs>
        <radialGradient id="broc-top" cx="0.4" cy="0.35" r="1">
          <stop offset="0%" stopColor="#81C784" />
          <stop offset="55%" stopColor="#43A047" />
          <stop offset="100%" stopColor="#2E7D32" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="40" r="26" fill="url(#broc-top)" />
      <circle cx="80" cy="34" r="28" fill="url(#broc-top)" />
      <circle cx="65" cy="24" r="24" fill="url(#broc-top)" />
      <circle cx="44" cy="52" r="18" fill="url(#broc-top)" />
      <circle cx="76" cy="52" r="20" fill="url(#broc-top)" />
      <circle cx="60" cy="44" r="10" fill="#66BB6A" opacity="0.5" />
      <circle cx="78" cy="30" r="6" fill="#A5D6A7" opacity="0.5" />
      <path d="M62 70c0 8 2 14 6 20M62 70c-4 6-4 12-2 18M62 70c6 4 10 4 14 3" stroke="#6D4C41" strokeWidth="6" strokeLinecap="round" />
      <path d="M68 88c3 2 6 3 9 3M68 88c2 3 3 6 3 9" stroke="#6D4C41" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function Onion({ className = '' }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <defs>
        <radialGradient id="onion-body" cx="0.4" cy="0.35" r="0.95">
          <stop offset="0%" stopColor="#FFF3E0" />
          <stop offset="50%" stopColor="#F1D8B8" />
          <stop offset="100%" stopColor="#D7A868" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="66" rx="44" ry="38" fill="url(#onion-body)" />
      <ellipse cx="48" cy="54" rx="15" ry="11" fill="rgba(255,255,255,0.75)" opacity="0.6" />
      <path d="M60 34c0-6-3-11-7-14M60 34c0-6 3-11 7-14" stroke="#66BB6A" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M60 30c-5-2-9-5-11-9M60 30c5-2 9-5 11-9" stroke="#81C784" strokeWidth="3" strokeLinecap="round" />
      <path d="M46 28c-4-1-8 0-11 2" stroke="#66BB6A" strokeWidth="3" strokeLinecap="round" />
      <path d="M74 28c4-1 8 0 11 2" stroke="#66BB6A" strokeWidth="3" strokeLinecap="round" />
      <path d="M28 70c-4 4-5 9-4 14" stroke="#A1887F" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

export function Leaf({ className = '' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none">
      <path d="M20 4c8 0 14 6 16 14 2 9-4 16-16 18C8 34 2 28 2 20 2 10 11 4 20 4z" fill="currentColor" opacity="0.9" />
      <path d="M20 8v20M20 16c-4-3-9-3-12-2M20 22c5-2 10-1 13 1" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function LeafBig({ className = '' }) {
  return (
    <svg viewBox="0 0 70 70" className={className} fill="none">
      <path d="M35 6c15 0 26 11 30 26 4 17-8 30-30 33C13 62 4 52 4 37 4 18 20 6 35 6z" fill="currentColor" opacity="0.85" />
      <path d="M35 12v42M35 26c-8-6-18-6-24-4M35 40c9-4 18-2 24 2" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function SpinachLeaf({ className = '' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <path d="M6 42C6 24 20 12 42 8c0 22-10 36-28 34-4 0-8-2-8-0z" fill="currentColor" opacity="0.9" />
      <path d="M12 36c8-8 18-14 26-20" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M14 30c6-5 14-9 20-12" stroke="rgba(255,255,255,0.35)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  )
}
