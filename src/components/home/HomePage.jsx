import { useCallback, useEffect, useState } from "react";
import "./home.css";
import { SiteHeader } from "./SiteHeader";
import { Hero } from "./Hero";
import { CategorySection } from "./CategorySection";
import { FeaturedGames } from "./FeaturedGames";
import { StatsBar } from "./StatsBar";

const MODE_KEY = "arcade-home-mode";

function getInitialLight() {
  try {
    return localStorage.getItem(MODE_KEY) === "light";
  } catch {
    return false;
  }
}

function scrollToGames() {
  document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });
}

export function HomePage({ games, bestScores, onSelectGame }) {
  const [isLight, setIsLight] = useState(getInitialLight);

  useEffect(() => {
    try {
      localStorage.setItem(MODE_KEY, isLight ? "light" : "dark");
    } catch {
      // localStorage unavailable — mode just won't persist
    }
  }, [isLight]);

  const toggleTheme = useCallback(() => setIsLight((v) => !v), []);

  return (
    <div className={`home-page${isLight ? " is-light" : ""}`}>
      <SiteHeader isLight={isLight} onToggleTheme={toggleTheme} />
      <main className="hp-main">
        <Hero onExplore={scrollToGames} />
        <CategorySection />
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
