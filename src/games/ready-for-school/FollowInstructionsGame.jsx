import { GameHeader } from "../../components/GameHeader";
import { WinMessage } from "../../components/WinMessage";
import { useGameResult } from "../shared/useGameResult";
import { SpokenInstruction } from "../../components/game-ui";
import { Pic } from "../../components/game-ui/Pic";
import { useInstructionGame } from "./useInstructionGame";
import { makeFollowRound } from "./followInstructions.data";

const TOTAL_ROUNDS = 8;
const makeRound = (round) => makeFollowRound(round);

// "הקישו על עיגול אדום, ואז על כוכב." Practises listening, focus and
// working memory — instructions grow from one step to three. The instruction
// is read aloud in Hebrew by the shared <SpokenInstruction> (🔊); the written
// line stays visible as the fallback when a device has no Hebrew voice.
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
        title="👂 מבצעים הוראות"
        score={game.round - 1}
        scoreLabel="הצלחות:"
        moves={game.round}
        movesLabel="סבב:"
        best={best}
        bestUnit="רצף"
        hebrew
        onReset={game.restart}
        onExit={onExit}
      />
      {game.status === "won" ? (
        <WinMessage
          moves={game.bestStreak}
          score={TOTAL_ROUNDS}
          best={best}
          hebrew
          note="עשיתם את זה! עקבתם אחרי כל ההוראות."
          onNewGame={game.restart}
        />
      ) : (
        <div className="follow-stage">
          <SpokenInstruction text={game.text} speakKey={game.text} />
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
          <div className="follow-board" role="group" aria-label="משבצות">
            {game.board.map((target) => (
              <button
                key={target.id}
                type="button"
                className={`follow-target${stateFor(target)}`}
                aria-label={target.label}
                disabled={!!game.feedback || game.done.includes(target.id)}
                onClick={() => game.tap(target.id)}
              >
                <Pic id={target.pic} decorative />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
