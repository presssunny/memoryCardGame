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
//   action  { label, onClick }  a button inside the message — used for the
//        "▶ Start" gate on the memory games so nothing plays until the
//        player is ready. Renders in-flow (not a fixed overlay) so the
//        header's Back / Restart stay reachable while the gate is up.
export function PhaseOverlay({ title, subtitle, countdown, dim = true, action }) {
  const variant = action
    ? " phase-overlay--gate"
    : dim
      ? ""
      : " phase-overlay--peek";
  return (
    <div className={`phase-overlay${variant}`}>
      <div className="phase-message" role={action ? "dialog" : "status"} aria-live="polite">
        {countdown != null && (
          <div className="phase-countdown">{countdown}</div>
        )}
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
        {action && (
          <button
            type="button"
            className="phase-start-btn"
            onClick={action.onClick}
            autoFocus
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
