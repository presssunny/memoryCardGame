import { describe, it, expect } from "vitest";
import { makeMathSprintQuestion } from "./mathSprint.data";

function seededRng(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const answerFor = (p) => {
  if (p.op === "+") return p.a + p.b;
  if (p.op === "−") return p.a - p.b;
  return p.a * p.b;
};

describe("makeMathSprintQuestion", () => {
  it("has exactly one correct option, matching the real answer, with unique ids", () => {
    for (let round = 1; round <= 20; round++) {
      const q = makeMathSprintQuestion(round, seededRng(round));
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
      expect(Number(correct[0].label)).toBe(answerFor(q.prompt));
      expect(new Set(q.options.map((o) => o.id)).size).toBe(q.options.length);
      expect(q.options).toHaveLength(4);
    }
  });

  it("never produces a negative subtraction or an option below zero", () => {
    for (let round = 3; round <= 20; round++) {
      const q = makeMathSprintQuestion(round, seededRng(round * 3));
      if (q.prompt.op === "−") {
        expect(q.prompt.a - q.prompt.b).toBeGreaterThanOrEqual(0);
      }
      q.options.forEach((o) => expect(Number(o.label)).toBeGreaterThanOrEqual(0));
    }
  });

  it("only offers + before round 3, adds − from round 3, and × from round 8", () => {
    for (let round = 1; round < 3; round++) {
      expect(makeMathSprintQuestion(round, seededRng(round)).prompt.op).toBe("+");
    }
    // Sequential small seeds can correlate on an LCG's very first draw (the
    // op pick is the first rng() call) — space them out with a large prime
    // step so the sample actually covers the [0,1) range.
    const spread = (i) => seededRng(i * 104729 + 1);

    const opsSeen = new Set();
    for (let i = 1; i <= 60; i++) {
      opsSeen.add(makeMathSprintQuestion(5, spread(i)).prompt.op);
    }
    expect(opsSeen.has("×")).toBe(false); // round 5: + or − only
    const opsAtTen = new Set();
    for (let i = 1; i <= 60; i++) {
      opsAtTen.add(makeMathSprintQuestion(10, spread(i)).prompt.op);
    }
    expect(opsAtTen.has("×")).toBe(true); // round 10: × becomes possible
  });
});
