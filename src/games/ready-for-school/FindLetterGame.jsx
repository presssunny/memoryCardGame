import { QuizGameScreen } from "../shared/QuizGameScreen";
import { HebrewLetter, He } from "./SchoolPieces";
import { makeFindLetterQuestion } from "./schoolQuestions";

const generate = (round) => makeFindLetterQuestion(round);

export function FindLetterGame(props) {
  return (
    <QuizGameScreen
      {...props}
      hebrew
      title="🔤 מצאו את האות"
      generate={generate}
      totalRounds={12}
      instruction={<He>הקישו על האות שרואים למעלה</He>}
      promptLabel={(q) => `מצאו את האות ${q.prompt.letter}`}
      renderPrompt={(q) => <HebrewLetter letter={q.prompt.letter} />}
      renderOption={(o) => <HebrewLetter letter={o.letter} />}
      columns={(q) => Math.min(q.options.length, 3)}
      winNote={<He>כל הכבוד! אתם מכירים את האותיות.</He>}
    />
  );
}
