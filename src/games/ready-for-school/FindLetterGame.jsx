import { QuizGameScreen } from "../shared/QuizGameScreen";
import { HebrewLetter, He, SchoolTryAgain } from "./SchoolPieces";
import { makeFindLetterQuestion } from "./schoolQuestions";
import { speakFindLetter } from "./schoolSpeech";

const generate = (round) => makeFindLetterQuestion(round);

// After a miss: show the letter that was being asked for, big.
function LetterReview(quiz) {
  const q = quiz.question;
  const right = q.options.find((o) => o.correct);
  return (
    <SchoolTryAgain
      text={
        q.prompt.mode === "same"
          ? `חיפשנו את האות הזו:`
          : `הצורה הנכונה היא:`
      }
    >
      <HebrewLetter letter={right.letter} />
    </SchoolTryAgain>
  );
}

export function FindLetterGame(props) {
  return (
    <QuizGameScreen
      {...props}
      hebrew
      title="🔤 מצאו את האות"
      generate={generate}
      totalRounds={12}
      review="wrong"
      renderReview={LetterReview}
      instruction={(q) => <He>{q.hint}</He>}
      speak={speakFindLetter}
      promptLabel={(q) =>
        q.prompt.mode === "same"
          ? `מצאו את האות ${q.prompt.letter}`
          : `האות ${q.prompt.letter}`
      }
      renderPrompt={(q) => (
        <HebrewLetter letter={q.prompt.letter} />
      )}
      renderOption={(o) => <HebrewLetter letter={o.letter} />}
      columns={(q) => Math.min(q.options.length, 4)}
      winNote={<He>כל הכבוד! אתם מכירים את האותיות ואת הצורות הסופיות.</He>}
    />
  );
}
