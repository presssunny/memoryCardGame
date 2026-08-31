import { useState } from "react";
import { HomePage } from "./components/home/HomePage";
import { CategoryPage } from "./components/home/CategoryPage";
import { GAMES } from "./games";
import { useTheme } from "./hooks/useTheme";
import { useBestScores } from "./hooks/useBestScores";

// Three views: home → category → game.
//   - A game opened from Featured has no category; "← Games" returns home.
//   - A game opened from a category returns to that category; the category's
//     "← Home" then returns home.
function App() {
  const { activeTheme, cardValues, changeTheme, allThemes } = useTheme();
  const bestScores = useBestScores();
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeGameId, setActiveGameId] = useState(null);

  const activeGame = GAMES.find((game) => game.id === activeGameId);
  const ActiveGameComponent = activeGame?.component;
  const usesCards = activeGame?.usesCards ?? false;

  const openGame = (gameId) => setActiveGameId(gameId);
  const exitGame = () => setActiveGameId(null); // back to category if one is set
  const goHome = () => {
    setActiveGameId(null);
    setActiveCategoryId(null);
  };

  return (
    <div
      className={`app${
        ActiveGameComponent && usesCards ? ` theme--${activeTheme.id}` : ""
      }`}
    >
      {ActiveGameComponent ? (
        <ActiveGameComponent
          key={usesCards ? `${activeGame.id}-${activeTheme.id}` : activeGame.id}
          gameId={activeGame.id}
          cardValues={cardValues}
          allThemes={allThemes}
          activeThemeId={activeTheme.id}
          onThemeChange={changeTheme}
          bestScores={bestScores}
          higherIsBetter={activeGame.higherScoreIsBetter}
          bestUnit={activeGame.bestUnit}
          onExit={exitGame}
        />
      ) : activeCategoryId ? (
        <CategoryPage
          categoryId={activeCategoryId}
          bestScores={bestScores}
          onSelectGame={openGame}
          onBack={goHome}
        />
      ) : (
        <HomePage
          games={GAMES}
          bestScores={bestScores}
          onSelectGame={openGame}
          onSelectCategory={setActiveCategoryId}
        />
      )}
    </div>
  );
}

export default App;
