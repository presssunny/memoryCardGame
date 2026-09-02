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

  it("every 'which doesn't belong' set is 4 real assets with its odd one + review copy", () => {
    for (const { items, odd, group, why } of ODD_SETS) {
      expect(items).toHaveLength(4);
      expect(items).toContain(odd);
      expect(items.every((id) => ASSET_IDS.has(id))).toBe(true);
      expect(typeof group).toBe("string");
      expect(group.length).toBeGreaterThan(0);
      expect(typeof why).toBe("string");
      expect(why.length).toBeGreaterThan(0);
    }
  });
});
