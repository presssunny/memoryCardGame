import { useCallback, useRef } from "react";

// Pointer-based swipe detection for the grid games (Snake, 2048). Returns
// props to spread onto the swipe surface; `onSwipe` fires once per gesture
// with "up" | "down" | "left" | "right" when the drag clears `threshold`
// pixels and is mostly axis-aligned.
export function useSwipe(onSwipe, { threshold = 24 } = {}) {
  const start = useRef(null);

  const onPointerDown = useCallback((e) => {
    start.current = { x: e.clientX, y: e.clientY };
  }, []);

  const finish = useCallback(
    (e) => {
      const s = start.current;
      start.current = null;
      if (!s) return;
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        onSwipe(dx > 0 ? "right" : "left");
      } else {
        onSwipe(dy > 0 ? "down" : "up");
      }
    },
    [onSwipe, threshold],
  );

  return {
    onPointerDown,
    onPointerUp: finish,
    onPointerCancel: () => {
      start.current = null;
    },
    style: { touchAction: "none" },
  };
}
