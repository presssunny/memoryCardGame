function cardState(card) {
  if (card.isMatched) return "matched";
  if (card.isFlipped) return "revealed";
  return "hidden";
}

// A card face is an image by default (`card.value` is an icon URL). A game
// can instead set `card.text` for a word/letter/code card, or `card.emoji`
// for a pictographic one — used by the non-image matching games (Git
// Command Match, the Hebrew-letter games, …). `card.faceLabel` gives the
// revealed face a spoken label for screen readers.
function CardFace({ card }) {
  if (card.text != null) {
    return <span className="card-text">{card.text}</span>;
  }
  if (card.emoji != null) {
    return <span className="card-emoji">{card.emoji}</span>;
  }
  return <img src={card.value} alt="" />;
}

export const Card = ({ card, onClick, mismatch = false }) => {
  const handleKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onClick(card);
  };

  const revealedLabel =
    card.isFlipped && card.faceLabel ? `, ${card.faceLabel}` : "";

  return (
    <div
      className={`card ${card.isFlipped ? "flipped" : ""}${
        card.isMatched ? " matched" : ""
      }${mismatch ? " mismatch" : ""}`}
      role="button"
      tabIndex={card.isMatched ? -1 : 0}
      aria-label={`Card, ${cardState(card)}${revealedLabel}`}
      onClick={() => onClick(card)}
      onKeyDown={handleKeyDown}
    >
      <div className="card-front" aria-hidden="true">
        ?
      </div>
      <div className="card-back">
        <CardFace card={card} />
      </div>
    </div>
  );
};
