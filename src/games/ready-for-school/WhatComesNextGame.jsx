import { QuizGameScreen } from "../shared/QuizGameScreen";
import { SequencePrompt, He } from "./SchoolPieces";
import { makeWhatComesNextQuestion } from "./schoolQuestions";

const generate = (round) => makeWhatComesNextQuestion(round);

export function WhatComesNextGame(props) {
  return (
    <QuizGameScreen
      {...props}
      hebrew
      title="➡️ מה בא אחר כך?"
      generate={generate}
      totalRounds={10}
      instruction={<He>מה בא אחר כך?</He>}
      promptLabel="מה בא אחר כך בסדרה?"
      renderPrompt={(q) => <SequencePrompt items={q.prompt.items} />}
      renderOption={(o) => (o.emoji ? <span>{o.emoji}</span> : o.label)}
      columns={3}
      winNote={<He>מצאתם את כל הרצפים!</He>}
    />
  );
}
