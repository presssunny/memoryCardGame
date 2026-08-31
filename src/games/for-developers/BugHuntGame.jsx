import { QuizGameScreen } from "../shared/QuizGameScreen";
import { makeBugHuntQuestion } from "./bugHunt.data";

const generate = (round) => makeBugHuntQuestion(round);

function CodeBlock({ snippet }) {
  return (
    <pre className="bughunt-code" aria-label="Code with a bug">
      <code>
        {snippet.lines.map((line, i) => (
          <span key={i} className="bughunt-line">
            <span className="bughunt-lineno">{i + 1}</span>
            <span className="bughunt-src">{line || " "}</span>
          </span>
        ))}
      </code>
    </pre>
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
      size="md"
      instruction="Which line has the bug?"
      promptLabel="Find the buggy line"
      renderPrompt={(q) => <CodeBlock snippet={q.prompt} />}
      renderOption={(o) => o.label}
      columns={(q) => Math.min(q.options.length, 4)}
      scoreLabel="Fixed:"
      loseTitle="Out of lives"
      winNote={(quiz) => `Best streak: ${quiz.bestStreak}`}
      loseNote={(quiz) =>
        quiz.question ? `The bug was on line ${quiz.question.prompt.bugLine}. ${quiz.question.prompt.hint}` : undefined
      }
    />
  );
}
