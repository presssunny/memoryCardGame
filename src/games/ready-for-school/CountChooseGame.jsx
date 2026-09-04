import { QuizGameScreen } from "../shared/QuizGameScreen";
import { ItemsPrompt, He, SchoolTryAgain } from "./SchoolPieces";
import { makeCountQuestion } from "./schoolQuestions";
import { speakCount } from "./schoolSpeech";

const generate = (round) => makeCountQuestion(round);

// After a miss: say the real count so the child can recount with the row
// still on screen.
function CountReview(quiz) {
  return <SchoolTryAgain text={`ספרו שוב — יש כאן ${quiz.question.prompt.count}`} />;
}

export function CountChooseGame(props) {
  return (
    <QuizGameScreen
      {...props}
      hebrew
      title="🔢 סופרים ובוחרים"
      generate={generate}
      totalRounds={12}
      review="wrong"
      renderReview={CountReview}
      instruction={<He>כמה יש?</He>}
      speak={speakCount}
      promptLabel={(q) => `ספרו את הפריטים — יש ${q.prompt.count}`}
      renderPrompt={(q) => <ItemsPrompt item={q.prompt.item} count={q.prompt.count} />}
      renderOption={(o) => o.label}
      columns={4}
      winNote="אתם יודעים לספור!"
    />
  );
}
