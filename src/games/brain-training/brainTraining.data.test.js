import { describe, it, expect } from "vitest";
import { makeStroopQuestion, STROOP_COLORS } from "./stroop.data";
import { makeMathSprintQuestion } from "./mathSprint.data";

function seededRng(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const oneCorrect = (q) => q.options.filter((o) => o.correct).length === 1;

describe("makeStroopQuestion", () => {
  it("the answer is the ink colour and appears among the options", () => {
    for (let r = 1; r <= 20; r++) {
      const q = makeStroopQuestion(r, seededRng(r));
      expect(oneCorrect(q)).toBe(true);
      const correct = q.options.find((o) => o.correct);
      const inkColor = STROOP_COLORS.find((c) => c.hex === q.prompt.ink);
      expect(correct.id).toBe(inkColor.id);
    }
  });

  it("3 options early, 4 from round 4", () => {
    expect(makeStroopQuestion(1, seededRng(1)).options).toHaveLength(3);
    expect(makeStroopQuestion(6, seededRng(1)).options).toHaveLength(4);
  });
});

describe("makeMathSprintQuestion", () => {
  it("always has exactly one correct answer that matches the arithmetic", () => {
    for (let r = 1; r <= 30; r++) {
      const q = makeMathSprintQuestion(r, seededRng(r * 3));
      expect(oneCorrect(q)).toBe(true);
      const answer = Number(q.options.find((o) => o.correct).label);
      const { a, b, op } = q.prompt;
      const expected = op === "+" ? a + b : op === "−" ? a - b : a * b;
      expect(answer).toBe(expected);
      expect(answer).toBeGreaterThanOrEqual(0);
    }
  });

  it("introduces − at round 3 and × at round 8", () => {
    // One advancing rng shared across the sample so op selection actually varies.
    const rng = seededRng(42);
    const early = new Set();
    for (let i = 0; i < 80; i++) early.add(makeMathSprintQuestion(2, rng).prompt.op);
    expect([...early]).toEqual(["+"]);

    const later = new Set();
    for (let i = 0; i < 200; i++) later.add(makeMathSprintQuestion(10, rng).prompt.op);
    expect(later.has("×")).toBe(true);
    expect(later.has("−")).toBe(true);
  });
});
