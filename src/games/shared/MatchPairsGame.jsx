import { useMemo } from "react";
import { GameHeader } from "../../components/GameHeader";
import { Card } from "../../components/Card";
import { WinMessage } from "../../components/WinMessage";
import { ToastMessage } from "../../components/ToastMessage";
import { useMatchingBoard } from "./useMatchingBoard";
import { useGameResult } from "./useGameResult";

// A self-contained matching-pairs game with no card-icon theme. Feed it a
// `buildPairs()` that returns the pair set useMatchingBoard expects — plain
// values for symmetric pairs, or { value, face, faceLabel } objects for
// asymmetric ones (command ↔ description). `face` picks the card renderer.
export function MatchPairsGame({
  gameId,
  bestScores,
  bestUnit,
  onExit,
  title,
  buildPairs,
  face = "image",
  gridClass = "",
  winNote = "Every pair matched!",
}) {
  const cardValues = useMemo(() => buildPairs(), [buildPairs]);
  const { cards, score, moves, isGameWon, matchMessage, resetBoard, handleCardClick } =
    useMatchingBoard(cardValues, { face });

  const best = useGameResult(bestScores, gameId, "default", {
    ended: isGameWon,
    result: { moves, score },
  });

  const newGame = () => resetBoard();

  return (
    <>
      <GameHeader
        title={title}
        score={score}
        moves={moves}
        best={best}
        bestUnit={bestUnit}
        onReset={newGame}
        onExit={onExit}
      />
      {matchMessage && <ToastMessage message={matchMessage} />}
      {isGameWon && (
        <WinMessage
          moves={moves}
          score={score}
          best={best}
          note={winNote}
          onNewGame={newGame}
        />
      )}
      <div className={`cards-grid ${gridClass}`.trim()}>
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
    </>
  );
}
