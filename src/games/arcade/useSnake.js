import { useCallback, useEffect, useState } from "react";
import { newSnake, setDir, speedFor, step } from "./snake";

// React wrapper. A setInterval ticks the pure step; its delay is derived
// from the score, so the effect re-runs (new interval) only when the speed
// tier actually changes. Arrow/WASD controls. Status: "playing" | "over".
export function useSnake({ rng = Math.random } = {}) {
  const [state, setState] = useState(() => newSnake(rng));

  const delay = Math.round(1000 / speedFor(state.score));
  const running = !state.dead;

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setState((s) => step(s, rng)), delay);
    return () => clearInterval(id);
  }, [running, delay, rng]);

  const turn = useCallback((name) => setState((s) => setDir(s, name)), []);
  const restart = useCallback(() => setState(newSnake(rng)), [rng]);

  useEffect(() => {
    const keys = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      s: "down",
      a: "left",
      d: "right",
    };
    const onKey = (e) => {
      const name = keys[e.key];
      if (!name) return;
      e.preventDefault();
      turn(name);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turn]);

  return { ...state, status: state.dead ? "over" : "playing", turn, restart };
}
