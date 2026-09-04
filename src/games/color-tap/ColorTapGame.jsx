import { QuizGameScreen } from "../shared/QuizGameScreen";
import { makeColorTapQuestion } from "./colorTap.data";

const TARGET_ROUNDS = 12;
const generate = (round) => makeColorTapQuestion(round);

const columnsFor = (q) => (q.options.length === 4 ? 2 : 3);

// After a miss: show the colour that was asked for, next to "try again".
function ColorReview(quiz) {
  const right = quiz.question.options.find((o) => o.correct);
  return (
    <div className="quiz-review-body">
      <p className="quiz-review-verdict">✕ Try again</p>
      <p className="quiz-review-swatch-row">
        <span
          className="color-swatch color-swatch--review"
          style={{ background: right.hex }}
          aria-hidden="true"
        />
        <span>Match the <strong>{right.name.toLowerCase()}</strong> one</span>
      </p>
    </div>
  );
}

// "Tap the matching colour." Prompt and options are all swatches — no
// reading required. Runs on the shared quiz screen.
export function ColorTapGame(props) {
  return (
    <QuizGameScreen
      {...props}
      title="🎨 Color Tap"
      generate={generate}
      totalRounds={TARGET_ROUNDS}
      review="wrong"
      renderReview={ColorReview}
      instruction="Tap the colour that matches"
      promptLabel={(q) => `Match this colour: ${q.prompt.name}`}
      renderPrompt={(q) => (
        <span
          className="color-swatch color-swatch--prompt"
          style={{ background: q.prompt.hex }}
          aria-hidden="true"
        />
      )}
      optionLabel={(o) => o.name}
      renderOption={(o) => (
        <span
          className="color-swatch"
          style={{ background: o.hex }}
          aria-hidden="true"
        />
      )}
      columns={columnsFor}
      winNote={(quiz) =>
        `All ${TARGET_ROUNDS} colours matched! Best streak: ${quiz.bestStreak}`
      }
    />
  );
}
