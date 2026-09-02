import { QuizGameScreen } from "../shared/QuizGameScreen";
import { makeOddOneOutQuestion } from "./oddOneOut.data";

const TARGET_ROUNDS = 10;
const generate = (round) => makeOddOneOutQuestion(round);

// "Tap the one that doesn't belong." Runs on the shared quiz screen: same
// question stays until the child gets it, wins after TARGET_ROUNDS.
export function OddOneOutGame(props) {
  return (
    <QuizGameScreen
      {...props}
      title="🔍 Odd One Out"
      generate={generate}
      totalRounds={TARGET_ROUNDS}
      instruction="Tap the one that doesn't belong"
      promptLabel="Which one doesn't belong?"
      renderPrompt={() => null}
      renderOption={(o) => o.emoji}
      columns={2}
      winNote={(quiz) =>
        `You found all ${TARGET_ROUNDS}! Best streak: ${quiz.bestStreak}`
      }
    />
  );
}
