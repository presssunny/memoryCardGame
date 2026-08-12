import { GameHeader } from "./components/GameHeader";
import { Card } from "./components/Card";
import { WinMessage } from "./components/winMessage";
import { ToastMessage } from "./components/ToastMessage";
import { useGameLogic } from "./hooks/useGameLogic";
import { useTheme } from "./hooks/useTheme";

function GameBoard({ cardValues, allThemes, activeThemeId, onThemeChange }) {
  const {
    cards,
    score,
    moves,
    isGameWon,
    matchMessage,
    initializeGame,
    handleCardClick,
  } = useGameLogic(cardValues);

  return (
    <>
      <GameHeader
        score={score}
        moves={moves}
        onReset={initializeGame}
        allThemes={allThemes}
        activeThemeId={activeThemeId}
        onThemeChange={onThemeChange}
      />
      {matchMessage && <ToastMessage message={matchMessage} />}
      {isGameWon && (
        <WinMessage moves={moves} score={score} onNewGame={initializeGame} />
      )}
      <div className="cards-grid">
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
    </>
  );
}

function App() {
  const { activeTheme, cardValues, changeTheme, allThemes } = useTheme();

  return (
    <div className={`app theme--${activeTheme.id}`}>
      <GameBoard
        key={activeTheme.id}
        cardValues={cardValues}
        allThemes={allThemes}
        activeThemeId={activeTheme.id}
        onThemeChange={changeTheme}
      />
    </div>
  );
}

export default App;
