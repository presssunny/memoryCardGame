import { QuizGameScreen } from "../shared/QuizGameScreen";
import { makeBugHuntQuestion } from "./bugHunt.data";

const generate = (round) => makeBugHuntQuestion(round);

// The code, with the buggy line called out once the player has answered.
function CodeBlock({ snippet, revealLine, pickedLine }) {
  return (
    <pre className="bughunt-code" aria-label="Code with a bug">
      <code>
        {snippet.lines.map((line, i) => {
          const n = i + 1;
          const cls = [
            "bughunt-line",
            revealLine && n === revealLine ? "is-bug" : "",
            pickedLine && n === pickedLine && n !== revealLine ? "is-picked" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <span key={i} className={cls}>
              <span className="bughunt-lineno">{n}</span>
              <span className="bughunt-src">{line || " "}</span>
            </span>
          );
        })}
      </code>
    </pre>
  );
}

const lineOf = (feedback) =>
  feedback ? Number(String(feedback.id).replace("l", "")) : null;

// The explanation panel shown after every answer — what the bug is, why it
// bites, and the fixed line. The player taps "Next Bug" when they're ready.
function BugReview(quiz) {
  const snippet = quiz.question.prompt;
  const correct = !!quiz.feedback?.correct;
  const pickedLine = lineOf(quiz.feedback);

  return (
    <div className="bughunt-review">
      <p className="bughunt-review-verdict">
        {correct ? "✓ Nailed it" : "✕ Not that one"}
        {!correct && pickedLine ? (
          <span className="bughunt-review-sub">
            {" "}
            you picked line {pickedLine} — the bug is on line {snippet.bugLine}
          </span>
        ) : null}
      </p>

      <div className="bughunt-review-grid">
        <div className="bughunt-review-block">
          <span className="bughunt-review-label">🐛 The bug</span>
          <p>{snippet.hint}</p>
          <p className="bughunt-review-why">{snippet.why}</p>
        </div>
        <div className="bughunt-review-block">
          <span className="bughunt-review-label">✓ The fix</span>
          <pre className="bughunt-fix">
            <code>{snippet.fix.trim()}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export function BugHuntGame(props) {
  return (
    <QuizGameScreen
      {...props}
      title="🐛 Bug Hunt"
      generate={generate}
      lives={3}
      advanceOnWrong
      review="always"
      nextLabel="Next Bug"
      size="md"
      instruction="Which line has the bug?"
      promptLabel="Find the buggy line"
      renderPrompt={(q, quiz) => (
        <CodeBlock
          snippet={q.prompt}
          revealLine={quiz?.phase === "review" ? q.prompt.bugLine : null}
          pickedLine={quiz?.phase === "review" ? lineOf(quiz.feedback) : null}
        />
      )}
      renderReview={BugReview}
      renderOption={(o) => o.label}
      columns={(q) => Math.min(q.options.length, 4)}
      scoreLabel="Fixed:"
      loseTitle="Out of lives"
      winNote={(quiz) => `Best streak: ${quiz.bestStreak}`}
      loseNote={(quiz) =>
        quiz.question
          ? `The last bug was on line ${quiz.question.prompt.bugLine}. ${quiz.question.prompt.hint}`
          : undefined
      }
    />
  );
}
