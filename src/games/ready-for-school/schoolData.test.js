import { describe, it, expect } from "vitest";
import {
  HEBREW_LETTERS,
  LETTER_WORDS,
  LOOKALIKES,
  SHAPES,
  ODD_SETS,
  COUNT_ITEMS,
} from "./schoolData";
import { KID_ASSETS } from "../../assets/kids/manifest";

const isHebrew = (s) => /^[א-ת]+$/.test(s);
const ASSET_IDS = new Set(KID_ASSETS.map((a) => a.id));

describe("Ready for School content integrity", () => {
  it("has the 22 base Hebrew letters, no duplicates", () => {
    expect(HEBREW_LETTERS).toHaveLength(22);
    expect(new Set(HEBREW_LETTERS).size).toBe(22);
    expect(HEBREW_LETTERS.every(isHebrew)).toBe(true);
  });

  it("every letter-word actually starts with its letter", () => {
    for (const { letter, word } of LETTER_WORDS) {
      expect(HEBREW_LETTERS).toContain(letter);
      expect(word[0]).toBe(letter);
      expect(isHebrew(word)).toBe(true);
    }
  });

  it("every letter-word points at a real asset in the kids library", () => {
    for (const { pic } of LETTER_WORDS) {
      expect(typeof pic).toBe("string");
      expect(ASSET_IDS.has(pic)).toBe(true);
    }
  });

  it("every countable item is a real asset id", () => {
    for (const id of COUNT_ITEMS) {
      expect(ASSET_IDS.has(id)).toBe(true);
    }
  });

  it("every shape has a real asset id", () => {
    for (const { pic } of SHAPES) {
      expect(ASSET_IDS.has(pic)).toBe(true);
    }
  });

  it("lookalike pairs are two distinct single letters", () => {
    for (const pair of LOOKALIKES) {
      expect(pair).toHaveLength(2);
      expect(pair[0]).not.toBe(pair[1]);
    }
  });

  it("shape names are Hebrew words", () => {
    for (const { name } of SHAPES) {
      expect(isHebrew(name)).toBe(true);
    }
  });

  it("every 'which doesn't belong' set is 4 real assets with its odd one + review copy + a tier", () => {
    for (const { items, odd, group, why, tier } of ODD_SETS) {
      expect(items).toHaveLength(4);
      expect(new Set(items).size).toBe(4); // no duplicate item in a set
      expect(items).toContain(odd);
      expect(items.every((id) => ASSET_IDS.has(id))).toBe(true);
      // Hebrew review copy (allow spaces between words)
      expect(group).toMatch(/^[א-ת ׳״]+$/);
      expect(why).toMatch(/^[א-ת ׳״,]+$/);
      expect([1, 2, 3]).toContain(tier);
    }
  });

  it("each tier has enough sets to cover its rounds without a repeat", () => {
    const byTier = (t) => ODD_SETS.filter((s) => s.tier === t).length;
    expect(byTier(1)).toBeGreaterThanOrEqual(3); // rounds 1–3
    expect(byTier(2)).toBeGreaterThanOrEqual(4); // rounds 4–7
    expect(byTier(3)).toBeGreaterThanOrEqual(3); // rounds 8–10
  });

  it("no single odd-one category dominates (no 'always tap the food' shortcut)", () => {
    // classify each odd item by a coarse bucket
    const BUCKET = {
      food: new Set(["pizza", "burger", "cake", "donut", "cookie", "hot-dog", "fries"]),
      fruitveg: new Set(["apple", "banana", "orange", "grapes", "broccoli", "carrot", "strawberry"]),
      vehicle: new Set(["car", "bus", "bicycle", "airplane", "tractor", "rocket", "train"]),
      animal: new Set(["dog", "cat", "fish", "bird", "frog", "lion", "penguin", "turtle", "elephant"]),
      plant: new Set(["tree", "rose", "tulip", "cactus"]),
      instrument: new Set(["guitar", "piano", "drum"]),
    };
    const bucketOf = (id) =>
      Object.keys(BUCKET).find((k) => BUCKET[k].has(id)) ?? "other";
    const counts = {};
    for (const { odd } of ODD_SETS) {
      const b = bucketOf(odd);
      counts[b] = (counts[b] ?? 0) + 1;
    }
    const max = Math.max(...Object.values(counts));
    expect(max / ODD_SETS.length).toBeLessThanOrEqual(0.4);
  });
});
