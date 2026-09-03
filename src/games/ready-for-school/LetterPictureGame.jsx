import { QuizGameScreen } from "../shared/QuizGameScreen";
import { HebrewLetter, He, SchoolTryAgain } from "./SchoolPieces";
import { Pic } from "../../components/game-ui/Pic";
import { makeLetterPictureQuestion } from "./schoolQuestions";
import { speakLetterPicture } from "./schoolSpeech";

const generate = (round) => makeLetterPictureQuestion(round);

// After a miss: show the picture whose word really starts with the letter.
function LetterReview(quiz) {
  const q = quiz.question;
  const right = q.options.find((o) => o.correct);
  return (
    <SchoolTryAgain
      pic={right.pic}
      text={`${right.word} מתחילה באות ${q.prompt.letter}`}
    />
  );
}

export function LetterPictureGame(props) {
  return (
    <QuizGameScreen
      {...props}
      hebrew
      title="🖼️ אות ותמונה"
      generate={generate}
      totalRounds={10}
      review="wrong"
      renderReview={LetterReview}
      instruction={<He>איזו תמונה מתחילה באות הזו?</He>}
      speak={speakLetterPicture}
      promptLabel={(q) => `איזו תמונה מתחילה באות ${q.prompt.letter}?`}
      renderPrompt={(q) => <HebrewLetter letter={q.prompt.letter} />}
      renderOption={(o) => <Pic id={o.pic} alt={o.word} size="lg" />}
      columns={(q) => Math.min(q.options.length, 2)}
      winNote={<He>יופי של התאמה!</He>}
    />
  );
}
