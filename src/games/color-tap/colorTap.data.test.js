import { describe, it, expect } from "vitest";
import { makeColorTapQuestion, COLORS } from "./colorTap.data";

function seededRng(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe("makeColorTapQuestion", () => {
  it("always includes the target and marks exactly one option correct", () => {
    for (let round = 1; round <= 30; round++) {
      const q = makeColorTapQuestion(round, seededRng(round));
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
      expect(correct[0].hex).toBe(q.prompt.hex);
      expect(q.options.some((o) => o.hex === q.prompt.hex)).toBe(true);
    }
  });

  it("grows the option count from 3 up to 5 as rounds progress", () => {
    expect(makeColorTapQuestion(1, seededRng(1)).options).toHaveLength(3);
    expect(makeColorTapQuestion(4, seededRng(1)).options).toHaveLength(4);
    expect(makeColorTapQuestion(7, seededRng(1)).options).toHaveLength(5);
    expect(makeColorTapQuestion(50, seededRng(1)).options.length).toBeLessThanOrEqual(5);
  });

  it("all options are real colours with unique ids", () => {
    const q = makeColorTapQuestion(9, seededRng(5));
    const known = new Set(COLORS.map((c) => c.id));
    expect(q.options.every((o) => known.has(o.id))).toBe(true);
    expect(new Set(q.options.map((o) => o.id)).size).toBe(q.options.length);
  });
});
