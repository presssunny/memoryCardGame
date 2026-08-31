// One game tile, shared by the home Featured shelf and the category pages so
// the two never drift. `game` is a registry entry; `best` is the resolved
// best-score record (or null); `accent` maps to a --hp-* colour.
export function GameCard({ game, best, accent, badge, description, onSelect }) {
  return (
    <button
      type="button"
      className="game-card hp-game-card"
      data-accent={accent}
      onClick={() => onSelect(game.id)}
    >
      {badge && <span className="hp-game-badge">{badge}</span>}
      <span className="hp-game-art" aria-hidden="true">
        <span className="game-card-icon">{game.icon}</span>
      </span>
      <span className="hp-game-foot">
        <span className="hp-game-body">
          <span className="game-card-label">{game.label}</span>
          <span className="game-card-description">
            {description ?? game.description}
          </span>
          {best && (
            <span className="game-card-best">
              🏆 Best: {best.moves} {game.bestUnit ?? "moves"}
            </span>
          )}
        </span>
        <span className="hp-game-play" aria-hidden="true">
          ▶
        </span>
      </span>
    </button>
  );
}
