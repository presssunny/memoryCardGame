import { useEffect, useRef } from "react";
import { GameHeader } from "../../components/GameHeader";
import { QuizStage } from "../../components/QuizStage";
import { WinMessage } from "../../components/WinMessage";
import { LoseMessage } from "../../components/LoseMessage";
import { useSound, SpokenInstruction } from "../../components/game-ui";
import { useQuizGame } from "./useQuizGame";
import { useGameResult } from "./useGameResult";

// The whole screen for a quiz-style game: header, the QuizStage while
// playing, and a win/lose result. A game supplies only what's specific to
// it — a stable `generate`, how to draw the prompt and each option, the
// round/lives config — so the ~dozen quiz games don't each re-wire this.
//
//   generate       — stable (round) => question; see useQuizGame
//   renderPrompt   — (question) => ReactNode; defaults to question.prompt
//   renderOption   — (option) => ReactNode
//   instruction    — string, or (question) => string
//   columns        — number, or (question) => number
//   winNote/loseNote — (quiz) => string for the result screen
export function QuizGameScreen({
  gameId,
  bestScores,
  onExit,
  title,
  generate,
  totalRounds,
  lives,
  advanceOnWrong = false,
  size = "lg",
  instruction,
  // Pre-reader read-aloud: a plain string (or (question) => string) that is
  // spoken in Hebrew via a 🔊 button on the instruction line. Independent of
  // the sound-effects toggle. When set, the visible `instruction` gets the
  // button; the two can differ (short visible line, fuller spoken sentence).
  speak,
  renderPrompt,
  renderOption,
  optionLabel,
  promptLabel,
  columns,
  scoreLabel,
  bestUnit,
  winNote,
  loseNote,
  loseTitle,
  // "off" | "wrong" | "always" — when set, an answered question pauses on a
  // review panel (renderReview) with a Next button instead of auto-advancing.
  review = "off",
  renderReview,
  nextLabel,
  // Ready for School games pass this: Hebrew, RTL chrome for pre-readers.
  hebrew = false,
}) {
  const quiz = useQuizGame({ generate, totalRounds, lives, advanceOnWrong, review });
  const ended = quiz.status === "won" || quiz.status === "lost";
  const reviewing = quiz.phase === "review";
  const resolvedNextLabel =
    nextLabel ?? (hebrew ? "המשך" : "Next");

  const roundLabel = hebrew ? "סבב:" : "Round:";
  const resolvedScoreLabel = scoreLabel ?? (hebrew ? "נכון:" : "Found:");
  const resolvedBestUnit = bestUnit ?? (hebrew ? "רצף" : "streak");
  const resolvedLoseTitle = loseTitle ?? (hebrew ? "אין עוד חיים" : "Game over");
  const livesLabel = hebrew ? "חיים:" : "Lives:";

  const best = useGameResult(bestScores, gameId, "default", {
    ended,
    result: { moves: quiz.bestStreak, score: quiz.correctCount },
    higherIsBetter: true,
  });

  // A short chime on each answer (off by default; honours the sound toggle).
  const { play } = useSound();
  const lastFeedback = useRef(null);
  useEffect(() => {
    const fb = quiz.feedback;
    if (fb && fb !== lastFeedback.current) {
      play(fb.correct ? "correct" : "wrong");
    }
    lastFeedback.current = fb;
  }, [quiz.feedback, play]);

  const resolve = (v, arg) => (typeof v === "function" ? v(arg) : v);

  const resolvedInstruction = resolve(instruction, quiz.question);
  const spokenText = resolve(speak, quiz.question);
  const instructionNode =
    spokenText != null ? (
      <SpokenInstruction
        text={spokenText}
        speakKey={quiz.round}
        dir={hebrew ? "rtl" : "ltr"}
        lang={hebrew ? "he" : "en"}
      >
        {resolvedInstruction}
      </SpokenInstruction>
    ) : (
      resolvedInstruction
    );

  return (
    <>
      <GameHeader
        title={title}
        score={quiz.correctCount}
        scoreLabel={resolvedScoreLabel}
        moves={quiz.round}
        movesLabel={roundLabel}
        best={best}
        bestUnit={resolvedBestUnit}
        hebrew={hebrew}
        extraStat={
          quiz.livesLeft !== Infinity
            ? { label: livesLabel, value: quiz.livesLeft }
            : undefined
        }
        onReset={quiz.restart}
        onExit={onExit}
      />
      {quiz.status === "won" && (
        <WinMessage
          moves={quiz.bestStreak}
          score={quiz.correctCount}
          scoreLabel={hebrew ? undefined : "best streak"}
          best={best}
          note={resolve(winNote, quiz)}
          onNewGame={quiz.restart}
          onExit={onExit}
          hebrew={hebrew}
        />
      )}
      {quiz.status === "lost" && (
        <LoseMessage
          title={resolvedLoseTitle}
          message={
            hebrew
              ? `ענית נכון על ${quiz.correctCount}. הרצף הכי טוב: ${quiz.bestStreak}.`
              : `You got ${quiz.correctCount} right. Best streak: ${quiz.bestStreak}.`
          }
          note={resolve(loseNote, quiz)}
          onRetry={quiz.restart}
          onExit={onExit}
          hebrew={hebrew}
        />
      )}
      {quiz.status === "playing" && (
        <>
          <QuizStage
            size={size}
            hebrew={hebrew}
            instruction={instructionNode}
            prompt={renderPrompt ? renderPrompt(quiz.question, quiz) : quiz.question.prompt}
            promptLabel={resolve(promptLabel, quiz.question)}
            options={quiz.question.options}
            renderOption={renderOption}
            optionLabel={optionLabel}
            feedback={quiz.feedback}
            onAnswer={quiz.answer}
            columns={resolve(columns, quiz.question)}
          />
          {reviewing && (
            <div
              className={`quiz-review${
                quiz.feedback?.correct ? " is-correct" : " is-wrong"
              }`}
              dir={hebrew ? "rtl" : "ltr"}
            >
              {renderReview
                ? renderReview(quiz)
                : (
                  <p className="quiz-review-verdict">
                    {quiz.feedback?.correct
                      ? hebrew
                        ? "✓ נכון!"
                        : "✓ Correct"
                      : hebrew
                        ? "✕ לא נכון"
                        : "✕ Not quite"}
                  </p>
                )}
              <button
                type="button"
                className="quiz-review-next"
                onClick={quiz.next}
                autoFocus
              >
                {resolvedNextLabel} <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
