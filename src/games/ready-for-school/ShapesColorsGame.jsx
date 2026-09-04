import { QuizGameScreen } from "../shared/QuizGameScreen";
import { He, SchoolTryAgain } from "./SchoolPieces";
import { Pic } from "../../components/game-ui/Pic";
import { makeShapesColorsQuestion } from "./schoolQuestions";
import { speakShapesColors } from "./schoolSpeech";

const generate = (round) => makeShapesColorsQuestion(round);

// After a miss: show the shape/colour that was asked for.
function ShapeReview(quiz) {
  const q = quiz.question;
  const right = q.options.find((o) => o.correct);
  return <SchoolTryAgain pic={right.pic} text={`חיפשנו: ${q.prompt.name}`} />;
}

export function ShapesColorsGame(props) {
  return (
    <QuizGameScreen
      {...props}
      hebrew
      title="🔺 צורות וצבעים"
      generate={generate}
      totalRounds={12}
      review="wrong"
      renderReview={ShapeReview}
      instruction={(q) => <He>{`מצאו: ${q.prompt.name}`}</He>}
      speak={speakShapesColors}
      promptLabel={(q) => `מצאו: ${q.prompt.name}`}
      renderPrompt={(q) =>
        q.prompt.pic ? <Pic id={q.prompt.pic} alt={q.prompt.name} size="lg" /> : null
      }
      renderOption={(o) => <Pic id={o.pic} alt={o.name} size="lg" />}
      columns={2}
      winNote="צורות וצבעים — סידרתם הכול!"
    />
  );
}
