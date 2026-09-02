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
import { HEBREW_LETTERS, LETTER_WORDS, FINAL_FORMS } from "./schoolData";

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
  it("Find the Letter: one correct answer with unique ids in every round", () => {
    for (let r = 1; r <= 15; r++) {
      const q = makeFindLetterQuestion(r, seededRng(r));
      expect(oneCorrect(q)).toBe(true);
      expect(uniqueIds(q)).toBe(true);
      expect(q.options.length).toBeGreaterThanOrEqual(3);
      expect(q.options.length).toBeLessThanOrEqual(5);
      expect(typeof q.hint).toBe("string");
    }
  });

  it("Find the Letter — rounds 1–6: match the identical plain letter", () => {
    for (let r = 1; r <= 6; r++) {
      const q = makeFindLetterQuestion(r, seededRng(r * 11));
      expect(q.prompt.mode).toBe("same");
      expect(HEBREW_LETTERS).toContain(q.prompt.letter);
      expect(q.options.find((o) => o.correct).letter).toBe(q.prompt.letter);
    }
  });

  const FINALS = FINAL_FORMS.map((f) => f.final);
  const BASES = FINAL_FORMS.map((f) => f.base);

  it("Find the Letter — rounds 7–9: pick the final form, never a letter without one", () => {
    for (let r = 7; r <= 9; r++) {
      const q = makeFindLetterQuestion(r, seededRng(r * 13));
      expect(q.prompt.mode).toBe("to-final");
      expect(BASES).toContain(q.prompt.letter);
      const answer = q.options.find((o) => o.correct).letter;
      const pair = FINAL_FORMS.find((f) => f.base === q.prompt.letter);
      expect(answer).toBe(pair.final);
      for (const o of q.options) expect(FINALS).toContain(o.letter);
    }
  });

  it("Find the Letter — rounds 10–12: pick the plain letter for a final form", () => {
    for (let r = 10; r <= 12; r++) {
      const q = makeFindLetterQuestion(r, seededRng(r * 17));
      expect(q.prompt.mode).toBe("to-base");
      expect(FINALS).toContain(q.prompt.letter);
      const answer = q.options.find((o) => o.correct).letter;
      const pair = FINAL_FORMS.find((f) => f.final === q.prompt.letter);
      expect(answer).toBe(pair.base);
      for (const o of q.options) expect(BASES).toContain(o.letter);
    }
  });

  it("Letter & Picture: the correct picture's word starts with the prompt letter", () => {
    for (let r = 1; r <= 15; r++) {
      const q = makeLetterPictureQuestion(r, seededRng(r * 3));
      expect(oneCorrect(q)).toBe(true);
      const correct = q.options.find((o) => o.correct);
      const word = LETTER_WORDS.find((w) => w.pic === correct.pic);
      expect(word.letter).toBe(q.prompt.letter);
      expect(q.options.every((o) => typeof o.pic === "string")).toBe(true);
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

  it("First Math: a true no-negative equation, and the answer fills the blank", () => {
    for (let r = 1; r <= 30; r++) {
      const q = makeFirstMathQuestion(r, seededRng(r * 11));
      expect(oneCorrect(q)).toBe(true);
      const { a, b, op, result, missing } = q.prompt;

      // The stored equation is always internally consistent and non-negative.
      expect(op === "+" ? a + b : a - b).toBe(result);
      expect(result).toBeGreaterThanOrEqual(0);
      if (op === "−") expect(b).toBeLessThanOrEqual(a);

      // The correct option is exactly the value of the blank slot.
      const answer = q.options.find((o) => o.correct).value;
      expect(answer).toBe(missing === "a" ? a : missing === "b" ? b : result);
      expect(["a", "b", "result"]).toContain(missing);
    }
  });

  it("First Math: rounds 6–8 hide an operand, not the result", () => {
    for (let r = 6; r <= 8; r++) {
      const q = makeFirstMathQuestion(r, seededRng(r * 29));
      expect(["a", "b"]).toContain(q.prompt.missing);
      expect(q.hint).toBe("איזה מספר חסר?");
    }
  });

  it("First Math: early rounds add within five", () => {
    for (let r = 1; r <= 3; r++) {
      const q = makeFirstMathQuestion(r, seededRng(r * 31));
      expect(q.prompt.op).toBe("+");
      expect(q.prompt.missing).toBe("result");
      expect(q.prompt.a + q.prompt.b).toBeLessThanOrEqual(5);
    }
  });

  it("Shapes & Colors: one correct, options carry a picture", () => {
    for (let r = 1; r <= 12; r++) {
      const q = makeShapesColorsQuestion(r, seededRng(r * 13));
      expect(oneCorrect(q)).toBe(true);
      expect(q.options.every((o) => typeof o.pic === "string")).toBe(true);
      expect(typeof q.prompt.name).toBe("string");
    }
  });

  it("Shapes & Colors: a coloured round reads 'shape colour' in Hebrew", () => {
    const shapeColour = /^(עיגול|ריבוע) (אדום|כחול|ירוק|צהוב|סגול)$/;
    for (let r = 4; r <= 14; r++) {
      const q = makeShapesColorsQuestion(r, seededRng(r * 13));
      expect(q.prompt.name).toMatch(shapeColour); // noun then adjective
      for (const o of q.options) expect(o.name).toMatch(shapeColour);
      expect(q.options.find((o) => o.correct).name).toBe(q.prompt.name);
    }
  });

  it("Shapes & Colors: an early round names a bare Hebrew shape", () => {
    for (let r = 1; r <= 3; r++) {
      const q = makeShapesColorsQuestion(r, seededRng(r * 13));
      expect(q.prompt.name).toMatch(/^(עיגול|ריבוע|משולש|כוכב|לב|מעוין)$/);
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
