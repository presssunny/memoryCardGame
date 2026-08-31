import { FEATURED_META } from "./homeData";

const ICON_ACCENTS = ["blue", "cyan", "amber", "green", "violet"];

export function FeaturedGames({ games, bestScores, onSelectGame }) {
  return (
    <section className="hp-section hp-featured" id="games">
      <div className="hp-section-head">
        <h2 className="hp-section-label">
          <span aria-hidden="true">⭐</span> Featured Games
        </h2>
        <a className="hp-view-all" href="#games">
          View All <span aria-hidden="true">→</span>
        </a>
      </div>
      <div className="hp-featured-grid">
        {games.map((game, i) => {
          const meta = FEATURED_META[game.id] ?? {};
          const best = bestScores.getBestOverall(game.id, {
            higherIsBetter: game.higherScoreIsBetter,
          });
          return (
            <button
              key={game.id}
              type="button"
              className="game-card hp-game-card"
              data-accent={ICON_ACCENTS[i % ICON_ACCENTS.length]}
              onClick={() => onSelectGame(game.id)}
            >
              {meta.isNew && <span className="hp-game-badge">New</span>}
              <span className="hp-game-art" aria-hidden="true">
                <span className="game-card-icon">{game.icon}</span>
              </span>
              <span className="hp-game-foot">
                <span className="hp-game-body">
                  <span className="game-card-label">{game.label}</span>
                  <span className="game-card-description">
                    {meta.tagline ?? game.description}
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
        })}
      </div>
    </section>
  );
}
