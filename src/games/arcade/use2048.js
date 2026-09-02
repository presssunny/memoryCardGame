import { useCallback, useEffect, useState } from "react";
import { hasMoves, maxTile, move, newGame, spawnTile } from "./logic2048";

// React wrapper around the pure 2048 logic. Keyboard + a `swipe(dir)` for
// touch. Status: "playing" | "over".
export function use2048({ rng = Math.random } = {}) {
  const [grid, setGrid] = useState(() => newGame(rng));
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("playing");

  const restart = useCallback(() => {
    setGrid(newGame(rng));
    setScore(0);
    setStatus("playing");
  }, [rng]);

  const swipe = useCallback(
    (dir) => {
      if (status !== "playing") return;
      const result = move(grid, dir);
      if (!result.moved) return;
      const withTile = spawnTile(result.grid, rng);
      setGrid(withTile);
      setScore((s) => s + result.gained);
      if (!hasMoves(withTile)) setStatus("over");
    },
    [grid, status, rng],
  );

  useEffect(() => {
    const keys = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down",
      a: "left",
      d: "right",
      w: "up",
      s: "down",
    };
    const onKey = (e) => {
      const dir = keys[e.key] ?? keys[e.key?.toLowerCase()];
      if (!dir) return;
      e.preventDefault();
      swipe(dir);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [swipe]);

  return { grid, score, status, best: maxTile(grid), swipe, restart };
}
