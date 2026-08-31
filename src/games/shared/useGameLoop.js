import { useEffect, useRef } from "react";

// A fixed-timestep loop for the real-time arcade games. Calls `onTick(dt)`
// roughly every `1000/fps` ms while `running` is true, using
// requestAnimationFrame so it pauses with the tab. The callback is kept in a
// ref (updated in an effect) so changing it doesn't restart the loop.
export function useGameLoop(onTick, { running = true, fps = 60 } = {}) {
  const tickRef = useRef(onTick);
  useEffect(() => {
    tickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!running) return undefined;
    const step = 1000 / fps;
    let raf = 0;
    let last = performance.now();
    let acc = 0;

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      acc += now - last;
      last = now;
      acc = Math.min(acc, step * 5); // cap catch-up after a pause
      while (acc >= step) {
        acc -= step;
        tickRef.current(step);
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [running, fps]);
}
