import { QuizGameScreen } from "../shared/QuizGameScreen";
import { SequencePrompt, He, SchoolTryAgain } from "./SchoolPieces";
import { Pic } from "../../components/game-ui/Pic";
import { makeWhatComesNextQuestion } from "./schoolQuestions";

const generate = (round) => makeWhatComesNextQuestion(round);

// After a miss: replay the sequence with the right next token filled in.
function NextReview(quiz) {
  const right = quiz.question.options.find((o) => o.correct);
  return (
    <SchoolTryAgain
      pic={right.pic || undefined}
      text={right.pic ? "זה מה שבא אחר כך" : `הבא בתור: ${right.label}`}
    />
  );
}

export function WhatComesNextGame(props) {
  return (
    <QuizGameScreen
      {...props}
      hebrew
      title="➡️ מה בא אחר כך?"
      generate={generate}
      totalRounds={10}
      review="wrong"
      renderReview={NextReview}
      instruction={<He>מה בא אחר כך?</He>}
      promptLabel="מה בא אחר כך בסדרה?"
      renderPrompt={(q) => <SequencePrompt items={q.prompt.items} />}
      renderOption={(o) => (o.pic ? <Pic id={o.pic} hebrew size="lg" /> : o.label)}
      columns={3}
      winNote={<He>מצאתם את כל הרצפים!</He>}
    />
  );
}
