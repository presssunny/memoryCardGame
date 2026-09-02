import { QuizGameScreen } from "../shared/QuizGameScreen";
import { MathPrompt, He } from "./SchoolPieces";
import { makeFirstMathQuestion } from "./schoolQuestions";

const generate = (round) => makeFirstMathQuestion(round);

export function FirstMathGame(props) {
  return (
    <QuizGameScreen
      {...props}
      hebrew
      title="➕ חשבון ראשון"
      generate={generate}
      totalRounds={12}
      instruction={<He>מה התשובה?</He>}
      promptLabel={(q) => `${q.prompt.a} ${q.prompt.op} ${q.prompt.b}`}
      renderPrompt={(q) => (
        <MathPrompt a={q.prompt.a} b={q.prompt.b} op={q.prompt.op} showDots={q.prompt.showDots} />
      )}
      renderOption={(o) => o.label}
      columns={4}
      winNote={<He>אלופי חשבון!</He>}
    />
  );
}
