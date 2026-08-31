import { QuizGameScreen } from "../shared/QuizGameScreen";
import { MathPrompt } from "./SchoolPieces";
import { makeFirstMathQuestion } from "./schoolQuestions";

const generate = (round) => makeFirstMathQuestion(round);

export function FirstMathGame(props) {
  return (
    <QuizGameScreen
      {...props}
      title="➕ First Math"
      generate={generate}
      totalRounds={12}
      instruction="What is the answer?"
      promptLabel={(q) => `${q.prompt.a} ${q.prompt.op} ${q.prompt.b}`}
      renderPrompt={(q) => (
        <MathPrompt a={q.prompt.a} b={q.prompt.b} op={q.prompt.op} showDots={q.prompt.showDots} />
      )}
      renderOption={(o) => o.label}
      columns={4}
      winNote={(quiz) => `You're a math star! Best streak: ${quiz.bestStreak}`}
    />
  );
}
