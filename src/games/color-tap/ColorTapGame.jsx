import { useCallback } from "react";
import { GameHeader } from "../../components/GameHeader";
import { QuizStage } from "../../components/QuizStage";
import { WinMessage } from "../../components/WinMessage";
import { useQuizGame } from "../shared/useQuizGame";
import { useGameResult } from "../shared/useGameResult";
import { makeColorTapQuestion } from "./colorTap.data";

const TARGET_ROUNDS = 12;

// "Tap the matching colour." The prompt is a big swatch; the options are
// swatches too. Reading not required.
export function ColorTapGame({ gameId, bestScores, onExit }) {
  const generate = useCallback((round) => makeColorTapQuestion(round), []);

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
        title="🎨 Color Tap"
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
          note={`All ${TARGET_ROUNDS} colours matched! Best streak: ${bestStreak}`}
          onNewGame={restart}
        />
      ) : (
        <QuizStage
          size="lg"
          instruction="Tap the colour that matches"
          prompt={
            <span
              className="color-swatch color-swatch--prompt"
              style={{ background: question.prompt.hex }}
              aria-hidden="true"
            />
          }
          promptLabel={`Match this colour: ${question.prompt.name}`}
          options={question.options}
          renderOption={(o) => (
            <span
              className="color-swatch"
              style={{ background: o.hex }}
              aria-label={o.name}
            />
          )}
          feedback={feedback}
          onAnswer={answer}
          columns={
            question.options.length === 3
              ? 3
              : question.options.length === 5
                ? 3
                : 2
          }
        />
      )}
    </>
  );
}
