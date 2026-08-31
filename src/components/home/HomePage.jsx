import "./home.css";
import { SiteHeader } from "./SiteHeader";
import { Hero } from "./Hero";
import { CategorySection } from "./CategorySection";
import { FeaturedGames } from "./FeaturedGames";
import { StatsBar } from "./StatsBar";
import { useArcadeMode } from "./useArcadeMode";

function scrollToGames() {
  document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });
}

export function HomePage({ games, bestScores, onSelectGame, onSelectCategory }) {
  const { isLight, toggleMode } = useArcadeMode();

  return (
    <div className={`home-page${isLight ? " is-light" : ""}`}>
      <SiteHeader isLight={isLight} onToggleTheme={toggleMode} />
      <main className="hp-main">
        <Hero onExplore={scrollToGames} />
        <CategorySection games={games} onSelectCategory={onSelectCategory} />
        <FeaturedGames
          games={games}
          bestScores={bestScores}
          onSelectGame={onSelectGame}
        />
        <StatsBar gameCount={games.length} />
      </main>
    </div>
  );
}
