import { GamesChrome } from "./GamesChrome";
import { CategorySection } from "./CategorySection";
import { breadcrumbs, resolveGamesPath } from "../../routing/paths";
import { GAMES } from "../../games";

// The /games landing screen — the four category cards, nothing else. This is
// the page the old `/#games` anchor was standing in for.
export function GamesIndexPage() {
  const trail = breadcrumbs(resolveGamesPath("/games"), "en");
  return (
    <GamesChrome backTo="/" backLabel="← Home" trail={trail}>
      <header className="catpage-head" data-accent="blue">
        <span className="catpage-head-icon" aria-hidden="true">
          🎮
        </span>
        <div>
          <h1 className="catpage-title">Games</h1>
          <p className="catpage-desc">
            Pick a category — {GAMES.length} games in four, from first letters
            to arcade classics.
          </p>
        </div>
      </header>
      <CategorySection games={GAMES} />
    </GamesChrome>
  );
}
