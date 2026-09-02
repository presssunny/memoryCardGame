import "./home.css";
import { SiteHeader } from "./SiteHeader";
import { Hero } from "./Hero";
import { CategorySection } from "./CategorySection";
import { FeaturedGames } from "./FeaturedGames";
import { StatsBar } from "./StatsBar";
import { useArcadeMode } from "./useArcadeMode";
import { useDocumentTitle } from "../../routing/useDocumentTitle";
import { SITE_TITLE } from "../../routing/paths";

function scrollToGames() {
  document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });
}

export function HomePage({ games, bestScores }) {
  const { isLight, toggleMode } = useArcadeMode();
  useDocumentTitle(`${SITE_TITLE} · Play, challenge, win`);

  return (
    <div className={`home-page${isLight ? " is-light" : ""}`}>
      <SiteHeader isLight={isLight} onToggleTheme={toggleMode} />
      <main className="hp-main">
        <Hero onExplore={scrollToGames} />
        <CategorySection games={games} />
        <FeaturedGames games={games} bestScores={bestScores} />
        <StatsBar games={games} bestScores={bestScores} />
      </main>
    </div>
  );
}
