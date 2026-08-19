import { useEffect } from "react";
import { GameHeader } from "../../components/GameHeader";
import { Card } from "../../components/Card";
import { WinMessage } from "../../components/WinMessage";
import { ToastMessage } from "../../components/ToastMessage";
import { PhaseOverlay } from "../../components/PhaseOverlay";
import { useSpeedMatchLogic } from "./useSpeedMatchLogic";

// Same registry prop shape as MemoryMatchGame — see games/index.js.
export function SpeedMatchGame({
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
    phase,
    secondsLeft,
    startNewGame,
    handleCardClick,
  } = useSpeedMatchLogic(cardValues);

  const { getBest, recordResult } = bestScores;
  const best = getBest(gameId, activeThemeId);

  // The comparator comes from this game's registry entry in games/index.js.
  useEffect(() => {
    if (!isGameWon) return;
    recordResult(gameId, activeThemeId, { moves, score }, { higherIsBetter });
  }, [isGameWon, gameId, activeThemeId, moves, score, recordResult, higherIsBetter]);

  return (
    <>
      <GameHeader
        title="⚡ Speed Match"
        score={score}
        moves={moves}
        best={best}
        bestUnit={bestUnit}
        onReset={startNewGame}
        onExit={onExit}
        allThemes={allThemes}
        activeThemeId={activeThemeId}
        onThemeChange={onThemeChange}
      />
      {matchMessage && <ToastMessage message={matchMessage} />}
      {phase === "memorize" && (
        <PhaseOverlay
          title="Memorize the board!"
          subtitle={`Cards hide in ${secondsLeft}s`}
        />
      )}
      {phase === "countdown" && (
        <PhaseOverlay title="Get ready..." countdown={secondsLeft} />
      )}
      {isGameWon && (
        <WinMessage
          moves={moves}
          score={score}
          best={best}
          onNewGame={startNewGame}
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
