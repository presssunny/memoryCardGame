import { QuizGameScreen } from "../shared/QuizGameScreen";
import { MathPrompt, MathExplain, He } from "./SchoolPieces";
import { makeFirstMathQuestion } from "./schoolQuestions";

const generate = (round) => makeFirstMathQuestion(round);

const labelFor = (p) => {
  const a = p.missing === "a" ? "?" : p.a;
  const b = p.missing === "b" ? "?" : p.b;
  const r = p.missing === "result" ? "?" : p.result;
  return `${a} ${p.op} ${b} = ${r}`;
};

// Shown after a wrong answer (review="wrong"): the full worked sum with dots
// so the child sees the relationship, then taps to continue.
function MathReview(quiz) {
  const p = quiz.question.prompt;
  return (
    <div className="school-review" dir="rtl">
      <p className="school-review-verdict">✕ נסו שוב בפעם הבאה</p>
      <p className="school-review-text">התרגיל המלא:</p>
      <MathExplain a={p.a} b={p.b} op={p.op} result={p.result} />
    </div>
  );
}

export function FirstMathGame(props) {
  return (
    <QuizGameScreen
      {...props}
      hebrew
      title="➕ חשבון ראשון"
      generate={generate}
      totalRounds={12}
      review="wrong"
      renderReview={MathReview}
      instruction={(q) => <He>{q.hint}</He>}
      promptLabel={(q) => labelFor(q.prompt)}
      renderPrompt={(q) => (
        <MathPrompt
          a={q.prompt.a}
          b={q.prompt.b}
          op={q.prompt.op}
          result={q.prompt.result}
          missing={q.prompt.missing}
          showDots={q.prompt.showDots}
        />
      )}
      renderOption={(o) => o.label}
      columns={4}
      winNote={<He>אלופי חשבון!</He>}
    />
  );
}
