import { describe, it, expect } from "vitest";
import { pickAnimalPairs, ANIMALS, PAIR_COUNT } from "./animalMatch.data";

function seededRng(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe("pickAnimalPairs", () => {
  it("returns 2 * PAIR_COUNT cards", () => {
    expect(pickAnimalPairs(PAIR_COUNT, seededRng(1))).toHaveLength(PAIR_COUNT * 2);
  });

  it("every animal appears exactly twice and they are distinct", () => {
    const cards = pickAnimalPairs(PAIR_COUNT, seededRng(2));
    const counts = {};
    for (const c of cards) counts[c] = (counts[c] || 0) + 1;
    const kinds = Object.keys(counts);
    expect(kinds).toHaveLength(PAIR_COUNT);
    expect(Object.values(counts).every((n) => n === 2)).toBe(true);
    expect(kinds.every((k) => ANIMALS.includes(k))).toBe(true);
  });

  it("respects a custom pair count", () => {
    expect(pickAnimalPairs(3, seededRng(9))).toHaveLength(6);
  });
});
