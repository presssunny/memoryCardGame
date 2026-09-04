import { useCallback, useEffect, useRef, useState } from "react";
import { shuffle } from "../../utils/random";

// Schulte table: find 1..N in order as fast as possible. The clock starts on
// the first correct tap and stops on the last. Wrong taps are counted but
// don't stop the clock.
export function useSchulteTable({ size = 5, rng = Math.random } = {}) {
  const total = size * size;
  const [cells, setCells] = useState(() =>
    shuffle(Array.from({ length: total }, (_, i) => i + 1), rng),
  );
  const [next, setNext] = useState(1);
  const [misses, setMisses] = useState(0);
  const [status, setStatus] = useState("ready"); // ready | playing | done
  const [elapsed, setElapsed] = useState(0);

  const startRef = useRef(0);
  const intervalRef = useRef(null);

  const stopTick = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);
  useEffect(() => stopTick, [stopTick]);

  const restart = useCallback(() => {
    stopTick();
    setCells(shuffle(Array.from({ length: total }, (_, i) => i + 1), rng));
    setNext(1);
    setMisses(0);
    setElapsed(0);
    setStatus("ready");
  }, [stopTick, total, rng]);

  const tap = useCallback(
    (value) => {
      if (status === "done") return;

      if (value !== next) {
        setMisses((m) => m + 1);
        return;
      }

      if (status === "ready") {
        startRef.current = performance.now();
        setStatus("playing");
        stopTick();
        intervalRef.current = setInterval(() => {
          setElapsed(performance.now() - startRef.current);
        }, 100);
      }

      if (value === total) {
        stopTick();
        setElapsed(performance.now() - startRef.current);
        setStatus("done");
      }
      setNext(value + 1);
    },
    [status, next, total, stopTick],
  );

  return {
    cells,
    size,
    total,
    next,
    misses,
    status,
    elapsedMs: Math.round(elapsed),
    tap,
    restart,
  };
}
