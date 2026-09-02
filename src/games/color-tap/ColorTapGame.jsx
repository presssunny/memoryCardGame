import { QuizGameScreen } from "../shared/QuizGameScreen";
import { makeColorTapQuestion } from "./colorTap.data";

const TARGET_ROUNDS = 12;
const generate = (round) => makeColorTapQuestion(round);

const columnsFor = (q) => (q.options.length === 4 ? 2 : 3);

// "Tap the matching colour." Prompt and options are all swatches — no
// reading required. Runs on the shared quiz screen.
export function ColorTapGame(props) {
  return (
    <QuizGameScreen
      {...props}
      title="🎨 Color Tap"
      generate={generate}
      totalRounds={TARGET_ROUNDS}
      instruction="Tap the colour that matches"
      promptLabel={(q) => `Match this colour: ${q.prompt.name}`}
      renderPrompt={(q) => (
        <span
          className="color-swatch color-swatch--prompt"
          style={{ background: q.prompt.hex }}
          aria-hidden="true"
        />
      )}
      renderOption={(o) => (
        <span
          className="color-swatch"
          style={{ background: o.hex }}
          aria-label={o.name}
        />
      )}
      columns={columnsFor}
      winNote={(quiz) =>
        `All ${TARGET_ROUNDS} colours matched! Best streak: ${quiz.bestStreak}`
      }
    />
  );
}
