import { QuizGameScreen } from "../shared/QuizGameScreen";
import { He } from "./SchoolPieces";
import { makeShapesColorsQuestion } from "./schoolQuestions";

const generate = (round) => makeShapesColorsQuestion(round);

export function ShapesColorsGame(props) {
  return (
    <QuizGameScreen
      {...props}
      hebrew
      title="🔺 צורות וצבעים"
      generate={generate}
      totalRounds={12}
      instruction={(q) => <He>{`מצאו: ${q.prompt.name}`}</He>}
      promptLabel={(q) => `מצאו: ${q.prompt.name}`}
      renderPrompt={() => null}
      renderOption={(o) => <span aria-label={o.name}>{o.emoji}</span>}
      columns={2}
      winNote={<He>צורות וצבעים — סידרתם הכול!</He>}
    />
  );
}
