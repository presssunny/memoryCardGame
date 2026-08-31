import { ThemeSwitcher } from "./ThemeSwitcher";

export const GameHeader = ({
  title = "🎮 Memory Card Game",
  score,
  scoreLabel = "Score:",
  moves,
  movesLabel = "Moves:",
  best,
  bestUnit = "moves",
  extraStat,
  onReset,
  onExit,
  allThemes,
  activeThemeId,
  onThemeChange,
}) => {
  return (
    <div className="game-header">
      {onExit && (
        <button className="back-btn" onClick={onExit}>
          ← Games
        </button>
      )}
      <h1>{title}</h1>
      <div className="stats">
        {score != null && (
          <div className="stat-item">
            <span className="stat-label">{scoreLabel}</span>{" "}
            <span className="stat-value">{score}</span>
          </div>
        )}
        {moves != null && (
          <div className="stat-item">
            <span className="stat-label">{movesLabel}</span>{" "}
            <span className="stat-value">{moves}</span>
          </div>
        )}
        {best && (
          <div className="stat-item">
            <span className="stat-label">Best:</span>{" "}
            <span className="stat-value">
              {best.moves} {bestUnit}
            </span>
          </div>
        )}
        {extraStat && (
          <div className="stat-item">
            <span className="stat-label">{extraStat.label}</span>{" "}
            <span className="stat-value">{extraStat.value}</span>
          </div>
        )}
      </div>
      <button className="reset-btn" onClick={onReset}>
        Restart Game
      </button>
      {allThemes && (
        <ThemeSwitcher
          allThemes={allThemes}
          activeThemeId={activeThemeId}
          onThemeChange={onThemeChange}
        />
      )}
    </div>
  );
};
