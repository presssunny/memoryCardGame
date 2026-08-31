import { QuizGameScreen } from "../shared/QuizGameScreen";
import { HebrewLetter } from "./SchoolPieces";
import { makeFindLetterQuestion } from "./schoolQuestions";

const generate = (round) => makeFindLetterQuestion(round);

export function FindLetterGame(props) {
  return (
    <QuizGameScreen
      {...props}
      title="🔤 Find the Letter"
      generate={generate}
      totalRounds={12}
      instruction="Which letter is this?"
      promptLabel={(q) => `Find this letter: ${q.prompt.letter}`}
      renderPrompt={(q) => <HebrewLetter letter={q.prompt.letter} />}
      renderOption={(o) => <HebrewLetter letter={o.letter} />}
      columns={(q) => Math.min(q.options.length, 3)}
      winNote={(quiz) => `You know your letters! Best streak: ${quiz.bestStreak}`}
    />
  );
}
