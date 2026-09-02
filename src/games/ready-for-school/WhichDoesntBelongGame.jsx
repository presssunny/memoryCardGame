import { QuizGameScreen } from "../shared/QuizGameScreen";
import { He } from "./SchoolPieces";
import { Pic } from "../../components/game-ui/Pic";
import { makeWhichDoesntBelongQuestion } from "./schoolQuestions";

const generate = (round) => makeWhichDoesntBelongQuestion(round);

// After a wrong pick: name what the others have in common and why the odd
// one is odd — the point of the game, not just "try again".
function OddReview(quiz) {
  const q = quiz.question;
  return (
    <div className="school-review" dir="rtl">
      <p className="school-review-verdict">✕ כמעט!</p>
      <p className="school-review-text">
        שלושה מהם הם <strong>{q.group}</strong>.
      </p>
      <p className="school-review-text">{q.why}.</p>
    </div>
  );
}

export function WhichDoesntBelongGame(props) {
  return (
    <QuizGameScreen
      {...props}
      hebrew
      title="🧩 מה לא שייך?"
      generate={generate}
      totalRounds={10}
      review="wrong"
      renderReview={OddReview}
      instruction={<He>הקישו על מה שלא שייך</He>}
      promptLabel="מה לא שייך?"
      renderPrompt={() => null}
      renderOption={(o) => <Pic id={o.pic} hebrew size="lg" />}
      columns={2}
      winNote={<He>חשיבה חדה!</He>}
    />
  );
}
