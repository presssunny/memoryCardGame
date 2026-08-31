import { QuizGameScreen } from "../shared/QuizGameScreen";
import { HebrewLetter } from "./SchoolPieces";
import { makeLetterPictureQuestion } from "./schoolQuestions";

const generate = (round) => makeLetterPictureQuestion(round);

export function LetterPictureGame(props) {
  return (
    <QuizGameScreen
      {...props}
      title="🖼️ Letter & Picture"
      generate={generate}
      totalRounds={10}
      instruction="Which picture starts with this letter?"
      promptLabel={(q) => `Which picture starts with ${q.prompt.letter}?`}
      renderPrompt={(q) => <HebrewLetter letter={q.prompt.letter} />}
      renderOption={(o) => <span aria-label={o.word}>{o.emoji}</span>}
      columns={(q) => Math.min(q.options.length, 2)}
      winNote={(quiz) => `Great matching! Best streak: ${quiz.bestStreak}`}
    />
  );
}
