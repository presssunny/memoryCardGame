import { QuizGameScreen } from "../shared/QuizGameScreen";
import { makeStroopQuestion } from "./stroop.data";

const generate = (round) => makeStroopQuestion(round);

// Say the colour of the INK, not the word. Trains inhibition/attention.
export function StroopGame(props) {
  return (
    <QuizGameScreen
      {...props}
      title="🎨 Stroop Test"
      generate={generate}
      lives={3}
      advanceOnWrong
      // The whole point of Stroop is speed under interference — answer
      // within 3s or the question counts against you.
      perQuestionMs={3000}
      instruction="Tap the ink colour before the bar runs out"
      promptLabel={(q) => `Ink colour: ${q.prompt.inkName}`}
      renderPrompt={(q) => (
        <span className="stroop-word" style={{ color: q.prompt.ink }}>
          {q.prompt.word}
        </span>
      )}
      renderOption={(o) => o.name}
      columns={(q) => Math.min(q.options.length, 4)}
      scoreLabel="Correct:"
      bestUnit="streak"
      loseTitle="Out of lives"
    />
  );
}
