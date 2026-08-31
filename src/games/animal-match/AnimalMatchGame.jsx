import { useMemo } from "react";
import { GameHeader } from "../../components/GameHeader";
import { Card } from "../../components/Card";
import { WinMessage } from "../../components/WinMessage";
import { ToastMessage } from "../../components/ToastMessage";
import { useMatchingBoard } from "../shared/useMatchingBoard";
import { useGameResult } from "../shared/useGameResult";
import { pickAnimalPairs } from "./animalMatch.data";

// Memory Match for the youngest players: a small board of animal emoji, no
// card-icon theme, big friendly cards. Built on the shared matching engine
// (face: "emoji"). Restart reshuffles the same animals — a fresh set is
// picked each time the game is opened, like every other matching game here.
export function AnimalMatchGame({ gameId, bestScores, bestUnit, onExit }) {
  const cardValues = useMemo(() => pickAnimalPairs(), []);

  const { cards, score, moves, isGameWon, matchMessage, resetBoard, handleCardClick } =
    useMatchingBoard(cardValues, { face: "emoji" });

  const best = useGameResult(bestScores, gameId, "default", {
    ended: isGameWon,
    result: { moves, score },
  });

  const newGame = () => resetBoard();

  return (
    <>
      <GameHeader
        title="🐾 Animal Match"
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
          note="🎉 You found every animal pair!"
          onNewGame={newGame}
        />
      )}
      <div className="cards-grid cards-grid--kids">
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
    </>
  );
}
