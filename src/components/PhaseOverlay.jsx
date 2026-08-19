// Generic full-screen overlay for a game's pre-play phase (a memorize
// countdown, a "get ready" message, etc). Deliberately not Speed-Match
// specific — any future game with a reveal/prep phase before play starts
// can reuse this the same way WinMessage is reused for the end state.
export function PhaseOverlay({ title, subtitle, countdown }) {
  return (
    <div className="phase-overlay">
      <div className="phase-message" role="status" aria-live="polite">
        {countdown != null && (
          <div className="phase-countdown">{countdown}</div>
        )}
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}
