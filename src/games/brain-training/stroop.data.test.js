import { describe, it, expect } from "vitest";
import { makeStroopQuestion, STROOP_COLORS } from "./stroop.data";

function seededRng(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe("makeStroopQuestion", () => {
  it("has exactly one correct option, naming the real ink colour", () => {
    for (let round = 1; round <= 20; round++) {
      const q = makeStroopQuestion(round, seededRng(round));
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
      expect(correct[0].name).toBe(q.prompt.inkName);
      const known = new Set(STROOP_COLORS.map((c) => c.id));
      expect(q.options.every((o) => known.has(o.id))).toBe(true);
      expect(new Set(q.options.map((o) => o.id)).size).toBe(q.options.length);
    }
  });

  it("offers 3 options before round 4, 4 from round 4 on", () => {
    expect(makeStroopQuestion(1, seededRng(1)).options).toHaveLength(3);
    expect(makeStroopQuestion(3, seededRng(1)).options).toHaveLength(3);
    expect(makeStroopQuestion(4, seededRng(1)).options).toHaveLength(4);
    expect(makeStroopQuestion(10, seededRng(1)).options).toHaveLength(4);
  });

  it("prints the word and the ink in different colours most of the time, but not always", () => {
    let congruent = 0;
    let incongruent = 0;
    for (let seed = 1; seed <= 60; seed++) {
      const q = makeStroopQuestion(5, seededRng(seed));
      if (q.prompt.word === q.prompt.inkName) congruent += 1;
      else incongruent += 1;
    }
    // ~15% congruent by design — over 60 seeds, expect to see both, with
    // incongruent clearly the common case.
    expect(incongruent).toBeGreaterThan(congruent);
    expect(congruent).toBeGreaterThan(0);
  });
});
