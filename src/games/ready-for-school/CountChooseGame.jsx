import { QuizGameScreen } from "../shared/QuizGameScreen";
import { ItemsPrompt, He } from "./SchoolPieces";
import { makeCountQuestion } from "./schoolQuestions";

const generate = (round) => makeCountQuestion(round);

export function CountChooseGame(props) {
  return (
    <QuizGameScreen
      {...props}
      hebrew
      title="🔢 סופרים ובוחרים"
      generate={generate}
      totalRounds={12}
      instruction={<He>כמה יש?</He>}
      promptLabel={(q) => `ספרו את הפריטים — יש ${q.prompt.count}`}
      renderPrompt={(q) => <ItemsPrompt item={q.prompt.item} count={q.prompt.count} />}
      renderOption={(o) => o.label}
      columns={4}
      winNote={<He>אתם יודעים לספור!</He>}
    />
  );
}
