import { useEffect, useRef, useState } from "react";
import { GameHeader } from "../../components/GameHeader";
import { WinMessage } from "../../components/WinMessage";
import { useGameResult } from "../shared/useGameResult";
import { useSpeech } from "../../components/game-ui/useSpeech";
import { Pic } from "../../components/game-ui/Pic";
import { useInstructionGame } from "./useInstructionGame";
import { makeFollowRound } from "./followInstructions.data";

const TOTAL_ROUNDS = 8;
const makeRound = (round) => makeFollowRound(round);

// "הקישו על עיגול אדום, ואז על כוכב." Practises listening, focus and
// working memory — instructions grow from one step to three. The instruction
// is spoken aloud in Hebrew (Web Speech API); when no Hebrew voice is
// installed the written instruction stays front and centre as the fallback.
export function FollowInstructionsGame({ gameId, bestScores, onExit }) {
  const game = useInstructionGame({ makeRound, totalRounds: TOTAL_ROUNDS });
  const speech = useSpeech("he-IL");

  const best = useGameResult(bestScores, gameId, "default", {
    ended: game.status === "won",
    result: { moves: game.bestStreak, score: game.round - 1 },
    higherIsBetter: true,
  });

  // Autoplay only after the child (or parent) has asked to hear it once —
  // never on first load, never a surprise. Once opted in, each new
  // instruction is read automatically so the listening loop keeps going.
  const [autoRead, setAutoRead] = useState(false);
  const lastSpoken = useRef(null);

  const canSpeak = speech.supported && speech.voiceReady;
  const { speak } = speech;

  const readAloud = () => {
    setAutoRead(true);
    lastSpoken.current = game.text;
    speak(game.text);
  };

  useEffect(() => {
    if (!autoRead || !canSpeak) return;
    if (game.status !== "playing") return;
    if (lastSpoken.current === game.text) return;
    lastSpoken.current = game.text;
    speak(game.text);
  }, [autoRead, canSpeak, game.text, game.status, speak]);

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
          <div className="follow-instruction-row" dir="rtl">
            {canSpeak && (
              <button
                type="button"
                className={`follow-speak${speech.speaking ? " is-speaking" : ""}`}
                onClick={readAloud}
                aria-label="השמעת ההוראה"
              >
                <span aria-hidden="true">🔊</span>
              </button>
            )}
            <p
              className="follow-instruction"
              dir="rtl"
              lang="he"
              aria-live="polite"
            >
              {game.text}
            </p>
          </div>
          {speech.supported && !speech.voiceReady && (
            <p className="follow-tts-note" dir="rtl" lang="he">
              המכשיר לא תומך בהקראה בעברית — אפשר לקרוא את ההוראה למעלה.
            </p>
          )}
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
