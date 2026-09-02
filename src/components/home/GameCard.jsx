import { Link } from "react-router-dom";

// One game tile, shared by the home Featured shelf and the category / section
// pages so the three never drift. `game` is a registry entry; `to` is the
// game's route; `best` is the resolved best-score record (or null); `accent`
// maps to a --hp-* colour.
export function GameCard({ game, to, best, accent, badge, description }) {
  return (
    <Link className="game-card hp-game-card" data-accent={accent} to={to}>
      {badge && <span className="hp-game-badge">{badge}</span>}
      <span className="hp-game-art" aria-hidden="true">
        <span className="game-card-icon">{game.icon}</span>
      </span>
      <span className="hp-game-foot">
        <span className="hp-game-body">
          {/* dir="auto" so Hebrew-titled games (Ready for School) lay out RTL. */}
          <span className="game-card-label" dir="auto">
            {game.label}
          </span>
          <span className="game-card-description" dir="auto">
            {description ?? game.description}
          </span>
          {best && (
            <span className="game-card-best" dir="auto">
              🏆 {game.hebrew ? "שיא" : "Best"}: {best.moves}{" "}
              {game.bestUnit ?? (game.hebrew ? "" : "moves")}
            </span>
          )}
        </span>
        <span className="hp-game-play" aria-hidden="true">
          ▶
        </span>
      </span>
    </Link>
  );
}
