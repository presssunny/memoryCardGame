import { useCallback, useEffect, useRef, useState } from "react";

const START_LEN = 3;
const SHOW_MS = 800;
const GAP_MS = 250;

function randomDigits(n, rng) {
  return Array.from({ length: n }, () => Math.floor(rng() * 10));
}

// Digit Span: a row of digits flashes one at a time, then you type it back.
// Each success adds a digit. `reverse` asks for it backwards.
//
//   phase: "showing" | "input" | "lost"
export function useDigitSpan({ reverse = false, rng = Math.random } = {}) {
  const [level, setLevel] = useState(START_LEN);
  const [sequence, setSequence] = useState(() => randomDigits(START_LEN, rng));
  const [shownIndex, setShownIndex] = useState(0); // -1 = gap, k = showing digit k
  const [phase, setPhase] = useState("showing");
  const [typed, setTyped] = useState([]);

  const timeoutRef = useRef(null);
  const clearPending = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);
  useEffect(() => clearPending, [clearPending]);

  // Playback driver.
  useEffect(() => {
    if (phase !== "showing") return undefined;
    if (shownIndex >= sequence.length) {
      const id = setTimeout(() => {
        setTyped([]);
        setPhase("input");
      }, GAP_MS);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setShownIndex((i) => i + 1), SHOW_MS + GAP_MS);
    return () => clearTimeout(id);
  }, [phase, shownIndex, sequence.length]);

  const expected = reverse ? [...sequence].reverse() : sequence;

  const restart = useCallback(() => {
    clearPending();
    setLevel(START_LEN);
    setSequence(randomDigits(START_LEN, rng));
    setShownIndex(0);
    setTyped([]);
    setPhase("showing");
  }, [clearPending, rng]);

  const pressDigit = useCallback(
    (digit) => {
      if (phase !== "input") return;
      const idx = typed.length;
      if (digit !== expected[idx]) {
        setPhase("lost");
        return;
      }
      const next = [...typed, digit];
      setTyped(next);
      if (next.length === sequence.length) {
        const nextLevel = level + 1;
        setLevel(nextLevel);
        setSequence(randomDigits(nextLevel, rng));
        setShownIndex(0);
        setPhase("showing");
      }
    },
    [phase, typed, expected, sequence.length, level, rng],
  );

  return {
    level,
    startLevel: START_LEN,
    sequence,
    shownIndex,
    phase,
    typed,
    reverse,
    // Rounds cleared so far (level only advances on a full correct answer).
    roundsCompleted: level - START_LEN,
    // The longest digit string the player repeated correctly (0 if none).
    longestSpan: level > START_LEN ? level - 1 : 0,
    pressDigit,
    restart,
  };
}
