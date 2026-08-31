import { useCallback } from "react";
import { GameHeader } from "../../components/GameHeader";
import { QuizStage } from "../../components/QuizStage";
import { WinMessage } from "../../components/WinMessage";
import { useQuizGame } from "../shared/useQuizGame";
import { useCountdown } from "../shared/useCountdown";
import { useGameResult } from "../shared/useGameResult";
import { makeMathSprintQuestion } from "./mathSprint.data";

const SECONDS = 45;
const generate = (round) => makeMathSprintQuestion(round);

// Answer as many as you can before the clock runs out.
export function MathSprintGame({ gameId, bestScores, onExit }) {
  const quiz = useQuizGame({ generate, advanceOnWrong: true, feedbackMs: 350 });
  // The countdown parks itself at zero (see useCountdown) — no extra guard.
  const { secondsLeft, reset: resetClock } = useCountdown(SECONDS);
  const timeUp = secondsLeft <= 0;

  const best = useGameResult(bestScores, gameId, "default", {
    ended: timeUp,
    result: { moves: quiz.correctCount, score: quiz.correctCount },
    higherIsBetter: true,
  });

  const restart = useCallback(() => {
    quiz.restart();
    resetClock();
  }, [quiz, resetClock]);

  return (
    <>
      <GameHeader
        title="⏱️ Math Sprint"
        score={quiz.correctCount}
        scoreLabel="Solved:"
        best={best}
        bestUnit="solved"
        extraStat={{ label: "Time:", value: `${secondsLeft}s` }}
        onReset={restart}
        onExit={onExit}
      />
      {timeUp ? (
        <WinMessage
          moves={quiz.correctCount}
          score={quiz.correctCount}
          best={best}
          note={`Time! You solved ${quiz.correctCount}. Best: ${
            best ? best.moves : quiz.correctCount
          }`}
          onNewGame={restart}
        />
      ) : (
        <QuizStage
          size="md"
          instruction="Solve it — fast"
          prompt={<span className="sprint-sum">{quiz.question.prompt.text}</span>}
          promptLabel={quiz.question.prompt.text}
          options={quiz.question.options}
          renderOption={(o) => o.label}
          feedback={quiz.feedback}
          onAnswer={quiz.answer}
          columns={4}
        />
      )}
    </>
  );
}
