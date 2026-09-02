import { Link } from "react-router-dom";
import { GamesChrome } from "./GamesChrome";
import { GameCard } from "./GameCard";
import { buildCategorySections, getCategory } from "./homeData";
import { gamesInCategory } from "../../games";
import {
  breadcrumbs,
  gamePath,
  groupPath,
  resolveGamesPath,
} from "../../routing/paths";

const ACCENTS = ["blue", "cyan", "amber", "green", "violet", "teal"];

// One category screen (/games/<category>). Lists every game in the category,
// split into its declared sub-sections; each sub-section heading links to its
// own focused page (/games/<category>/<group>).
export function CategoryPage({ categoryId, bestScores }) {
  const category = getCategory(categoryId);
  const games = gamesInCategory(categoryId);
  const sections = buildCategorySections(categoryId, games);
  const trail = breadcrumbs(resolveGamesPath(`/games/${categoryId}`), "en");

  let cardIndex = 0;

  return (
    <GamesChrome backTo="/games" backLabel="← Games" trail={trail}>
      <header className="catpage-head" data-accent={category?.accent}>
        <span className="catpage-head-icon" aria-hidden="true">
          {category?.icon ?? "🎮"}
        </span>
        <div>
          <h1 className="catpage-title">{category?.title ?? "Games"}</h1>
          <p className="catpage-desc">{category?.description}</p>
        </div>
      </header>

      {games.length === 0 ? (
        <div className="catpage-empty">
          <span className="catpage-empty-icon" aria-hidden="true">
            🚧
          </span>
          <p>Games for this category are on the way — check back soon.</p>
          <Link to="/games" className="catpage-back-cta">
            ← Back to categories
          </Link>
        </div>
      ) : (
        sections.map((section) => {
          // A section whose id is a real declared group gets a linked heading
          // to its own focused page; the trailing "more" bucket doesn't.
          const sectionTo =
            section.id !== "more" ? groupPath(categoryId, section.id) : null;
          return (
            <section key={section.id} className="catpage-section">
              {section.label &&
                (sectionTo ? (
                  <Link
                    to={sectionTo}
                    className="catpage-section-label catpage-section-link"
                    dir="auto"
                  >
                    {section.icon && (
                      <span aria-hidden="true">{section.icon} </span>
                    )}
                    {section.label}
                    <span aria-hidden="true"> →</span>
                  </Link>
                ) : (
                  <h2 className="catpage-section-label" dir="auto">
                    {section.icon && (
                      <span aria-hidden="true">{section.icon} </span>
                    )}
                    {section.label}
                  </h2>
                ))}
              <div className="catpage-grid">
                {section.games.map((game) => {
                  const best = bestScores.getBestOverall(game.id, {
                    higherIsBetter: game.higherScoreIsBetter,
                  });
                  const accent = ACCENTS[cardIndex++ % ACCENTS.length];
                  return (
                    <GameCard
                      key={game.id}
                      game={game}
                      to={gamePath(game)}
                      best={best}
                      accent={accent}
                    />
                  );
                })}
              </div>
            </section>
          );
        })
      )}
    </GamesChrome>
  );
}
