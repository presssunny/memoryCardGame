import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// The state machine behind every "prompt + options, pick the right one"
// game — Odd One Out, Find the Letter, Count & Choose, Hex Guess, Bug Hunt
// and friends. The game supplies a `generate(round)` that returns the
// question; the engine owns rounds, score, streak, lives, feedback timing
// and win/lose.
//
//   generate(round)   -> { prompt, options } where options is
//                        [{ id, correct, ...anything the game renders }]
//                        with at least one `correct: true`. Keep it stable
//                        (module scope or useCallback) — it's read on every
//                        advance.
//   totalRounds       -> correct answers needed to win (default: endless)
//   lives             -> wrong answers allowed before losing (default: endless)
//   advanceOnWrong    -> a wrong answer still moves to the next question
//                        (adult quizzes); false keeps the same question so
//                        the player can try again (kid-friendly, default)
//   feedbackMs        -> how long the right/wrong highlight shows
//
// Returns: round, correctCount, wrongCount, streak, bestStreak, livesLeft,
// status ("playing" | "won" | "lost"), question, feedback ({ id, correct } |
// null), answer(optionId), restart().
export function useQuizGame({
  generate,
  totalRounds = Infinity,
  lives = Infinity,
  advanceOnWrong = false,
  feedbackMs = 700,
}) {
  const [round, setRound] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [status, setStatus] = useState("playing");
  const [question, setQuestion] = useState(() => generate(1));

  const timeoutRef = useRef(null);
  const clearPending = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);
  useEffect(() => clearPending, [clearPending]);

  const restart = useCallback(() => {
    clearPending();
    setRound(1);
    setCorrectCount(0);
    setWrongCount(0);
    setStreak(0);
    setBestStreak(0);
    setFeedback(null);
    setStatus("playing");
    setQuestion(generate(1));
  }, [clearPending, generate]);

  const answer = useCallback(
    (optionId) => {
      if (status !== "playing" || feedback) return;
      const picked = question.options.find((o) => o.id === optionId);
      if (!picked) return;
      const isCorrect = !!picked.correct;
      setFeedback({ id: optionId, correct: isCorrect });

      if (isCorrect) {
        const nextCorrect = correctCount + 1;
        const nextStreak = streak + 1;
        setCorrectCount(nextCorrect);
        setStreak(nextStreak);
        setBestStreak((b) => Math.max(b, nextStreak));

        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          setFeedback(null);
          if (nextCorrect >= totalRounds) {
            setStatus("won");
            return;
          }
          setRound((r) => r + 1);
          setQuestion(generate(round + 1));
        }, feedbackMs);
        return;
      }

      const nextWrong = wrongCount + 1;
      setWrongCount(nextWrong);
      setStreak(0);

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        setFeedback(null);
        if (nextWrong >= lives) {
          setStatus("lost");
          return;
        }
        if (advanceOnWrong) {
          setRound((r) => r + 1);
          setQuestion(generate(round + 1));
        }
      }, feedbackMs);
    },
    [
      status,
      feedback,
      question,
      correctCount,
      streak,
      wrongCount,
      round,
      totalRounds,
      lives,
      advanceOnWrong,
      feedbackMs,
      generate,
    ],
  );

  const livesLeft = useMemo(
    () => (lives === Infinity ? Infinity : Math.max(lives - wrongCount, 0)),
    [lives, wrongCount],
  );

  return {
    round,
    correctCount,
    wrongCount,
    streak,
    bestStreak,
    livesLeft,
    status,
    question,
    feedback,
    answer,
    restart,
  };
}
