import { GameHeader } from "../../components/GameHeader";
import { Card } from "../../components/Card";
import { WinMessage } from "../../components/WinMessage";
import { ToastMessage } from "../../components/ToastMessage";
import { useGameResult } from "../shared/useGameResult";
import { useGameLogic } from "./useGameLogic";

// Rendered by the registry in `src/games/index.js`. Every game component
// receives this same prop shape: theme data/handlers from useTheme, the
// shared `bestScores` hook, its own registry `gameId`, and `onExit` to
// return to the game menu.
export function MemoryMatchGame({
  gameId,
  cardValues,
  allThemes,
  activeThemeId,
  onThemeChange,
  bestScores,
  higherIsBetter,
  bestUnit,
  onExit,
}) {
  const {
    cards,
    score,
    moves,
    isGameWon,
    matchMessage,
    initializeGame,
    handleCardClick,
  } = useGameLogic(cardValues);

  // The comparator (fewer moves vs. higher score) comes from this game's
  // registry entry in games/index.js — see SequenceRecallGame for the game
  // that needs higherIsBetter.
  const best = useGameResult(bestScores, gameId, activeThemeId, {
    ended: isGameWon,
    result: { moves, score },
    higherIsBetter,
  });

  return (
    <>
      <GameHeader
        title="🧠 Memory Match"
        score={score}
        moves={moves}
        best={best}
        bestUnit={bestUnit}
        onReset={initializeGame}
        onExit={onExit}
        allThemes={allThemes}
        activeThemeId={activeThemeId}
        onThemeChange={onThemeChange}
      />
      {matchMessage && <ToastMessage message={matchMessage} />}
      {isGameWon && (
        <WinMessage
          moves={moves}
          score={score}
          best={best}
          onNewGame={initializeGame}
        />
      )}
      <div className="cards-grid">
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
    </>
  );
}
