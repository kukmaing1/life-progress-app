const STAIR_PATH = "M10 140 H70 V110 H130 V90 H190 V60 H250 V30 H310";

// Same color for every dot (per feedback — no more mixed gold/cream), and a
// slower pace: this is a calm, ambient illustration on the splash/onboarding
// screen, not a loading spinner, so it doesn't need to be fast or even
// finish a full lap before the screen moves on.
const DOT_COLOR = "#f0d5a8";
const LAP_DURATION = "5s";
const DOT_STAGGER = 0.9; // seconds between each dot starting its climb

export function StepsIllustration() {
  return (
    <svg viewBox="0 0 320 160" className="w-full max-w-xs" fill="none" aria-hidden="true">
      <path d={STAIR_PATH} stroke="url(#stepGradient)" strokeWidth="2" strokeLinecap="round">
        {/* The staircase itself gets the barest breathing pulse — a wink of
            life behind the climbing dots, not a competing animation. */}
        <animate attributeName="opacity" values="0.75;1;0.75" dur="4s" repeatCount="indefinite" />
      </path>

      {/* Ambient glow at the top of the stairs — the destination the dots climb toward. */}
      <circle cx="310" cy="30" r="18" fill="#e8b86d" opacity="0.2" />

      {/*
        Three dots climbing the staircase one after another — same color,
        staggered start times so they read as a short train following the
        same path rather than three unrelated loops.
      */}
      {[0, 1, 2].map((i) => {
        const begin = `${i * DOT_STAGGER}s`;
        return (
          <circle key={i} r="5" fill={DOT_COLOR}>
            <animateMotion dur={LAP_DURATION} begin={begin} repeatCount="indefinite" path={STAIR_PATH} />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.06;0.9;1"
              dur={LAP_DURATION}
              begin={begin}
              repeatCount="indefinite"
            />
          </circle>
        );
      })}

      <defs>
        <linearGradient id="stepGradient" x1="0" y1="160" x2="320" y2="0">
          <stop offset="0%" stopColor="#e8b86d" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#f0d5a8" stopOpacity="0.9" />
        </linearGradient>
      </defs>
    </svg>
  );
}
