import { GamesChrome } from "./GamesChrome";
import { GameCard } from "./GameCard";
import { getCategory } from "./homeData";
import { GAMES } from "../../games";
import {
  breadcrumbs,
  categoryPath,
  gamePath,
  groupPath,
  resolveGamesPath,
} from "../../routing/paths";

const ACCENTS = ["blue", "cyan", "amber", "green", "violet", "teal"];

// One focused sub-section screen (/games/<category>/<group>) — only that
// group's games. The Ready for School group is presented in Hebrew / RTL.
export function SubCategoryPage({ categoryId, groupId }) {
  const category = getCategory(categoryId);
  const games = GAMES.filter(
    (g) => g.category === categoryId && g.group === groupId,
  );
  const resolved = resolveGamesPath(groupPath(categoryId, groupId));
  const hebrew = groupId === "ready-for-school";
  const trail = breadcrumbs(resolved, hebrew ? "he" : "en");
  const group = resolved.group;

  return (
    <GamesChrome
      backTo={categoryPath(categoryId)}
      backLabel={hebrew ? `${category?.title} →` : `← ${category?.title}`}
      trail={trail}
      hebrew={hebrew}
    >
      <header className="catpage-head" data-accent={category?.accent}>
        <span className="catpage-head-icon" aria-hidden="true">
          {group?.icon ?? category?.icon ?? "🎮"}
        </span>
        <div>
          <h1 className="catpage-title" dir="auto">
            {group?.label ?? "Games"}
          </h1>
          <p className="catpage-desc" dir="auto">
            {hebrew
              ? "משחקים קצרים להכנה לכיתה א׳"
              : `${category?.title} · ${games.length} games`}
          </p>
        </div>
      </header>

      <section className="catpage-section">
        <div className="catpage-grid">
          {games.map((game, i) => (
            <GameCard
              key={game.id}
              game={game}
              to={gamePath(game)}
              accent={ACCENTS[i % ACCENTS.length]}
            />
          ))}
        </div>
      </section>
    </GamesChrome>
  );
}
