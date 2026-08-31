// A big Hebrew letter, always right-to-left.
export function HebrewLetter({ letter }) {
  return (
    <span className="school-hebrew" dir="rtl" lang="he">
      {letter}
    </span>
  );
}

// A row of identical items to count.
export function ItemsPrompt({ item, count }) {
  return (
    <span className="school-items" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i}>{item}</span>
      ))}
    </span>
  );
}

// A sequence of tokens ending in "?".
export function SequencePrompt({ items }) {
  return (
    <span className="school-sequence" aria-hidden="true">
      {items.map((it, i) => (
        <span key={i} className="school-seq-token">
          {it}
        </span>
      ))}
      <span className="school-seq-token school-seq-q">?</span>
    </span>
  );
}

// "a + b" with optional dot rows underneath for the youngest.
export function MathPrompt({ a, b, op, showDots }) {
  return (
    <span className="school-math" aria-hidden="true">
      <span className="school-math-line">
        {a} {op} {b}
      </span>
      {showDots && (
        <span className="school-math-dots">
          <span className="school-dot-group">{"●".repeat(a)}</span>
          <span className="school-math-op">{op}</span>
          <span className="school-dot-group">{"●".repeat(b)}</span>
        </span>
      )}
    </span>
  );
}

