import { useCallback, useMemo, useState } from "react";
import { pickSnippet } from "./typingTest.data";

// Typing test over one code snippet. Tracks the typed string, the first
// keystroke time, and produces WPM + accuracy on completion.
//
//   phase: "idle" | "typing" | "done"
export function useTypingTest({ rng = Math.random } = {}) {
  const [target, setTarget] = useState(() => pickSnippet(rng));
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [result, setResult] = useState(null);

  const restart = useCallback(() => {
    setTarget(pickSnippet(rng));
    setTyped("");
    setStartedAt(null);
    setPhase("idle");
    setResult(null);
  }, [rng]);

  const setValue = useCallback(
    (value) => {
      if (phase === "done") return;
      const next = value.slice(0, target.length);
      const started = startedAt ?? (next.length > 0 ? performance.now() : null);
      if (started !== startedAt) setStartedAt(started);
      setTyped(next);
      if (next.length > 0 && phase === "idle") setPhase("typing");

      if (next.length === target.length && started != null) {
        const minutes = Math.max((performance.now() - started) / 60000, 1 / 600);
        let correct = 0;
        for (let i = 0; i < target.length; i++) {
          if (next[i] === target[i]) correct += 1;
        }
        const accuracy = Math.round((correct / target.length) * 100);
        const wpm = Math.max(Math.round(target.length / 5 / minutes), 0);
        setResult({ wpm, accuracy, correct, total: target.length });
        setPhase("done");
      }
    },
    [phase, target, startedAt],
  );

  // Per-character status for the display.
  const chars = useMemo(
    () =>
      target.split("").map((ch, i) => {
        let state = "";
        if (i < typed.length) state = typed[i] === ch ? "ok" : "bad";
        else if (i === typed.length && phase !== "done") state = "cur";
        return { ch, state };
      }),
    [target, typed, phase],
  );

  const errors = chars.filter((c) => c.state === "bad").length;

  return { target, typed, chars, errors, phase, result, setValue, restart };
}
