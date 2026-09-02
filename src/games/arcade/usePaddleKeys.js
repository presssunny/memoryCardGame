import { useEffect, useRef } from "react";

// Hold-to-move keyboard control for the paddle games (Pong: vertical,
// Breakout: horizontal). While a key is held the paddle moves every tick
// instead of one coarse step per keydown / OS repeat, so it tracks the ball
// smoothly. Case-insensitive (Caps Lock is fine) and it calls
// preventDefault so the arrow keys never scroll the page.
//
//   axis   "x" (Left/Right + A/D)  |  "y" (Up/Down + W/S)
//   speed  pixels per tick in the game's own coordinate space
//   onMove (delta) => void — negative is up/left, positive is down/right
export function usePaddleKeys(onMove, { axis = "x", speed = 7, tickMs = 16 } = {}) {
  const onMoveRef = useRef(onMove);
  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  useEffect(() => {
    const held = new Set();
    const NEG = axis === "y" ? ["arrowup", "w"] : ["arrowleft", "a"];
    const POS = axis === "y" ? ["arrowdown", "s"] : ["arrowright", "d"];
    const ALL = new Set([...NEG, ...POS]);

    const norm = (e) => (e.key || "").toLowerCase();
    const onDown = (e) => {
      const k = norm(e);
      if (!ALL.has(k)) return;
      e.preventDefault();
      held.add(k);
    };
    const onUp = (e) => {
      const k = norm(e);
      if (ALL.has(k)) held.delete(k);
    };
    const clear = () => held.clear();

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", clear);

    const timer = setInterval(() => {
      let dir = 0;
      for (const k of held) dir += NEG.includes(k) ? -1 : 1;
      if (dir !== 0) onMoveRef.current(Math.sign(dir) * speed);
    }, tickMs);

    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", clear);
      clearInterval(timer);
      held.clear();
    };
  }, [axis, speed, tickMs]);
}
