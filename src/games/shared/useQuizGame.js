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
//   feedbackMs        -> how long the right/wrong highlight shows before the
//                        engine auto-advances (ignored while reviewing)
//   review            -> "off" (default) | "wrong" | "always". When the
//                        engine reviews, it does NOT auto-advance: it enters
//                        `phase: "review"` and waits for `next()`, so the
//                        game can show an explanation the player dismisses
//                        themselves (Bug Hunt: the bug + the fix).
//
// Returns: round, correctCount, wrongCount, streak, bestStreak, livesLeft,
// status ("playing" | "won" | "lost"), phase ("idle" | "review"),
// question, feedback ({ id, correct } | null), answer(optionId), next(),
// restart().
export function useQuizGame({
  generate,
  totalRounds = Infinity,
  lives = Infinity,
  advanceOnWrong = false,
  feedbackMs = 700,
  review = "off",
  // perQuestionMs: a per-question deadline (Stroop). When it elapses before
  // an answer, the question is counted wrong (streak breaks, a life is
  // spent) exactly as a wrong tap would — so speed is part of the score.
  // null/0 = untimed (the default for every other quiz game).
  perQuestionMs = null,
}) {
  const [round, setRound] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [status, setStatus] = useState("playing");
  const [phase, setPhase] = useState("idle"); // idle | review
  const [question, setQuestion] = useState(() => generate(1));

  const timeoutRef = useRef(null);
  const pendingRef = useRef(null); // captured payload while reviewing
  const clearPending = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);
  useEffect(() => clearPending, [clearPending]);

  const restart = useCallback(() => {
    clearPending();
    pendingRef.current = null;
    setRound(1);
    setCorrectCount(0);
    setWrongCount(0);
    setStreak(0);
    setBestStreak(0);
    setFeedback(null);
    setStatus("playing");
    setPhase("idle");
    setQuestion(generate(1));
  }, [clearPending, generate]);

  // The shared tail of an answered question — either fired on a timer (no
  // review) or from `next()` (review dismissed). Everything it needs is
  // captured in `p` at answer time, so it never reads changing state.
  const advance = useCallback(
    (p) => {
      // p: { wasCorrect, nextCorrect, nextWrong, atRound }
      setFeedback(null);
      setPhase("idle");
      if (p.wasCorrect) {
        if (p.nextCorrect >= totalRounds) {
          setStatus("won");
          return;
        }
        setRound(p.atRound + 1);
        setQuestion(generate(p.atRound + 1));
        return;
      }
      if (p.nextWrong >= lives) {
        setStatus("lost");
        return;
      }
      if (advanceOnWrong) {
        setRound(p.atRound + 1);
        setQuestion(generate(p.atRound + 1));
      }
    },
    [totalRounds, lives, advanceOnWrong, generate],
  );

  const answer = useCallback(
    (optionId) => {
      if (status !== "playing" || phase !== "idle" || feedback) return;
      const picked = question.options.find((o) => o.id === optionId);
      if (!picked) return;
      const isCorrect = !!picked.correct;
      setFeedback({ id: optionId, correct: isCorrect });

      const nextCorrect = correctCount + (isCorrect ? 1 : 0);
      const nextWrong = wrongCount + (isCorrect ? 0 : 1);

      if (isCorrect) {
        const nextStreak = streak + 1;
        setCorrectCount(nextCorrect);
        setStreak(nextStreak);
        setBestStreak((b) => Math.max(b, nextStreak));
      } else {
        setWrongCount(nextWrong);
        setStreak(0);
      }

      const payload = { wasCorrect: isCorrect, nextCorrect, nextWrong, atRound: round };
      const shouldReview =
        review === "always" || (review === "wrong" && !isCorrect);

      if (shouldReview) {
        pendingRef.current = payload;
        setPhase("review");
        return;
      }
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        advance(payload);
      }, feedbackMs);
    },
    [
      status,
      phase,
      feedback,
      question,
      correctCount,
      wrongCount,
      streak,
      round,
      review,
      feedbackMs,
      advance,
    ],
  );

  const next = useCallback(() => {
    if (phase !== "review" || !pendingRef.current) return;
    const payload = pendingRef.current;
    pendingRef.current = null;
    advance(payload);
  }, [phase, advance]);

  // The per-question deadline expired — score it as a wrong answer.
  const expire = useCallback(() => {
    if (status !== "playing" || phase !== "idle" || feedback) return;
    setFeedback({ id: null, correct: false });
    const nextWrong = wrongCount + 1;
    setWrongCount(nextWrong);
    setStreak(0);
    const payload = {
      wasCorrect: false,
      nextCorrect: correctCount,
      nextWrong,
      atRound: round,
    };
    if (review === "always" || review === "wrong") {
      pendingRef.current = payload;
      setPhase("review");
      return;
    }
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      advance(payload);
    }, feedbackMs);
  }, [
    status,
    phase,
    feedback,
    wrongCount,
    correctCount,
    round,
    review,
    feedbackMs,
    advance,
  ]);

  // Run the per-question clock while a fresh question is on screen. Keyed on
  // `question` (a new object every advance AND every restart) so a stale
  // deadline is always cleared — restart() doesn't touch this timer itself.
  useEffect(() => {
    if (!perQuestionMs) return undefined;
    if (status !== "playing" || phase !== "idle" || feedback) return undefined;
    const id = setTimeout(expire, perQuestionMs);
    return () => clearTimeout(id);
  }, [perQuestionMs, status, phase, feedback, question, expire]);

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
    phase,
    question,
    feedback,
    perQuestionMs,
    answer,
    next,
    restart,
  };
}
