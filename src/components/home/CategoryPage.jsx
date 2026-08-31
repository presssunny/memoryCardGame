import "./home.css";
import { SiteHeader } from "./SiteHeader";
import { GameCard } from "./GameCard";
import { useArcadeMode } from "./useArcadeMode";
import { buildCategorySections, getCategory } from "./homeData";
import { gamesInCategory } from "../../games";

const ACCENTS = ["blue", "cyan", "amber", "green", "violet", "teal"];

export function CategoryPage({ categoryId, bestScores, onSelectGame, onBack }) {
  const { isLight, toggleMode } = useArcadeMode();
  const category = getCategory(categoryId);
  const games = gamesInCategory(categoryId);
  const sections = buildCategorySections(categoryId, games);

  let cardIndex = 0;

  return (
    <div className={`home-page catpage${isLight ? " is-light" : ""}`}>
      <SiteHeader
        isLight={isLight}
        onToggleTheme={toggleMode}
        onNavigateHome={onBack}
      />
      <main className="hp-main">
        <button type="button" className="catpage-back" onClick={onBack}>
          ← Home
        </button>

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
            <button type="button" className="catpage-back-cta" onClick={onBack}>
              ← Back to categories
            </button>
          </div>
        ) : (
          sections.map((section) => (
            <section key={section.id} className="catpage-section">
              {section.label && (
                <h2 className="catpage-section-label">
                  {section.icon && (
                    <span aria-hidden="true">{section.icon} </span>
                  )}
                  {section.label}
                </h2>
              )}
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
                      best={best}
                      accent={accent}
                      onSelect={onSelectGame}
                    />
                  );
                })}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
