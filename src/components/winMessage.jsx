export const WinMessage = ({ moves, score, onNewGame }) => {
  return (
    <div className="win-overlay">
      <div className="win-message" role="dialog" aria-live="polite">
        <div className="win-badge">✓</div>
        <h2>Congratulations!</h2>
        <p>
          You completed the game with {moves} moves and a score of {score}.
        </p>
        <button className="win-new-game-btn" onClick={onNewGame}>
          New Game
        </button>
      </div>
    </div>
  );
};
