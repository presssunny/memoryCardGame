import { Link } from "react-router-dom";
import { GamesChrome } from "./GamesChrome";
import { GameCard } from "./GameCard";
import { buildSubgroupSections, getCategory } from "./homeData";
import { GAMES } from "../../games";
import {
  breadcrumbs,
  categoryPath,
  gamePath,
  groupPath,
  resolveGamesPath,
  subgroupPath,
} from "../../routing/paths";

const ACCENTS = ["blue", "cyan", "amber", "green", "violet", "teal"];

const GamesGrid = ({ games, startIndex = 0 }) => (
  <div className="catpage-grid">
    {games.map((game, i) => (
      <GameCard
        key={game.id}
        game={game}
        to={gamePath(game)}
        accent={ACCENTS[(startIndex + i) % ACCENTS.length]}
      />
    ))}
  </div>
);

// The sub-section screens under a category:
//   /games/<category>/<group>              — the group. When the group declares
//                                            strands (Ready for School →
//                                            עברית / חשבון / חשיבה) each strand
//                                            is its own titled, linked section;
//                                            otherwise one flat grid.
//   /games/<category>/<group>/<subgroup>   — one focused strand, its games only.
// The Ready for School subtree is Hebrew / RTL throughout.
export function SubCategoryPage({ categoryId, groupId, subgroupId }) {
  const category = getCategory(categoryId);
  const hebrew = groupId === "ready-for-school";
  const backArrow = (label) => (hebrew ? `${label} →` : `← ${label}`);

  // ---- one focused strand ----
  if (subgroupId) {
    const games = GAMES.filter(
      (g) =>
        g.category === categoryId &&
        g.group === groupId &&
        g.subgroup === subgroupId,
    );
    const resolved = resolveGamesPath(
      subgroupPath(categoryId, groupId, subgroupId),
    );
    const sub = resolved.subgroup;
    const group = resolved.group;
    return (
      <GamesChrome
        backTo={groupPath(categoryId, groupId)}
        backLabel={backArrow(group?.label ?? category?.title ?? "")}
        trail={breadcrumbs(resolved, hebrew ? "he" : "en")}
        hebrew={hebrew}
      >
        <header className="catpage-head" data-accent={category?.accent}>
          <span className="catpage-head-icon" aria-hidden="true">
            {sub?.icon ?? "🎮"}
          </span>
          <div>
            <h1 className="catpage-title" dir="auto">
              {sub?.label ?? "Games"}
            </h1>
            <p className="catpage-desc" dir="auto">
              {sub?.desc ?? `${games.length} games`}
            </p>
          </div>
        </header>
        <section className="catpage-section">
          <GamesGrid games={games} />
        </section>
      </GamesChrome>
    );
  }

  // ---- the whole group ----
  const games = GAMES.filter(
    (g) => g.category === categoryId && g.group === groupId,
  );
  const resolved = resolveGamesPath(groupPath(categoryId, groupId));
  const group = resolved.group;
  const sections = buildSubgroupSections(categoryId, groupId, games);

  return (
    <GamesChrome
      backTo={categoryPath(categoryId)}
      backLabel={backArrow(category?.title ?? "")}
      trail={breadcrumbs(resolved, hebrew ? "he" : "en")}
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
              ? "שלושה מסלולים קצרים להכנה לכיתה א׳"
              : `${category?.title} · ${games.length} games`}
          </p>
        </div>
      </header>

      {sections.length === 0 ? (
        <section className="catpage-section">
          <GamesGrid games={games} />
        </section>
      ) : (
        (() => {
          let cardIndex = 0;
          return sections.map((section) => {
            const start = cardIndex;
            cardIndex += section.games.length;
            const sectionTo =
              section.id !== "more"
                ? subgroupPath(categoryId, groupId, section.id)
                : null;
            return (
              <section key={section.id} className="catpage-section">
                {sectionTo ? (
                  <Link
                    to={sectionTo}
                    className="catpage-section-label catpage-section-link"
                    dir="auto"
                  >
                    {section.icon && (
                      <span aria-hidden="true">{section.icon} </span>
                    )}
                    {section.label}
                    {section.desc && (
                      <span className="catpage-section-sub"> · {section.desc}</span>
                    )}
                    <span aria-hidden="true"> →</span>
                  </Link>
                ) : (
                  <h2 className="catpage-section-label" dir="auto">
                    {section.label}
                  </h2>
                )}
                <GamesGrid games={section.games} startIndex={start} />
              </section>
            );
          });
        })()
      )}
    </GamesChrome>
  );
}
