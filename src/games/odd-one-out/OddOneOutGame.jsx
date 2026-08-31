import { useCallback } from "react";
import { GameHeader } from "../../components/GameHeader";
import { QuizStage } from "../../components/QuizStage";
import { WinMessage } from "../../components/WinMessage";
import { useQuizGame } from "../shared/useQuizGame";
import { useGameResult } from "../shared/useGameResult";
import { makeOddOneOutQuestion } from "./oddOneOut.data";

const TARGET_ROUNDS = 10;

// "Tap the one that doesn't belong." A quiz game (useQuizGame): keeps the
// same question until the child gets it, wins after TARGET_ROUNDS.
export function OddOneOutGame({ gameId, bestScores, onExit }) {
  const generate = useCallback((round) => makeOddOneOutQuestion(round), []);

  const {
    round,
    correctCount,
    bestStreak,
    status,
    question,
    feedback,
    answer,
    restart,
  } = useQuizGame({ generate, totalRounds: TARGET_ROUNDS });

  const best = useGameResult(bestScores, gameId, "default", {
    ended: status === "won",
    result: { moves: bestStreak, score: correctCount },
    higherIsBetter: true,
  });

  return (
    <>
      <GameHeader
        title="🔍 Odd One Out"
        score={correctCount}
        scoreLabel="Found:"
        moves={round}
        movesLabel="Round:"
        best={best}
        bestUnit="streak"
        onReset={restart}
        onExit={onExit}
      />
      {status === "won" ? (
        <WinMessage
          moves={bestStreak}
          score={correctCount}
          best={best}
          note={`You found all ${TARGET_ROUNDS}! Best streak: ${bestStreak}`}
          onNewGame={restart}
        />
      ) : (
        <QuizStage
          size="lg"
          instruction="Tap the one that doesn't belong"
          prompt={null}
          options={question.options}
          renderOption={(o) => o.emoji}
          feedback={feedback}
          onAnswer={answer}
          columns={2}
        />
      )}
    </>
  );
}
