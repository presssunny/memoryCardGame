import { useCallback, useEffect, useRef, useState } from "react";

const HOLES = 9;
const GAME_MS = 30000;
const TICK_MS = 200;

// Whack-a-Mole. A single interval drives everything: it ages out moles
// (a miss), sometimes spawns a new one, and counts the clock down. Spawns
// get more frequent and moles disappear faster as the round goes on.
// `streak` is consecutive hits; it breaks on a missed mole or a whiff.
//
//   status: "ready" | "playing" | "over"
export function useWhackAMole({ rng = Math.random } = {}) {
  const [moles, setMoles] = useState([]); // [{ hole, ttl }]
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lastEvent, setLastEvent] = useState(null); // { hole, kind, n }
  const [remainingMs, setRemainingMs] = useState(GAME_MS);
  const [status, setStatus] = useState("ready");

  const intervalRef = useRef(null);
  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);
  useEffect(() => stop, [stop]);

  const resetTo = useCallback(
    (next) => {
      stop();
      setMoles([]);
      setHits(0);
      setMisses(0);
      setStreak(0);
      setBestStreak(0);
      setLastEvent(null);
      setRemainingMs(GAME_MS);
      setStatus(next);
    },
    [stop],
  );

  const restart = useCallback(() => resetTo("ready"), [resetTo]);

  const start = useCallback(() => {
    resetTo("playing");
    let elapsed = 0; // seconds, tracked locally in the closure
    intervalRef.current = setInterval(() => {
      elapsed += TICK_MS / 1000;

      setRemainingMs((ms) => {
        const left = ms - TICK_MS;
        if (left <= 0) {
          stop();
          setMoles([]);
          setStatus("over");
          return 0;
        }
        return left;
      });

      setMoles((prev) => {
        let missed = 0;
        const alive = prev
          .map((m) => ({ ...m, ttl: m.ttl - 1 }))
          .filter((m) => {
            if (m.ttl > 0) return true;
            missed += 1;
            return false;
          });
        if (missed) {
          setMisses((x) => x + missed);
          setStreak(0);
        }

        // Difficulty ramp over the 30s round: the first 8s are gentle (at
        // most two moles, slow spawns, longer to react), then it speeds up
        // and allows a third mole so the last third is genuinely busy
        // without being chaos.
        const maxMoles = elapsed < 8 ? 2 : 3;
        const spawnChance = Math.min(0.2 + elapsed * 0.011, 0.55);
        if (alive.length < maxMoles && rng() < spawnChance) {
          const taken = new Set(alive.map((m) => m.hole));
          const free = [];
          for (let i = 0; i < HOLES; i++) if (!taken.has(i)) free.push(i);
          if (free.length) {
            const life = Math.max(7 - Math.floor(elapsed / 6), 3);
            alive.push({ hole: free[Math.floor(rng() * free.length)], ttl: life });
          }
        }
        return alive;
      });
    }, TICK_MS);
  }, [resetTo, stop, rng]);

  const whack = useCallback(
    (hole) => {
      if (status === "ready") {
        start();
        return;
      }
      if (status !== "playing") return;
      setMoles((prev) => {
        const isHit = prev.some((m) => m.hole === hole);
        if (isHit) {
          setHits((h) => h + 1);
          setStreak((s) => {
            const n = s + 1;
            setBestStreak((b) => Math.max(b, n));
            return n;
          });
          setLastEvent({ hole, kind: "hit", n: Date.now() });
          return prev.filter((m) => m.hole !== hole);
        }
        setStreak(0);
        setLastEvent({ hole, kind: "whiff", n: Date.now() });
        return prev;
      });
    },
    [status, start],
  );

  const total = hits + misses;
  return {
    holes: HOLES,
    upHoles: new Set(moles.map((m) => m.hole)),
    hits,
    misses,
    streak,
    bestStreak,
    lastEvent,
    accuracy: total ? Math.round((hits / total) * 100) : 0,
    secondsLeft: Math.ceil(remainingMs / 1000),
    status,
    whack,
    start,
    restart,
  };
}
