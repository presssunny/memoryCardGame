import { describe, it, expect } from "vitest";
import {
  HEBREW_LETTERS,
  LETTER_WORDS,
  LOOKALIKES,
  SHAPES,
  ODD_SETS,
} from "./schoolData";

const isHebrew = (s) => /^[א-ת]+$/.test(s);

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

  it("every letter-word has a picture", () => {
    for (const { emoji } of LETTER_WORDS) {
      expect(typeof emoji).toBe("string");
      expect(emoji.length).toBeGreaterThan(0);
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

  it("every 'which doesn't belong' set is 4 items with its odd one included", () => {
    for (const { items, odd } of ODD_SETS) {
      expect(items).toHaveLength(4);
      expect(items).toContain(odd);
    }
  });
});
