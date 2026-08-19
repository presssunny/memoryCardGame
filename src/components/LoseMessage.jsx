export const LoseMessage = ({ title, message, note, onRetry }) => {
  return (
    <div className="win-overlay">
      <div className="win-message" role="dialog" aria-live="polite">
        <div className="win-badge lose-badge">✕</div>
        <h2>{title}</h2>
        <p>{message}</p>
        {note && <p className="win-note">{note}</p>}
        <button className="win-new-game-btn" onClick={onRetry}>
          Try Again
        </button>
      </div>
    </div>
  );
};
