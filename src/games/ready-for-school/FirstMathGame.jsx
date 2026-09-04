import { QuizGameScreen } from "../shared/QuizGameScreen";
import { MathPrompt, MathExplain, He } from "./SchoolPieces";
import { SpeakButton } from "../../components/game-ui";
import { makeFirstMathQuestion } from "./schoolQuestions";
import { speakFirstMath } from "./schoolSpeech";

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
  const word = p.op === "+" ? "ועוד" : "פחות";
  return (
    <div className="school-review" dir="rtl">
      <div className="school-review-head">
        <p className="school-review-verdict">✕ נסו שוב בפעם הבאה</p>
        <SpeakButton
          text={`התרגיל המלא: ${p.a} ${word} ${p.b} זה ${p.result}.`}
          label="השמעת ההסבר"
        />
      </div>
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
      speak={speakFirstMath}
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
      winNote="אלופי חשבון!"
    />
  );
}
