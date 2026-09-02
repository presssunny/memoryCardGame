import { GameHeader } from "../../components/GameHeader";
import { QuizStage } from "../../components/QuizStage";
import { WinMessage } from "../../components/WinMessage";
import { LoseMessage } from "../../components/LoseMessage";
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
  renderPrompt,
  renderOption,
  promptLabel,
  columns,
  scoreLabel,
  bestUnit,
  winNote,
  loseNote,
  loseTitle,
  // Ready for School games pass this: Hebrew, RTL chrome for pre-readers.
  hebrew = false,
}) {
  const quiz = useQuizGame({ generate, totalRounds, lives, advanceOnWrong });
  const ended = quiz.status === "won" || quiz.status === "lost";

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

  const resolve = (v, arg) => (typeof v === "function" ? v(arg) : v);

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
        <QuizStage
          size={size}
          instruction={resolve(instruction, quiz.question)}
          prompt={renderPrompt ? renderPrompt(quiz.question) : quiz.question.prompt}
          promptLabel={resolve(promptLabel, quiz.question)}
          options={quiz.question.options}
          renderOption={renderOption}
          feedback={quiz.feedback}
          onAnswer={quiz.answer}
          columns={resolve(columns, quiz.question)}
        />
      )}
    </>
  );
}
