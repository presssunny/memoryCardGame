import { describe, it, expect } from "vitest";
import { makeOddOneOutQuestion, GROUPS } from "./oddOneOut.data";

// A cycling deterministic rng so the tests don't depend on Math.random.
function seededRng(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe("makeOddOneOutQuestion", () => {
  it("returns 4 options with exactly one correct", () => {
    for (let round = 1; round <= 20; round++) {
      const q = makeOddOneOutQuestion(round, seededRng(round));
      expect(q.options).toHaveLength(4);
      expect(q.options.filter((o) => o.correct)).toHaveLength(1);
      expect(q.options.every((o) => typeof o.emoji === "string")).toBe(true);
    }
  });

  it("the odd option comes from a different group than the other three", () => {
    for (let round = 1; round <= 20; round++) {
      const q = makeOddOneOutQuestion(round, seededRng(round * 7));
      const main = GROUPS.find((g) => g.id === q.groupId);
      const odd = q.options.find((o) => o.correct);
      const others = q.options.filter((o) => !o.correct);
      expect(q.oddGroupId).not.toBe(q.groupId);
      expect(others.every((o) => main.items.includes(o.emoji))).toBe(true);
      expect(main.items.includes(odd.emoji)).toBe(false);
    }
  });

  it("option ids are unique", () => {
    const q = makeOddOneOutQuestion(1, seededRng(3));
    const ids = q.options.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
