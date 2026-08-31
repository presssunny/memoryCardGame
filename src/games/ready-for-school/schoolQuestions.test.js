import { describe, it, expect } from "vitest";
import {
  makeFindLetterQuestion,
  makeLetterPictureQuestion,
  makeCountQuestion,
  makeWhatComesNextQuestion,
  makeFirstMathQuestion,
  makeShapesColorsQuestion,
  makeWhichDoesntBelongQuestion,
} from "./schoolQuestions";
import { HEBREW_LETTERS, LETTER_WORDS } from "./schoolData";

function seededRng(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const oneCorrect = (q) => q.options.filter((o) => o.correct).length === 1;
const uniqueIds = (q) =>
  new Set(q.options.map((o) => o.id)).size === q.options.length;

describe("Ready for School question generators", () => {
  it("Find the Letter: one correct, the answer letter is a real letter, ids unique", () => {
    for (let r = 1; r <= 15; r++) {
      const q = makeFindLetterQuestion(r, seededRng(r));
      expect(oneCorrect(q)).toBe(true);
      expect(uniqueIds(q)).toBe(true);
      expect(HEBREW_LETTERS).toContain(q.prompt.letter);
      expect(q.options.find((o) => o.correct).letter).toBe(q.prompt.letter);
      expect(q.options.length).toBeGreaterThanOrEqual(3);
      expect(q.options.length).toBeLessThanOrEqual(5);
    }
  });

  it("Letter & Picture: the correct picture's word starts with the prompt letter", () => {
    for (let r = 1; r <= 15; r++) {
      const q = makeLetterPictureQuestion(r, seededRng(r * 3));
      expect(oneCorrect(q)).toBe(true);
      const correct = q.options.find((o) => o.correct);
      const word = LETTER_WORDS.find((w) => w.emoji === correct.emoji);
      expect(word.letter).toBe(q.prompt.letter);
    }
  });

  it("Count & Choose: the correct number equals the shown count, always 4 options", () => {
    for (let r = 1; r <= 20; r++) {
      const q = makeCountQuestion(r, seededRng(r * 5));
      expect(q.options).toHaveLength(4);
      expect(oneCorrect(q)).toBe(true);
      expect(q.options.find((o) => o.correct).value).toBe(q.prompt.count);
      expect(q.prompt.count).toBeGreaterThanOrEqual(1);
    }
  });

  it("What Comes Next: one correct option, prompt always has items", () => {
    for (let r = 1; r <= 20; r++) {
      const q = makeWhatComesNextQuestion(r, seededRng(r * 7));
      expect(oneCorrect(q)).toBe(true);
      expect(q.prompt.items.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("First Math: never produces a negative answer, one correct option", () => {
    for (let r = 1; r <= 30; r++) {
      const q = makeFirstMathQuestion(r, seededRng(r * 11));
      expect(oneCorrect(q)).toBe(true);
      const answer = q.options.find((o) => o.correct).value;
      expect(answer).toBeGreaterThanOrEqual(0);
      const { a, b, op } = q.prompt;
      expect(op === "+" ? a + b : a - b).toBe(answer);
      if (op === "−") expect(b).toBeLessThanOrEqual(a);
    }
  });

  it("Shapes & Colors: one correct, options carry an emoji", () => {
    for (let r = 1; r <= 12; r++) {
      const q = makeShapesColorsQuestion(r, seededRng(r * 13));
      expect(oneCorrect(q)).toBe(true);
      expect(q.options.every((o) => typeof o.emoji === "string")).toBe(true);
      expect(typeof q.prompt.name).toBe("string");
    }
  });

  it("Which Doesn't Belong: 4 options, exactly one odd", () => {
    for (let r = 1; r <= 20; r++) {
      const q = makeWhichDoesntBelongQuestion(r, seededRng(r * 17));
      expect(q.options).toHaveLength(4);
      expect(oneCorrect(q)).toBe(true);
    }
  });
});
