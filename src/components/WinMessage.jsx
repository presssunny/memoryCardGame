export const WinMessage = ({ moves, score, best, note, onNewGame }) => {
  const isNewBest = best && moves <= best.moves;

  return (
    <div className="win-overlay">
      <div className="win-message" role="dialog" aria-live="polite">
        <div className="win-badge">✓</div>
        <h2>Congratulations!</h2>
        <p>
          You completed the game with {moves} moves and a score of {score}.
        </p>
        {best && (
          <p className="win-best">
            {isNewBest
              ? "🏆 That's your new best!"
              : `Your best for this theme: ${best.moves} moves`}
          </p>
        )}
        {note && <p className="win-note">{note}</p>}
        <button className="win-new-game-btn" onClick={onNewGame}>
          New Game
        </button>
      </div>
    </div>
  );
};
