import { useCallback, useEffect, useRef, useState } from "react";

// Drives Follow Instructions: the child taps the board's targets in the
// order the round asks for. A wrong tap ends the round's attempt (it can be
// retried); completing every step advances to a longer instruction.
//
//   makeRound(round) -> { board, steps: [targetId], text }   (stable fn)
//   totalRounds      -> rounds to win
export function useInstructionGame({ makeRound, totalRounds = 8, feedbackMs = 650 }) {
  const [round, setRound] = useState(1);
  const [data, setData] = useState(() => makeRound(1));
  const [step, setStep] = useState(0);
  const [done, setDone] = useState([]); // target ids already tapped this attempt
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState(null); // { id, correct }
  const [status, setStatus] = useState("playing"); // playing | won

  const timeoutRef = useRef(null);
  const clearPending = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);
  useEffect(() => clearPending, [clearPending]);

  const restart = useCallback(() => {
    clearPending();
    setRound(1);
    setData(makeRound(1));
    setStep(0);
    setDone([]);
    setStreak(0);
    setBestStreak(0);
    setFeedback(null);
    setStatus("playing");
  }, [clearPending, makeRound]);

  const tap = useCallback(
    (targetId) => {
      if (status !== "playing" || feedback) return;
      const expected = data.steps[step];
      const correct = targetId === expected;
      setFeedback({ id: targetId, correct });

      if (!correct) {
        setStreak(0);
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          setFeedback(null);
          setStep(0);
          setDone([]);
        }, feedbackMs);
        return;
      }

      const nextStep = step + 1;
      setDone((d) => [...d, targetId]);

      if (nextStep < data.steps.length) {
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          setFeedback(null);
          setStep(nextStep);
        }, feedbackMs);
        return;
      }

      // Round complete.
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setBestStreak((b) => Math.max(b, nextStreak));
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        setFeedback(null);
        if (round >= totalRounds) {
          setStatus("won");
          return;
        }
        const nextRound = round + 1;
        setRound(nextRound);
        setData(makeRound(nextRound));
        setStep(0);
        setDone([]);
      }, feedbackMs);
    },
    [status, feedback, data, step, streak, round, totalRounds, makeRound, feedbackMs],
  );

  return {
    round,
    board: data.board,
    steps: data.steps,
    text: data.text,
    step,
    done,
    streak,
    bestStreak,
    feedback,
    status,
    tap,
    restart,
  };
}
