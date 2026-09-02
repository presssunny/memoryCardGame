import { QuizGameScreen } from "../shared/QuizGameScreen";
import { Pic } from "../../components/game-ui/Pic";
import { makeOddOneOutQuestion } from "./oddOneOut.data";

const TARGET_ROUNDS = 10;
const generate = (round) => makeOddOneOutQuestion(round);

const GROUP_NAME = {
  animals: "animals",
  fruit: "fruits",
  vehicles: "vehicles",
  food: "food",
  sports: "sports gear",
  nature: "plants",
  sea: "sea creatures",
  music: "instruments",
};

// After a wrong pick: name what the three had in common and what the odd
// one actually is — the point of the game, not just "try again".
function OddReview(quiz) {
  const q = quiz.question;
  return (
    <div className="quiz-review-body">
      <p className="quiz-review-verdict">✕ Not quite</p>
      <p>
        Three of them are <strong>{GROUP_NAME[q.groupId] ?? q.groupId}</strong>.
      </p>
      <p>
        The odd one is <strong>{GROUP_NAME[q.oddGroupId] ?? q.oddGroupId}</strong>.
      </p>
    </div>
  );
}

// "Tap the one that doesn't belong." Runs on the shared quiz screen: a wrong
// pick pauses on an explanation, wins after TARGET_ROUNDS.
export function OddOneOutGame(props) {
  return (
    <QuizGameScreen
      {...props}
      title="🔍 Odd One Out"
      generate={generate}
      totalRounds={TARGET_ROUNDS}
      review="wrong"
      renderReview={OddReview}
      instruction="Tap the one that doesn't belong"
      promptLabel="Which one doesn't belong?"
      renderPrompt={() => null}
      renderOption={(o) => <Pic id={o.pic} size="lg" />}
      columns={2}
      winNote={(quiz) =>
        `You found all ${TARGET_ROUNDS}! Best streak: ${quiz.bestStreak}`
      }
    />
  );
}
