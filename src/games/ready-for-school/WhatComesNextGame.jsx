import { QuizGameScreen } from "../shared/QuizGameScreen";
import { SequencePrompt } from "./SchoolPieces";
import { makeWhatComesNextQuestion } from "./schoolQuestions";

const generate = (round) => makeWhatComesNextQuestion(round);

export function WhatComesNextGame(props) {
  return (
    <QuizGameScreen
      {...props}
      title="➡️ What Comes Next?"
      generate={generate}
      totalRounds={10}
      instruction="What comes next?"
      promptLabel="What comes next in the pattern?"
      renderPrompt={(q) => <SequencePrompt items={q.prompt.items} />}
      renderOption={(o) => (o.emoji ? <span>{o.emoji}</span> : o.label)}
      columns={3}
      winNote={(quiz) => `You spotted every pattern! Best streak: ${quiz.bestStreak}`}
    />
  );
}
