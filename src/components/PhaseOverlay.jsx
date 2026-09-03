// Generic overlay for a game's pre-play phase (a memorize countdown, a
// "get ready" message, etc). Deliberately not Speed-Match specific — any
// future game with a reveal/prep phase before play starts can reuse this
// the same way WinMessage is reused for the end state.
//
//   dim  (default true)  a full-screen dimmed + blurred modal. Correct when
//        the overlay's own content IS what the player looks at (Digit Span
//        shows the digit here).
//   dim={false}          a small non-blocking banner pinned to the bottom,
//        no dim, no blur, clicks pass through. Use during "watch / memorize"
//        phases where the player must study the board *behind* the overlay
//        (Pattern Grid, Speed Match, Simon, Sequence/Terminal Recall).
export function PhaseOverlay({ title, subtitle, countdown, dim = true }) {
  return (
    <div className={`phase-overlay${dim ? "" : " phase-overlay--peek"}`}>
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
