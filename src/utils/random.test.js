import { describe, it, expect } from "vitest";
import { shuffle, sample } from "./random";

function seededRng(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe("shuffle", () => {
  it("returns a permutation — same elements, same length, in some order", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const out = shuffle(input, seededRng(1));
    expect(out).toHaveLength(input.length);
    expect([...out].sort()).toEqual([...input].sort());
  });

  it("does not mutate the input array", () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    shuffle(input, seededRng(2));
    expect(input).toEqual(copy);
  });

  it("is deterministic for a given rng — same seed, same order", () => {
    const input = ["a", "b", "c", "d", "e", "f"];
    expect(shuffle(input, seededRng(42))).toEqual(shuffle(input, seededRng(42)));
  });

  it("actually reorders across a run of seeds (not an accidental no-op)", () => {
    const input = Array.from({ length: 10 }, (_, i) => i);
    const orders = new Set(
      Array.from({ length: 8 }, (_, seed) => shuffle(input, seededRng(seed + 1)).join(",")),
    );
    expect(orders.size).toBeGreaterThan(1);
  });

  it("defaults to Math.random when no rng is given", () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input);
    expect([...out].sort()).toEqual(input);
  });
});

describe("sample", () => {
  it("returns exactly n items, all drawn from the source array", () => {
    const input = ["a", "b", "c", "d", "e", "f", "g"];
    const out = sample(input, 3, seededRng(7));
    expect(out).toHaveLength(3);
    expect(out.every((x) => input.includes(x))).toBe(true);
  });

  it("never repeats an item drawn from a duplicate-free source", () => {
    const input = Array.from({ length: 12 }, (_, i) => i);
    const out = sample(input, 5, seededRng(3));
    expect(new Set(out).size).toBe(5);
  });

  it("is deterministic for a given rng", () => {
    const input = ["x", "y", "z", "w", "v"];
    expect(sample(input, 3, seededRng(9))).toEqual(sample(input, 3, seededRng(9)));
  });

  it("returns the whole (shuffled) array when n equals its length", () => {
    const input = [1, 2, 3, 4];
    const out = sample(input, 4, seededRng(5));
    expect([...out].sort()).toEqual(input);
  });
});
