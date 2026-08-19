import { useEffect } from "react";
import { GameHeader } from "../../components/GameHeader";
import { Card } from "../../components/Card";
import { WinMessage } from "../../components/WinMessage";
import { LoseMessage } from "../../components/LoseMessage";
import { ToastMessage } from "../../components/ToastMessage";
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
    startNewGame,
    handleCardClick,
  } = useTimeAttackLogic(cardValues);

  const { getBest, recordResult } = bestScores;
  const best = getBest(gameId, activeThemeId);

  useEffect(() => {
    if (!isGameWon) return;
    recordResult(gameId, activeThemeId, { moves, score }, { higherIsBetter });
  }, [isGameWon, gameId, activeThemeId, moves, score, recordResult, higherIsBetter]);

  const onCardClick = isTimeUp ? () => {} : handleCardClick;

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
