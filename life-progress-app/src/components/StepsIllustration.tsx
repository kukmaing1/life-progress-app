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

      {/*
        The "climbing" dot — steady upward movement along the staircase,
        looping, rather than a pulse in place: matches "build a better
        version of yourself" better as a small, continuous step-by-step
        motion. Soft glow halo trails the same path behind the bright core.
        Opacity fades in right after the loop restarts and out right before
        it does, so the jump back to the start happens while invisible
        instead of as a visible snap.
      */}
      <circle r="13" fill="#e8b86d" opacity="0.22">
        <animateMotion
          dur="2.8s"
          repeatCount="indefinite"
          path="M10 140 H70 V110 H130 V90 H190 V60 H250 V30 H310"
        />
        <animate
          attributeName="opacity"
          values="0;0.22;0.22;0"
          keyTimes="0;0.08;0.92;1"
          dur="2.8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle r="5" fill="#f6efe3">
        <animateMotion
          dur="2.8s"
          repeatCount="indefinite"
          path="M10 140 H70 V110 H130 V90 H190 V60 H250 V30 H310"
        />
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.08;0.92;1"
          dur="2.8s"
          repeatCount="indefinite"
        />
      </circle>

      <defs>
        <linearGradient id="stepGradient" x1="0" y1="160" x2="320" y2="0">
          <stop offset="0%" stopColor="#e8b86d" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#f0d5a8" stopOpacity="0.9" />
        </linearGradient>
      </defs>
    </svg>
  );
}
