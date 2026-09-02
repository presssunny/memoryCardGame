import "./gameUI.css";

// A floating "+10" style score pop. Render it (keyed on a nonce) at the
// point of action; it animates up and removes itself.
export function ScorePop({ text, bad = false, style }) {
  return (
    <span className={`gx-pop${bad ? " gx-pop--bad" : ""}`} style={style} aria-hidden="true">
      {text}
    </span>
  );
}

// A combo / streak badge that shows while `count` >= threshold. Keyed on
// `count` so it re-plays its entrance each time the streak climbs.
export function ComboBadge({ count, threshold = 3, label = "combo" }) {
  if (count < threshold) return null;
  return (
    <span key={count} className="gx-combo" aria-hidden="true">
      🔥 {label} ×{count}
    </span>
  );
}
