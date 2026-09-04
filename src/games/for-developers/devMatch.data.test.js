import { describe, it, expect } from "vitest";
import { buildConceptPairs, GIT_COMMANDS, HTTP_STATUS } from "./devMatch.data";

function seededRng(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe("buildConceptPairs", () => {
  it("builds 2*count cards, each value shared by exactly two cards (key + meaning)", () => {
    const count = 6;
    const cards = buildConceptPairs(GIT_COMMANDS, count, seededRng(1));
    expect(cards).toHaveLength(count * 2);

    const byValue = new Map();
    cards.forEach((c) => byValue.set(c.value, (byValue.get(c.value) ?? 0) + 1));
    expect(byValue.size).toBe(count);
    expect([...byValue.values()].every((n) => n === 2)).toBe(true);
  });

  it("each pair's two cards are the key and its meaning, with faceLabel matching face", () => {
    const cards = buildConceptPairs(GIT_COMMANDS, 4, seededRng(2));
    const known = new Set(GIT_COMMANDS.flat());
    cards.forEach((c) => {
      expect(c.face).toBe(c.faceLabel);
      expect(known.has(c.face)).toBe(true);
    });

    const byValue = new Map();
    cards.forEach((c) => {
      const arr = byValue.get(c.value) ?? [];
      arr.push(c.face);
      byValue.set(c.value, arr);
    });
    for (const faces of byValue.values()) {
      const match = GIT_COMMANDS.find(
        ([key, meaning]) =>
          (faces[0] === key && faces[1] === meaning) ||
          (faces[0] === meaning && faces[1] === key),
      );
      expect(match).toBeTruthy();
    }
  });

  it("picks distinct concepts — no concept used twice across pairs", () => {
    const cards = buildConceptPairs(HTTP_STATUS, HTTP_STATUS.length, seededRng(3));
    const values = new Set(cards.map((c) => c.value));
    expect(values.size).toBe(HTTP_STATUS.length);
  });

  it("is deterministic for a given rng", () => {
    const a = buildConceptPairs(GIT_COMMANDS, 5, seededRng(9));
    const b = buildConceptPairs(GIT_COMMANDS, 5, seededRng(9));
    expect(a).toEqual(b);
  });
});
