import { QuizGameScreen } from "../shared/QuizGameScreen";
import { HebrewLetter, He } from "./SchoolPieces";
import { makeLetterPictureQuestion } from "./schoolQuestions";

const generate = (round) => makeLetterPictureQuestion(round);

export function LetterPictureGame(props) {
  return (
    <QuizGameScreen
      {...props}
      hebrew
      title="🖼️ אות ותמונה"
      generate={generate}
      totalRounds={10}
      instruction={<He>איזו תמונה מתחילה באות הזו?</He>}
      promptLabel={(q) => `איזו תמונה מתחילה באות ${q.prompt.letter}?`}
      renderPrompt={(q) => <HebrewLetter letter={q.prompt.letter} />}
      renderOption={(o) => <span aria-label={o.word}>{o.emoji}</span>}
      columns={(q) => Math.min(q.options.length, 2)}
      winNote={<He>יופי של התאמה!</He>}
    />
  );
}
