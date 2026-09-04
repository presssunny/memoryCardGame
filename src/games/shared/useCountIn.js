import { useCallback, useEffect, useState } from "react";

// A short "3 · 2 · 1" pre-play countdown, so a timed game doesn't start its
// clock — or set its ball moving — before the player has looked at the
// screen. Matches the count-in Snake and Pong already run.
//
//   counting  — true while the countdown is still running
//   count     — the number to show (3 → 2 → 1), 0 once done
//   reset()   — start the countdown over (call from the game's restart)
export function useCountIn(from = 3, intervalMs = 650) {
  const [count, setCount] = useState(from);
  const counting = count > 0;

  useEffect(() => {
    if (count <= 0) return undefined;
    const id = setTimeout(() => setCount((c) => c - 1), intervalMs);
    return () => clearTimeout(id);
  }, [count, intervalMs]);

  const reset = useCallback(() => setCount(from), [from]);

  return { counting, count, reset };
}
