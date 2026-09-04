import { describe, it, expect } from "vitest";
import {
  letterName,
  countPlural,
  speakFindLetter,
  speakLetterPicture,
  speakCount,
  speakWhatComesNext,
  speakFirstMath,
  speakShapesColors,
  speakWhichDoesntBelong,
} from "./schoolSpeech";
import {
  makeFindLetterQuestion,
  makeLetterPictureQuestion,
  makeCountQuestion,
  makeWhatComesNextQuestion,
  makeFirstMathQuestion,
  makeShapesColorsQuestion,
  makeWhichDoesntBelongQuestion,
} from "./schoolQuestions";

function seededRng(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// A well-formed spoken instruction: a non-empty Hebrew sentence with no
// leftover template gaps and no "undefined"/"null" from a missing field.
const isCleanSentence = (str) => {
  expect(typeof str).toBe("string");
  expect(str.trim().length).toBeGreaterThan(0);
  expect(str).not.toMatch(/undefined|null|NaN|\$\{/);
  expect(str).toMatch(/[֐-׿]/); // contains Hebrew
};

describe("schoolSpeech helpers", () => {
  it("letterName maps letters to niqqud-free names and passes through the unknown", () => {
    expect(letterName("א")).toBe("אלף");
    expect(letterName("ם")).toBe("מם סופית");
    expect(letterName("?")).toBe("?");
  });

  it("countPlural knows the countable items and falls back to a word", () => {
    expect(countPlural("apple")).toBe("תפוחים");
    expect(countPlural("totally-unknown-id")).toBe("דברים");
  });
});

describe("speakFirstMath", () => {
  it("reads a clean sentence for every round / seed", () => {
    for (let seed = 1; seed <= 60; seed++) {
      for (let round = 1; round <= 12; round++) {
        const q = makeFirstMathQuestion(round, seededRng(seed * 7 + round));
        isCleanSentence(speakFirstMath(q));
      }
    }
  });

  it("missing result: names both operands and the operator word", () => {
    const q = { prompt: { kind: "math", a: 2, b: 3, op: "+", result: 5, missing: "result" } };
    expect(speakFirstMath(q)).toBe("כמה זה 2 ועוד 3? לחצו על התשובה.");
  });

  it("missing result, subtraction: uses פחות", () => {
    const q = { prompt: { kind: "math", a: 9, b: 4, op: "−", result: 5, missing: "result" } };
    expect(speakFirstMath(q)).toBe("כמה זה 9 פחות 4? לחצו על התשובה.");
  });

  it("missing first operand (? + 3 = 5): blank spoken as כמה, other operand kept", () => {
    const q = { prompt: { kind: "math", a: 2, b: 3, op: "+", result: 5, missing: "a" } };
    expect(speakFirstMath(q)).toBe("כמה ועוד 3 זה 5? לחצו על המספר החסר.");
  });

  it("missing second operand (2 + ? = 5): first operand kept, blank spoken as כמה", () => {
    const q = { prompt: { kind: "math", a: 2, b: 3, op: "+", result: 5, missing: "b" } };
    expect(speakFirstMath(q)).toBe("2 ועוד כמה זה 5? לחצו על המספר החסר.");
  });

  it("never speaks two blanks (the old 'כמה ועוד כמה' bug)", () => {
    for (let seed = 1; seed <= 100; seed++) {
      const q = makeFirstMathQuestion(7, seededRng(seed));
      const s = speakFirstMath(q);
      const blanks = (s.match(/כמה/g) || []).length;
      // At most one "כמה" for the missing operand; the result-missing case
      // opens with "כמה זה" which is also a single occurrence.
      expect(blanks).toBeLessThanOrEqual(1);
    }
  });
});

describe("other Ready for School spoken builders", () => {
  it("speakFindLetter covers same / to-final / to-base modes", () => {
    for (let r = 1; r <= 15; r++) {
      isCleanSentence(speakFindLetter(makeFindLetterQuestion(r, seededRng(r * 3))));
    }
  });

  it("speakLetterPicture", () => {
    for (let r = 1; r <= 12; r++) {
      isCleanSentence(speakLetterPicture(makeLetterPictureQuestion(r, seededRng(r * 5))));
    }
  });

  it("speakCount", () => {
    for (let r = 1; r <= 12; r++) {
      isCleanSentence(speakCount(makeCountQuestion(r, seededRng(r * 9))));
    }
  });

  it("speakWhatComesNext handles picture and numeric sequences", () => {
    for (let r = 1; r <= 12; r++) {
      isCleanSentence(speakWhatComesNext(makeWhatComesNextQuestion(r, seededRng(r * 13))));
    }
  });

  it("speakShapesColors", () => {
    for (let r = 1; r <= 12; r++) {
      isCleanSentence(speakShapesColors(makeShapesColorsQuestion(r, seededRng(r * 17))));
    }
  });

  it("speakShapesColors uses a definite article, not 'מצאו את עיגול' (L9)", () => {
    // Shape only (round < 4): a single word gets a single "ה".
    expect(speakShapesColors({ prompt: { name: "עיגול" } })).toBe(
      "מצאו את העיגול, ולחצו עליו.",
    );
    // Shape + colour (round >= 4): both words are definite —
    // "עיגול אדום" → "העיגול האדום", not the old "עיגול אדום".
    expect(speakShapesColors({ prompt: { name: "עיגול אדום" } })).toBe(
      "מצאו את העיגול האדום, ולחצו עליו.",
    );
    // Every generated round agrees: "את" is never followed by a bare,
    // undefined shape/colour word.
    for (let r = 1; r <= 12; r++) {
      const q = makeShapesColorsQuestion(r, seededRng(r * 23));
      const spoken = speakShapesColors(q);
      expect(spoken).not.toMatch(/את (?!ה)/);
    }
  });

  it("speakWhichDoesntBelong", () => {
    isCleanSentence(speakWhichDoesntBelong(makeWhichDoesntBelongQuestion(1, seededRng(1))));
  });
});
