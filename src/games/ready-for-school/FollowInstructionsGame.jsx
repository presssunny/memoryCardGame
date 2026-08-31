import { GameHeader } from "../../components/GameHeader";
import { WinMessage } from "../../components/WinMessage";
import { useGameResult } from "../shared/useGameResult";
import { useInstructionGame } from "./useInstructionGame";
import { makeFollowRound } from "./followInstructions.data";

const TOTAL_ROUNDS = 8;
const makeRound = (round) => makeFollowRound(round);

// "Tap the red circle, then the star." Practises listening, focus and
// working memory — instructions grow from one step to three.
export function FollowInstructionsGame({ gameId, bestScores, onExit }) {
  const game = useInstructionGame({ makeRound, totalRounds: TOTAL_ROUNDS });

  const best = useGameResult(bestScores, gameId, "default", {
    ended: game.status === "won",
    result: { moves: game.bestStreak, score: game.round - 1 },
    higherIsBetter: true,
  });

  const stateFor = (target) => {
    if (game.done.includes(target.id)) return " is-done";
    if (game.feedback?.id === target.id) {
      return game.feedback.correct ? " is-correct" : " is-wrong";
    }
    return "";
  };

  return (
    <>
      <GameHeader
        title="👂 Follow Instructions"
        score={game.round - 1}
        scoreLabel="Done:"
        moves={game.round}
        movesLabel="Round:"
        best={best}
        bestUnit="streak"
        onReset={game.restart}
        onExit={onExit}
      />
      {game.status === "won" ? (
        <WinMessage
          moves={game.bestStreak}
          score={TOTAL_ROUNDS}
          best={best}
          note={`You followed every instruction! Best streak: ${game.bestStreak}`}
          onNewGame={game.restart}
        />
      ) : (
        <div className="follow-stage">
          <p className="follow-instruction" aria-live="polite">
            {game.text}
          </p>
          <p className="follow-progress" aria-hidden="true">
            {game.steps.map((_, i) => (
              <span
                key={i}
                className={`follow-dot${i < game.step ? " is-filled" : ""}${
                  i === game.step ? " is-current" : ""
                }`}
              />
            ))}
          </p>
          <div className="follow-board" role="group" aria-label="Tap targets">
            {game.board.map((target) => (
              <button
                key={target.id}
                type="button"
                className={`follow-target${stateFor(target)}`}
                aria-label={target.label}
                disabled={!!game.feedback || game.done.includes(target.id)}
                onClick={() => game.tap(target.id)}
              >
                <span aria-hidden="true">{target.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
