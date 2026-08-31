import { GameHeader } from "../../components/GameHeader";
import { Card } from "../../components/Card";
import { WinMessage } from "../../components/WinMessage";
import { LoseMessage } from "../../components/LoseMessage";
import { ToastMessage } from "../../components/ToastMessage";
import { useGameResult } from "../shared/useGameResult";
import { useSurvivalLogic } from "./useSurvivalLogic";

export function SurvivalGame({
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
    movesLeft,
    isOutOfMoves,
    startNewGame,
    handleCardClick,
  } = useSurvivalLogic(cardValues);

  const best = useGameResult(bestScores, gameId, activeThemeId, {
    ended: isGameWon,
    result: { moves, score },
    higherIsBetter,
  });

  const onCardClick = isOutOfMoves ? () => {} : handleCardClick;

  return (
    <>
      <GameHeader
        title="🎯 Survival"
        score={score}
        moves={moves}
        best={best}
        bestUnit={bestUnit}
        extraStat={{ label: "Left:", value: movesLeft }}
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
          note={`${movesLeft} moves to spare!`}
          onNewGame={startNewGame}
        />
      )}
      {isOutOfMoves && !isGameWon && (
        <LoseMessage
          title="Out of moves!"
          message={`You matched ${score} pairs before running out of moves.`}
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
