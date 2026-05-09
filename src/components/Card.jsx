export const Card = ({ card, onClick }) => {
  return (
    <div
      className={`card ${card.isFlipped ? "flipped" : ""}${
        card.isMatched ? " matched" : ""
      }`}
      onClick={() => onClick(card)}
    >
      <div className="card-front">?</div>
      <div className="card-back">
        <img src={card.value} alt="Card" />
      </div>
    </div>
  );
};
