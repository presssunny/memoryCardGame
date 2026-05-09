export const GameHeader = ({ score, moves }) => {
  return (
    <div className="game-header">
      <h1>🎮 Memory Card Game</h1>
      <div className="stats">
        <div className="stat-item">
          <span className="state-label">Score:</span>{" "}
          <span className="state-value">{score} </span>
        </div>
        <div className="stat-item">
          <span className="state-label">Moves:</span>{" "}
          <span className="state-value">{moves}</span>
        </div>
      </div>
    </div>
  );
};
