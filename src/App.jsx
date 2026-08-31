import { useState } from "react";
import { HomePage } from "./components/home/HomePage";
import { GAMES } from "./games";
import { useTheme } from "./hooks/useTheme";
import { useBestScores } from "./hooks/useBestScores";

function App() {
  const { activeTheme, cardValues, changeTheme, allThemes } = useTheme();
  const bestScores = useBestScores();
  const [activeGameId, setActiveGameId] = useState(null);

  const activeGame = GAMES.find((game) => game.id === activeGameId);
  const ActiveGameComponent = activeGame?.component;

  return (
    <div className={`app${activeGame ? ` theme--${activeTheme.id}` : ""}`}>
      {ActiveGameComponent ? (
        <ActiveGameComponent
          key={`${activeGame.id}-${activeTheme.id}`}
          gameId={activeGame.id}
          cardValues={cardValues}
          allThemes={allThemes}
          activeThemeId={activeTheme.id}
          onThemeChange={changeTheme}
          bestScores={bestScores}
          higherIsBetter={activeGame.higherScoreIsBetter}
          bestUnit={activeGame.bestUnit}
          onExit={() => setActiveGameId(null)}
        />
      ) : (
        <HomePage
          games={GAMES}
          bestScores={bestScores}
          onSelectGame={setActiveGameId}
        />
      )}
    </div>
  );
}

export default App;
