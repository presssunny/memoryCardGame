import { QuizGameScreen } from "../shared/QuizGameScreen";
import { makeHexQuestion } from "./hexColor.data";

const generate = (round) => makeHexQuestion(round);

export function HexColorGuessGame(props) {
  return (
    <QuizGameScreen
      {...props}
      title="🎨 Hex Color Guess"
      generate={generate}
      lives={4}
      advanceOnWrong
      size="md"
      instruction="Which hex code is this colour?"
      promptLabel={(q) => `Guess the hex for ${q.prompt.hex}`}
      renderPrompt={(q) => (
        <span
          className="color-swatch color-swatch--prompt"
          style={{ background: q.prompt.hex }}
          aria-hidden="true"
        />
      )}
      renderOption={(o) => <code>{o.hex}</code>}
      columns={(q) => Math.min(q.options.length, 2)}
      scoreLabel="Correct:"
      loseTitle="Out of guesses"
      winNote={(quiz) => `Best streak: ${quiz.bestStreak}`}
    />
  );
}
