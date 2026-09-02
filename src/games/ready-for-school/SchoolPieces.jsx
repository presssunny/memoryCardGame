import { Pic } from "../../components/game-ui/Pic";

// Wraps child-facing Hebrew copy (instructions, win notes) so it lays out
// right-to-left wherever the shared game chrome renders it. The Ready for
// School games are for pre-readers, so their prompts must be in Hebrew.
export function He({ children }) {
  return (
    <span dir="rtl" lang="he">
      {children}
    </span>
  );
}

// A gentle "try again" review row for the Hebrew quiz games: "✕ נסו שוב"
// plus one short line of why, and optionally the correct picture. Pairs with
// QuizStage highlighting the right option underneath.
export function SchoolTryAgain({ text, pic, children }) {
  return (
    <div className="school-review" dir="rtl">
      <p className="school-review-verdict">✕ נסו שוב</p>
      {pic && (
        <span className="school-review-pic">
          <Pic id={pic} decorative />
        </span>
      )}
      {text && <p className="school-review-text">{text}</p>}
      {children && <span className="school-review-pic">{children}</span>}
    </div>
  );
}

// A big Hebrew letter, always right-to-left.
export function HebrewLetter({ letter }) {
  return (
    <span className="school-hebrew" dir="rtl" lang="he">
      {letter}
    </span>
  );
}

// A row of identical pictures to count (`item` is a kids-asset id).
export function ItemsPrompt({ item, count }) {
  return (
    <span className="school-items" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="school-item">
          <Pic id={item} decorative />
        </span>
      ))}
    </span>
  );
}

// One sequence token: a picture ({ pic }) or a number ({ num }).
function SeqToken({ token }) {
  if (token && token.pic) {
    return (
      <span className="school-seq-token school-seq-pic">
        <Pic id={token.pic} decorative />
      </span>
    );
  }
  return <span className="school-seq-token">{token?.num ?? token}</span>;
}

// A sequence of tokens ending in "?".
export function SequencePrompt({ items }) {
  return (
    <span className="school-sequence" aria-hidden="true">
      {items.map((it, i) => (
        <SeqToken key={i} token={it} />
      ))}
      <span className="school-seq-token school-seq-q">?</span>
    </span>
  );
}

// "a + b = ?" with any one slot blank (missing: "a" | "b" | "result").
// Optional dot rows under the two *known* operands for the youngest.
export function MathPrompt({ a, b, op, result, missing = "result", showDots }) {
  const slot = (val, name) =>
    missing === name ? (
      <span className="school-math-blank">?</span>
    ) : (
      <span>{val}</span>
    );

  return (
    <span className="school-math" aria-hidden="true">
      <span className="school-math-line">
        {slot(a, "a")} {op} {slot(b, "b")} = {slot(result, "result")}
      </span>
      {showDots && missing === "result" && (
        <span className="school-math-dots">
          <span className="school-dot-group">{"●".repeat(a)}</span>
          <span className="school-math-op">{op}</span>
          <span className="school-dot-group">{"●".repeat(b)}</span>
        </span>
      )}
    </span>
  );
}

// The full worked equation — shown in the review panel after a wrong answer
// so the child sees why. Dots make the relationship concrete.
export function MathExplain({ a, b, op, result }) {
  return (
    <span className="school-math school-math--explain" aria-hidden="true">
      <span className="school-math-line">
        {a} {op} {b} = {result}
      </span>
      <span className="school-math-dots">
        <span className="school-dot-group">{"●".repeat(a)}</span>
        <span className="school-math-op">{op}</span>
        <span className="school-dot-group">{"●".repeat(b)}</span>
        <span className="school-math-op">=</span>
        <span className="school-dot-group">
          {op === "+" ? "●".repeat(result) : "●".repeat(result)}
        </span>
      </span>
    </span>
  );
}

