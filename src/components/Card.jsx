function cardState(card) {
  if (card.isMatched) return "matched";
  if (card.isFlipped) return "revealed";
  return "hidden";
}

export const Card = ({ card, onClick }) => {
  const handleKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onClick(card);
  };

  return (
    <div
      className={`card ${card.isFlipped ? "flipped" : ""}${
        card.isMatched ? " matched" : ""
      }`}
      role="button"
      tabIndex={card.isMatched ? -1 : 0}
      aria-label={`Card, ${cardState(card)}`}
      onClick={() => onClick(card)}
      onKeyDown={handleKeyDown}
    >
      <div className="card-front" aria-hidden="true">
        ?
      </div>
      <div className="card-back">
        <img src={card.value} alt="" />
      </div>
    </div>
  );
};
