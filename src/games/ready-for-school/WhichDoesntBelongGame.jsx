import { QuizGameScreen } from "../shared/QuizGameScreen";
import { makeWhichDoesntBelongQuestion } from "./schoolQuestions";

const generate = (round) => makeWhichDoesntBelongQuestion(round);

export function WhichDoesntBelongGame(props) {
  return (
    <QuizGameScreen
      {...props}
      title="🧩 Which Doesn't Belong?"
      generate={generate}
      totalRounds={10}
      instruction="Tap the one that doesn't belong with the others"
      promptLabel="Which one doesn't belong?"
      renderPrompt={() => null}
      renderOption={(o) => <span>{o.emoji}</span>}
      columns={2}
      winNote={(quiz) => `Sharp thinking! Best streak: ${quiz.bestStreak}`}
    />
  );
}
