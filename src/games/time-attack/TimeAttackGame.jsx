import { GameHeader } from "../../components/GameHeader";
import { Card } from "../../components/Card";
import { WinMessage } from "../../components/WinMessage";
import { LoseMessage } from "../../components/LoseMessage";
import { ToastMessage } from "../../components/ToastMessage";
import { PhaseOverlay } from "../../components/PhaseOverlay";
import { useGameResult } from "../shared/useGameResult";
import { useTimeAttackLogic } from "./useTimeAttackLogic";

export function TimeAttackGame({
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
    secondsLeft,
    isTimeUp,
    counting,
    count,
    startNewGame,
    handleCardClick,
  } = useTimeAttackLogic(cardValues);

  const best = useGameResult(bestScores, gameId, activeThemeId, {
    ended: isGameWon,
    result: { moves, score },
    higherIsBetter,
  });

  const onCardClick = isTimeUp || counting ? () => {} : handleCardClick;

  return (
    <>
      <GameHeader
        title="⏱️ Time Attack"
        score={score}
        moves={moves}
        best={best}
        bestUnit={bestUnit}
        extraStat={{ label: "Time:", value: `${secondsLeft}s` }}
        onReset={startNewGame}
        onExit={onExit}
        allThemes={allThemes}
        activeThemeId={activeThemeId}
        onThemeChange={onThemeChange}
      />
      {matchMessage && <ToastMessage message={matchMessage} />}
      {counting && <PhaseOverlay title="Get ready…" countdown={count} />}
      {isGameWon && (
        <WinMessage
          moves={moves}
          score={score}
          best={best}
          note={`Finished with ${secondsLeft}s to spare!`}
          onNewGame={startNewGame}
        />
      )}
      {isTimeUp && !isGameWon && (
        <LoseMessage
          title="Time's up!"
          message={`You matched ${score} pairs in ${moves} moves before the clock ran out.`}
          onRetry={startNewGame}
        />
      )}
      <div className="cards-grid">
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={onCardClick} />
        ))}
      </div>
    </>
  );
}
