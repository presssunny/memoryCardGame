export const Card = ({ card }) => {
  return (
    <div className="card">
      <div className="card-front">?</div>
      <div className="card-back">
        <img src={card.value} alt="Card" />
      </div>
    </div>
  );
};
<img src={card.value} alt="Card" />;
