import { QuizGameScreen } from "../shared/QuizGameScreen";
import { He } from "./SchoolPieces";
import { makeWhichDoesntBelongQuestion } from "./schoolQuestions";

const generate = (round) => makeWhichDoesntBelongQuestion(round);

export function WhichDoesntBelongGame(props) {
  return (
    <QuizGameScreen
      {...props}
      hebrew
      title="🧩 מה לא שייך?"
      generate={generate}
      totalRounds={10}
      instruction={<He>הקישו על מה שלא שייך</He>}
      promptLabel="מה לא שייך?"
      renderPrompt={() => null}
      renderOption={(o) => <span>{o.emoji}</span>}
      columns={2}
      winNote={<He>חשיבה חדה!</He>}
    />
  );
}
