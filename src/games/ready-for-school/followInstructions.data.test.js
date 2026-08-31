import { describe, it, expect } from "vitest";
import { makeFollowRound, TARGETS } from "./followInstructions.data";

function seededRng(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe("makeFollowRound", () => {
  it("board holds every target exactly once", () => {
    const { board } = makeFollowRound(1, seededRng(1));
    expect(board).toHaveLength(TARGETS.length);
    expect(new Set(board.map((t) => t.id)).size).toBe(TARGETS.length);
  });

  it("step count grows 1 → 2 → 3 and never exceeds 3", () => {
    expect(makeFollowRound(1, seededRng(1)).steps).toHaveLength(1);
    expect(makeFollowRound(3, seededRng(1)).steps).toHaveLength(2);
    expect(makeFollowRound(5, seededRng(1)).steps).toHaveLength(3);
    expect(makeFollowRound(20, seededRng(1)).steps).toHaveLength(3);
  });

  it("steps are distinct board targets", () => {
    for (let r = 1; r <= 12; r++) {
      const { board, steps } = makeFollowRound(r, seededRng(r * 4));
      expect(new Set(steps).size).toBe(steps.length);
      expect(steps.every((id) => board.some((t) => t.id === id))).toBe(true);
    }
  });

  it("the instruction text mentions each step's label", () => {
    const { steps, text } = makeFollowRound(5, seededRng(9));
    for (const id of steps) {
      const label = TARGETS.find((t) => t.id === id).label;
      expect(text).toContain(label);
    }
  });
});
