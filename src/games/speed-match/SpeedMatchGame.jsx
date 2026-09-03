import { GameHeader } from "../../components/GameHeader";
import { Card } from "../../components/Card";
import { WinMessage } from "../../components/WinMessage";
import { ToastMessage } from "../../components/ToastMessage";
import { PhaseOverlay } from "../../components/PhaseOverlay";
import { useGameResult } from "../shared/useGameResult";
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

  const best = useGameResult(bestScores, gameId, activeThemeId, {
    ended: isGameWon,
    result: { moves, score },
    higherIsBetter,
  });

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
          dim={false}
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
