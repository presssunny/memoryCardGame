import { describe, it, expect } from "vitest";
import {
  GIT_COMMANDS,
  HTTP_STATUS,
  buildConceptPairs,
} from "./devMatch.data";
import { makeHexQuestion } from "./hexColor.data";
import { makeBugHuntQuestion, SNIPPETS } from "./bugHunt.data";

function seededRng(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe("buildConceptPairs", () => {
  it("makes 2 cards per concept, sharing a value, with different faces", () => {
    const pairs = buildConceptPairs(GIT_COMMANDS, 5, seededRng(1));
    expect(pairs).toHaveLength(10);
    const byValue = {};
    for (const c of pairs) (byValue[c.value] ??= []).push(c);
    expect(Object.keys(byValue)).toHaveLength(5);
    for (const group of Object.values(byValue)) {
      expect(group).toHaveLength(2);
      expect(group[0].face).not.toBe(group[1].face);
    }
  });

  it("uses real entries from the source table", () => {
    const pairs = buildConceptPairs(HTTP_STATUS, 4, seededRng(2));
    const faces = pairs.map((c) => c.face);
    const flat = HTTP_STATUS.flat();
    expect(faces.every((f) => flat.includes(f))).toBe(true);
  });
});

describe("makeHexQuestion", () => {
  it("the correct option's hex equals the prompt colour", () => {
    for (let r = 1; r <= 20; r++) {
      const q = makeHexQuestion(r, seededRng(r));
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
      expect(correct[0].hex).toBe(q.prompt.hex);
      expect(q.prompt.hex).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  it("all option hexes are unique and valid", () => {
    const q = makeHexQuestion(6, seededRng(9));
    const hexes = q.options.map((o) => o.hex);
    expect(new Set(hexes).size).toBe(hexes.length);
    expect(hexes.every((h) => /^#[0-9A-F]{6}$/.test(h))).toBe(true);
  });
});

describe("makeBugHuntQuestion", () => {
  it("has one option per line and marks the real bug line correct", () => {
    for (let r = 1; r <= 20; r++) {
      const q = makeBugHuntQuestion(r, seededRng(r * 5));
      expect(q.options).toHaveLength(q.prompt.lines.length);
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
      expect(correct[0].id).toBe(`l${q.prompt.bugLine}`);
    }
  });

  it("every snippet in the bank has a bug line within range and a hint", () => {
    for (const s of SNIPPETS) {
      expect(s.bugLine).toBeGreaterThanOrEqual(1);
      expect(s.bugLine).toBeLessThanOrEqual(s.lines.length);
      expect(typeof s.hint).toBe("string");
      expect(s.hint.length).toBeGreaterThan(0);
    }
  });
});
