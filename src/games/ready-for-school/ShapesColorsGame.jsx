import { QuizGameScreen } from "../shared/QuizGameScreen";
import { makeShapesColorsQuestion } from "./schoolQuestions";

const generate = (round) => makeShapesColorsQuestion(round);

export function ShapesColorsGame(props) {
  return (
    <QuizGameScreen
      {...props}
      title="🔺 Shapes & Colors"
      generate={generate}
      totalRounds={12}
      instruction={(q) => `Find the ${q.prompt.name}`}
      promptLabel={(q) => `Find the ${q.prompt.name}`}
      renderPrompt={() => null}
      renderOption={(o) => <span aria-label={o.name}>{o.emoji}</span>}
      columns={2}
      winNote={(quiz) => `Shapes and colours sorted! Best streak: ${quiz.bestStreak}`}
    />
  );
}
