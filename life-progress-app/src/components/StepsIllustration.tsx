// Total length of the path below (sum of every H/V segment) — used so the
// traveling highlight's dash pattern (dash + gap) tiles the route exactly
// once, and so animating stroke-dashoffset by exactly this amount loops
// seamlessly with no visible jump when it restarts.
const STAIR_PATH = "M10 140 H70 V110 H130 V90 H190 V60 H250 V30 H310";
const STAIR_PATH_LENGTH = 410;

/**
 * The onboarding/splash staircase. Dots stay put at fixed positions and
 * pulse gently in place; the route itself comes alive via a soft highlight
 * traveling along it, slowly, in the same gold family as the line rather
 * than a contrasting color.
 */
export function StepsIllustration() {
  return (
    <svg viewBox="0 0 320 160" className="w-full max-w-xs" fill="none" aria-hidden="true">
      <style>{`
        @keyframes lp-stair-line-glow { 0%, 100% { opacity: 0.75; } 50% { opacity: 1; } }
        @keyframes lp-stair-dot-pulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes lp-stair-flow { to { stroke-dashoffset: -${STAIR_PATH_LENGTH}; } }
        .lp-stair-path { animation: lp-stair-line-glow 4s ease-in-out infinite; }
        .lp-stair-dot {
          transform-box: fill-box;
          transform-origin: center;
          animation: lp-stair-dot-pulse 2.6s ease-in-out infinite;
        }
        .lp-stair-flow {
          stroke-dasharray: 60 ${STAIR_PATH_LENGTH - 60};
          animation: lp-stair-flow 7s linear infinite;
        }
      `}</style>

      <path d={STAIR_PATH} className="lp-stair-path" stroke="url(#stepGradient)" strokeWidth="2" strokeLinecap="round" />

      {/* Traveling highlight — same gold family as the line (just a shade
          lighter), so it reads as the line glowing rather than a
          different-colored object sliding over it. Slow: a calm current,
          not a race. */}
      <path d={STAIR_PATH} className="lp-stair-flow" stroke="#f0d5a8" strokeWidth="2" strokeLinecap="round" opacity="0.9" />

      <circle cx="70" cy="110" r="5" fill="#e8b86d" opacity="0.85" className="lp-stair-dot" />
      <circle cx="190" cy="60" r="5" fill="#e8b86d" opacity="0.85" className="lp-stair-dot" />
      <circle cx="310" cy="30" r="18" fill="#e8b86d" opacity="0.2" />
      <circle cx="310" cy="30" r="6" fill="#f0d5a8" className="lp-stair-dot" />

      <defs>
        <linearGradient id="stepGradient" x1="0" y1="160" x2="320" y2="0">
          <stop offset="0%" stopColor="#e8b86d" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#f0d5a8" stopOpacity="0.9" />
        </linearGradient>
      </defs>
    </svg>
  );
}
