import { useCallback, useEffect, useRef, useState } from "react";

// A one-per-second countdown timer shared by every timed game. Ticks only
// while `running` is true and there is time left; calls `onExpire` once, on
// the transition to zero. `reset()` puts it back to a chosen number of
// seconds (default: the original `seconds`).
//
// Driven by a single tracked setTimeout rather than setInterval so a reset
// or an unmount can't leave a stale tick queued (the same reason
// useMatchingBoard tracks its timeouts).
export function useCountdown(seconds, { running = true, onExpire } = {}) {
  const [secondsLeft, setSecondsLeft] = useState(seconds);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!running || secondsLeft <= 0) return undefined;
    const id = setTimeout(() => {
      setSecondsLeft((s) => Math.max(s - 1, 0));
    }, 1000);
    return () => clearTimeout(id);
  }, [running, secondsLeft]);

  // Fire onExpire exactly once per countdown, on the tick that reaches zero.
  // firedRef is only touched inside the effect, so an onExpire that changes
  // identity every render just re-runs this harmlessly.
  useEffect(() => {
    if (secondsLeft > 0) {
      firedRef.current = false;
      return;
    }
    if (firedRef.current) return;
    firedRef.current = true;
    onExpire?.();
  }, [secondsLeft, onExpire]);

  const reset = useCallback((to = seconds) => setSecondsLeft(to), [seconds]);

  return { secondsLeft, isExpired: secondsLeft <= 0, reset, setSecondsLeft };
}
