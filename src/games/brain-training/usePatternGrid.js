import { useCallback, useEffect, useRef, useState } from "react";

const SIZE = 4; // 4x4
const START_LIT = 3;
const SHOW_MS = 1500;

function pickLit(count, cellCount, rng) {
  const all = Array.from({ length: cellCount }, (_, i) => i);
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return new Set(all.slice(0, count));
}

// Pattern Grid: some cells light up briefly, then you tap them from memory.
// Each cleared round lights one more cell.
//
//   phase: "showing" | "input" | "lost"
export function usePatternGrid({ size = SIZE, rng = Math.random } = {}) {
  const cellCount = size * size;
  const [round, setRound] = useState(1);
  const [lit, setLit] = useState(() => pickLit(START_LIT, cellCount, rng));
  const [picked, setPicked] = useState(() => new Set());
  const [phase, setPhase] = useState("showing");

  const timeoutRef = useRef(null);
  const clearPending = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);
  useEffect(() => clearPending, [clearPending]);

  useEffect(() => {
    if (phase !== "showing") return undefined;
    const id = setTimeout(() => {
      setPicked(new Set());
      setPhase("input");
    }, SHOW_MS);
    return () => clearTimeout(id);
  }, [phase, round]);

  const litCount = START_LIT + (round - 1);

  const restart = useCallback(() => {
    clearPending();
    setRound(1);
    setLit(pickLit(START_LIT, cellCount, rng));
    setPicked(new Set());
    setPhase("showing");
  }, [clearPending, cellCount, rng]);

  const tap = useCallback(
    (index) => {
      if (phase !== "input" || picked.has(index)) return;
      if (!lit.has(index)) {
        setPhase("lost");
        return;
      }
      const next = new Set(picked);
      next.add(index);
      setPicked(next);
      if (next.size === lit.size) {
        const nextRound = round + 1;
        setRound(nextRound);
        setLit(pickLit(START_LIT + (nextRound - 1), cellCount, rng));
        setPhase("showing");
      }
    },
    [phase, picked, lit, round, cellCount, rng],
  );

  return {
    size,
    cellCount,
    round,
    litCount,
    lit,
    picked,
    phase,
    roundsCompleted: round - 1,
    tap,
    restart,
  };
}
