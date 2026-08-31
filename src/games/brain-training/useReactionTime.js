import { useCallback, useEffect, useRef, useState } from "react";

const TRIALS = 5;
const MIN_WAIT_MS = 1200;
const MAX_WAIT_MS = 3600;

// Reaction-time trainer. A trial: a "wait for green" screen, a random delay,
// then GO — the tap's delay in milliseconds is recorded. Tapping early is a
// false start and the trial repeats. After TRIALS good taps it's done.
//
//   phase: "idle" | "waiting" | "go" | "result" | "early" | "done"
export function useReactionTime({ trials = TRIALS, rng = Math.random } = {}) {
  const [phase, setPhase] = useState("idle");
  const [times, setTimes] = useState([]);
  const [lastMs, setLastMs] = useState(null);

  const goAtRef = useRef(0);
  const timeoutRef = useRef(null);

  const clearPending = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);
  useEffect(() => clearPending, [clearPending]);

  const beginWait = useCallback(() => {
    clearPending();
    setPhase("waiting");
    const delay = MIN_WAIT_MS + rng() * (MAX_WAIT_MS - MIN_WAIT_MS);
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      goAtRef.current = performance.now();
      setPhase("go");
    }, delay);
  }, [clearPending, rng]);

  const restart = useCallback(() => {
    clearPending();
    setTimes([]);
    setLastMs(null);
    setPhase("idle");
  }, [clearPending]);

  // The single input. What it does depends on the phase.
  const press = useCallback(() => {
    if (phase === "idle" || phase === "result" || phase === "early") {
      beginWait();
      return;
    }
    if (phase === "waiting") {
      clearPending();
      setPhase("early");
      return;
    }
    if (phase === "go") {
      const ms = Math.round(performance.now() - goAtRef.current);
      setLastMs(ms);
      setTimes((prev) => {
        const next = [...prev, ms];
        setPhase(next.length >= trials ? "done" : "result");
        return next;
      });
    }
  }, [phase, beginWait, clearPending, trials]);

  const best = times.length ? Math.min(...times) : null;
  const average = times.length
    ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    : null;

  return {
    phase,
    trial: Math.min(times.length + 1, trials),
    trials,
    times,
    lastMs,
    best,
    average,
    press,
    restart,
  };
}
