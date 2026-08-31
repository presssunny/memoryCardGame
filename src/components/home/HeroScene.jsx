// The hero's floating 3D-ish scene: a controller lifting off a glowing
// podium above a perspective grid, ringed by drifting arcade objects.
// Built from one SVG + CSS so it stays crisp and light. All motion is
// transform/opacity only and pauses under prefers-reduced-motion.

const FLOATERS = [
  { icon: "👾", className: "hp-floater--invader" },
  { icon: "🏆", className: "hp-floater--trophy" },
  { icon: "⚡", className: "hp-floater--bolt" },
  { icon: "⭐", className: "hp-floater--star" },
  { icon: "🎲", className: "hp-floater--dice" },
  { icon: "💎", className: "hp-floater--gem" },
];

function Controller() {
  return (
    <svg
      className="hp-controller"
      viewBox="0 0 240 170"
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <linearGradient id="hp-ctrl-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4756c9" />
          <stop offset="0.55" stopColor="#2c2f7a" />
          <stop offset="1" stopColor="#191a44" />
        </linearGradient>
        <radialGradient id="hp-ctrl-stick" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#c084fc" />
          <stop offset="1" stopColor="#6d28d9" />
        </radialGradient>
      </defs>
      <path
        fill="url(#hp-ctrl-body)"
        stroke="rgba(150,180,255,0.55)"
        strokeWidth="1.5"
        d="M74 44h92c22 0 33 12 40 40l12 46c6 24-20 40-38 22l-16-18c-6-7-13-10-22-10H98c-9 0-16 3-22 10l-16 18c-18 18-44 2-38-22l12-46c7-28 18-40 40-40Z"
      />
      <path
        d="M52 74h30M67 59v30"
        stroke="#0c0e2c"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="168" cy="66" r="6" fill="#f0abfc" />
      <circle cx="186" cy="82" r="6" fill="#67e8f9" />
      <circle cx="150" cy="82" r="6" fill="#fda4af" />
      <circle cx="168" cy="98" r="6" fill="#fde68a" />
      <circle
        cx="98"
        cy="104"
        r="17"
        fill="url(#hp-ctrl-stick)"
        stroke="#a855f7"
        strokeWidth="2"
      />
      <circle
        cx="146"
        cy="118"
        r="17"
        fill="url(#hp-ctrl-stick)"
        stroke="#a855f7"
        strokeWidth="2"
      />
    </svg>
  );
}

export function HeroScene() {
  return (
    <div className="hp-scene" aria-hidden="true">
      <div className="hp-scene-aura" />
      <div className="hp-grid-floor" />
      <div className="hp-podium">
        <div className="hp-podium-ring" />
        <div className="hp-podium-top" />
      </div>
      <div className="hp-controller-wrap">
        <Controller />
        <div className="hp-controller-shadow" />
      </div>
      {FLOATERS.map((f) => (
        <span key={f.className} className={`hp-floater ${f.className}`}>
          {f.icon}
        </span>
      ))}
    </div>
  );
}
