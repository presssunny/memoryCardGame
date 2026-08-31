import { QuizGameScreen } from "../shared/QuizGameScreen";
import { ItemsPrompt } from "./SchoolPieces";
import { makeCountQuestion } from "./schoolQuestions";

const generate = (round) => makeCountQuestion(round);

export function CountChooseGame(props) {
  return (
    <QuizGameScreen
      {...props}
      title="🔢 Count & Choose"
      generate={generate}
      totalRounds={12}
      instruction="How many do you see?"
      promptLabel={(q) => `Count the items — there are ${q.prompt.count}`}
      renderPrompt={(q) => <ItemsPrompt item={q.prompt.item} count={q.prompt.count} />}
      renderOption={(o) => o.label}
      columns={4}
      winNote={(quiz) => `You can count! Best streak: ${quiz.bestStreak}`}
    />
  );
}
