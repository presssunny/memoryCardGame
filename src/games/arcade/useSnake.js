import { useCallback, useEffect, useRef, useState } from "react";
import { newSnake, setDir, speedFor, step, levelFor, speedTierFor } from "./snake";

// React wrapper around the pure Snake logic. Adds the shell a real arcade
// game needs on top of grid movement:
//   - a phase machine: countdown → running ⇆ paused, plus a derived "over"
//   - a 3·2·1 countdown before the snake starts moving
//   - Space to pause/resume, Enter to restart from game-over
//   - keyboard (arrows / WASD) and an injectable turn() for swipe/D-pad
//   - derived level + speed tier for the HUD
export function useSnake({ rng = Math.random } = {}) {
  const [state, setState] = useState(() => newSnake(rng));
  const [phase, setPhase] = useState("countdown"); // countdown | running | paused
  const [count, setCount] = useState(3);

  // "over" is derived from the pure state, never stored — no effect needed.
  const status = state.dead ? "over" : phase;
  const running = !state.dead && phase === "running";
  const delay = Math.round(1000 / speedFor(state.score));

  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Countdown: tick down on a timer, flip to running after "1".
  useEffect(() => {
    if (phase !== "countdown") return undefined;
    const id = setTimeout(() => {
      if (count <= 1) setPhase("running");
      else setCount((c) => c - 1);
    }, 700);
    return () => clearTimeout(id);
  }, [phase, count]);

  // Movement loop — a fresh interval whenever the speed tier changes.
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setState((s) => step(s, rng)), delay);
    return () => clearInterval(id);
  }, [running, delay, rng]);

  const turn = useCallback((name) => {
    setPhase((p) => (p === "paused" ? "running" : p)); // a turn resumes
    setState((s) => setDir(s, name));
  }, []);

  const restart = useCallback(() => {
    setState(newSnake(rng));
    setCount(3);
    setPhase("countdown");
  }, [rng]);

  const togglePause = useCallback(() => {
    setPhase((p) => {
      if (p === "running") return "paused";
      if (p === "paused") return "running";
      return p;
    });
  }, []);

  useEffect(() => {
    const dirKeys = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      s: "down",
      a: "left",
      d: "right",
      W: "up",
      S: "down",
      A: "left",
      D: "right",
    };
    const onKey = (e) => {
      // Don't hijack keys meant for a focused control (the header's Back /
      // Restart buttons) — Space/Enter there must activate the button.
      if (e.target?.closest?.("button, a, input, select, textarea")) return;
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        togglePause();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (statusRef.current === "over") restart();
        return;
      }
      const name = dirKeys[e.key];
      if (!name) return;
      e.preventDefault();
      turn(name);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turn, togglePause, restart]);

  return {
    ...state,
    status, // "countdown" | "running" | "paused" | "over"
    count,
    level: levelFor(state.score),
    speedTier: speedTierFor(state.score),
    turn,
    restart,
    togglePause,
  };
}
