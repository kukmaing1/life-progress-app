export function StepsIllustration() {
  return (
    <svg viewBox="0 0 320 160" className="w-full max-w-xs" fill="none" aria-hidden="true">
      <path
        d="M10 140 H70 V110 H130 V90 H190 V60 H250 V30 H310"
        stroke="url(#stepGradient)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="70" cy="110" r="5" fill="#e8b86d" opacity="0.85" />
      <circle cx="190" cy="60" r="5" fill="#e8b86d" opacity="0.85" />
      <circle cx="310" cy="30" r="6" fill="#f0d5a8" />
      <circle cx="310" cy="30" r="18" fill="#e8b86d" opacity="0.2" />
      <defs>
        <linearGradient id="stepGradient" x1="0" y1="160" x2="320" y2="0">
          <stop offset="0%" stopColor="#e8b86d" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#f0d5a8" stopOpacity="0.9" />
        </linearGradient>
      </defs>
    </svg>
  );
}
