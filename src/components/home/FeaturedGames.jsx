import { FEATURED_IDS, FEATURED_META } from "./homeData";
import { GameCard } from "./GameCard";
import { gamePath } from "../../routing/paths";

const ICON_ACCENTS = ["blue", "cyan", "amber", "green", "violet"];

export function FeaturedGames({ games, bestScores }) {
  // A curated shelf: only the ids in FEATURED_IDS, in that order. The full
  // catalogue lives behind Browse Categories.
  const featured = FEATURED_IDS.map((id) =>
    games.find((game) => game.id === id),
  ).filter(Boolean);

  return (
    <section className="hp-section hp-featured" id="games">
      <div className="hp-section-head">
        <h2 className="hp-section-label">
          <span aria-hidden="true">⭐</span> Featured Games
        </h2>
        <a className="hp-view-all" href="#categories">
          Browse all <span aria-hidden="true">→</span>
        </a>
      </div>
      <div className="hp-featured-grid">
        {featured.map((game, i) => {
          const meta = FEATURED_META[game.id] ?? {};
          const best = bestScores.getBestOverall(game.id, {
            higherIsBetter: game.higherScoreIsBetter,
          });
          return (
            <GameCard
              key={game.id}
              game={game}
              to={gamePath(game)}
              best={best}
              accent={ICON_ACCENTS[i % ICON_ACCENTS.length]}
              badge={meta.isNew ? "New" : undefined}
              description={meta.tagline}
            />
          );
        })}
      </div>
    </section>
  );
}
