// One question generator per "Ready for School" game. Each returns the shape
// useQuizGame expects: { prompt, options: [{ id, correct, ... }] } plus any
// extra fields the game's renderer needs. `rng` is injectable for tests.
import {
  HEBREW_LETTERS,
  FINAL_FORMS,
  LETTER_WORDS,
  LOOKALIKES,
  SHAPES,
  COUNT_ITEMS,
  ODD_SETS,
  shuffle,
  sample,
} from "./schoolData";

const withIds = (arr) => arr.map((o, i) => ({ id: `o${i}`, ...o }));

// ---------- Find the Letter ----------
// Three phases across the run:
//   rounds 1–6   "same"     — tap the identical letter (the classic task)
//   rounds 7–9   "to-final" — see a letter, tap its final (sofit) form
//   rounds 10–12 "to-base"  — see a final form, tap the plain letter
// Only the five letters with a sofit are used in the final-form phases.
export function makeFindLetterQuestion(round, rng = Math.random) {
  if (round >= 7 && round <= 9) return finalFormQuestion("to-final", rng);
  if (round >= 10) return finalFormQuestion("to-base", rng);

  const optionCount = Math.min(3 + Math.floor((round - 1) / 3), 5);
  const useLookalikes = round >= 5;
  const [target] = sample(HEBREW_LETTERS, 1, rng);

  let pool;
  if (useLookalikes) {
    const pair = LOOKALIKES.find((p) => p.includes(target));
    pool = pair
      ? [...new Set([...pair, ...sample(HEBREW_LETTERS, optionCount, rng)])]
      : sample(HEBREW_LETTERS, optionCount + 2, rng);
  } else {
    pool = sample(HEBREW_LETTERS, optionCount + 2, rng);
  }
  const distractors = pool.filter((l) => l !== target).slice(0, optionCount - 1);
  const options = shuffle(
    [target, ...distractors].map((letter) => ({
      letter,
      correct: letter === target,
    })),
    rng,
  );
  return {
    prompt: { kind: "letter", letter: target, mode: "same" },
    hint: "הקישו על האות שרואים למעלה",
    options: withIds(options),
  };
}

function finalFormQuestion(mode, rng) {
  const [pair] = sample(FINAL_FORMS, 1, rng);
  const others = FINAL_FORMS.filter((f) => f.base !== pair.base);
  const distractors = sample(others, 3, rng);

  if (mode === "to-final") {
    const options = shuffle(
      [
        { letter: pair.final, correct: true },
        ...distractors.map((d) => ({ letter: d.final, correct: false })),
      ],
      rng,
    );
    return {
      prompt: { kind: "letter", letter: pair.base, mode },
      hint: "לכל אות יש צורה בסוף מילה. הקישו על הצורה הסופית של האות למעלה.",
      options: withIds(options),
    };
  }

  // to-base: show the sofit, pick the plain letter
  const options = shuffle(
    [
      { letter: pair.base, correct: true },
      ...distractors.map((d) => ({ letter: d.base, correct: false })),
    ],
    rng,
  );
  return {
    prompt: { kind: "letter", letter: pair.final, mode },
    hint: "זו צורה סופית. הקישו על האות הרגילה שממנה היא באה.",
    options: withIds(options),
  };
}

// ---------- Letter & Picture ----------
export function makeLetterPictureQuestion(round, rng = Math.random) {
  const optionCount = Math.min(3 + Math.floor((round - 1) / 4), 4);
  const chosen = sample(LETTER_WORDS, optionCount, rng);
  const answer = chosen[Math.floor(rng() * chosen.length)];
  const options = shuffle(
    chosen.map((w) => ({
      pic: w.pic,
      word: w.word,
      correct: w.letter === answer.letter,
    })),
    rng,
  );
  return {
    prompt: { kind: "letter", letter: answer.letter },
    options: withIds(options),
  };
}

// ---------- Count & Choose ----------
export function makeCountQuestion(round, rng = Math.random) {
  const max = Math.min(3 + Math.floor((round - 1) / 2), 10);
  const count = 1 + Math.floor(rng() * max);
  const [item] = sample(COUNT_ITEMS, 1, rng);

  const candidates = new Set([count]);
  while (candidates.size < 4) {
    const delta = 1 + Math.floor(rng() * 3);
    const alt = rng() < 0.5 ? count + delta : count - delta;
    if (alt >= 1 && alt <= 12) candidates.add(alt);
  }
  const options = shuffle(
    [...candidates].map((n) => ({ label: String(n), value: n, correct: n === count })),
    rng,
  );
  return {
    prompt: { kind: "items", item, count },
    options: withIds(options),
  };
}

// ---------- What Comes Next ----------
export function makeWhatComesNextQuestion(round, rng = Math.random) {
  const kinds = round < 4 ? ["run", "pattern"] : ["run", "skip", "pattern"];
  const kind = kinds[Math.floor(rng() * kinds.length)];

  if (kind === "run") {
    const start = 1 + Math.floor(rng() * 5);
    const seq = [start, start + 1, start + 2];
    const answer = start + 3;
    return numberNext(seq, answer, rng);
  }
  if (kind === "skip") {
    const step = [2, 3, 5][Math.floor(rng() * 3)];
    const start = step;
    const seq = [start, start + step, start + step * 2];
    const answer = start + step * 3;
    return numberNext(seq, answer, rng);
  }
  // pattern: ABAB… of two pictures (sequence tokens are { pic } | { num })
  const PATTERN_PICS = ["circle-red", "circle-blue", "circle-yellow", "circle-green", "star", "heart"];
  const [a, b] = sample(PATTERN_PICS, 2, rng);
  const seq = [a, b, a, b];
  const answer = a;
  const distractors = PATTERN_PICS.filter((x) => x !== answer);
  const options = shuffle(
    [answer, ...sample(distractors, 2, rng)].map((pic) => ({
      pic,
      correct: pic === answer,
    })),
    rng,
  );
  return {
    prompt: { kind: "sequence", items: seq.map((pic) => ({ pic })) },
    options: withIds(options),
  };
}

function numberNext(seq, answer, rng) {
  const distractors = new Set();
  while (distractors.size < 2) {
    const d = answer + (rng() < 0.5 ? 1 : -1) * (1 + Math.floor(rng() * 3));
    if (d >= 0 && d !== answer) distractors.add(d);
  }
  const options = shuffle(
    [answer, ...distractors].map((n) => ({
      label: String(n),
      value: n,
      correct: n === answer,
    })),
    rng,
  );
  return {
    prompt: { kind: "sequence", items: seq.map((n) => ({ num: String(n) })) },
    options: withIds(options),
  };
}

// ---------- First Math ----------
// Five levels over the 12-round run, so the child has to think — not just
// pick a number out of four every time:
//   L1 r1–3    add within 5, dots to count
//   L2 r4–5    add within 10
//   L3 r6–8    missing number:  2 + ? = 5   /   ? + 3 = 7
//   L4 r9–10   subtract, never below zero
//   L5 r11–12  a mix of all of the above
function firstMathLevel(round) {
  if (round <= 3) return "add-5";
  if (round <= 5) return "add-10";
  if (round <= 8) return "missing";
  if (round <= 10) return "subtract";
  return "mix";
}

const NUM_OPTIONS = (answer, rng) => {
  const candidates = new Set([answer]);
  while (candidates.size < 4) {
    const alt = answer + (rng() < 0.5 ? 1 : -1) * (1 + Math.floor(rng() * 3));
    if (alt >= 0 && alt <= 20) candidates.add(alt);
  }
  return shuffle(
    [...candidates].map((n) => ({
      label: String(n),
      value: n,
      correct: n === answer,
    })),
    rng,
  );
};

export function makeFirstMathQuestion(round, rng = Math.random) {
  let level = firstMathLevel(round);
  if (level === "mix") {
    level = ["add-10", "missing", "subtract"][Math.floor(rng() * 3)];
  }

  // Build a true equation  a (op) b = result  with no negatives.
  let a;
  let b;
  let op;
  let result;
  if (level === "subtract") {
    op = "−";
    a = 3 + Math.floor(rng() * 7); // 3..9
    b = 1 + Math.floor(rng() * a); // <= a
    result = a - b;
  } else {
    op = "+";
    const max = level === "add-5" ? 5 : 10;
    a = 1 + Math.floor(rng() * (max - 1));
    b = 1 + Math.floor(rng() * (max - a));
    result = a + b;
  }

  // Which slot is blank? L3 "missing" hides an operand; the rest hide the
  // result (the classic "what does this make?").
  const missing =
    level === "missing" ? (rng() < 0.5 ? "a" : "b") : "result";
  const answer = missing === "a" ? a : missing === "b" ? b : result;

  const showDots =
    missing === "result" && level === "add-5" && result <= 10;

  return {
    prompt: { kind: "math", a, b, op, result, missing, showDots },
    hint:
      missing === "result"
        ? "מה התשובה?"
        : "איזה מספר חסר?",
    options: withIds(NUM_OPTIONS(answer, rng)),
  };
}

// ---------- Shapes & Colors ----------
// Coloured geometric emoji so "העיגול האדום" is unambiguous. `he` is the
// child-facing colour word; the shape word comes from SHAPES[].name. Hebrew
// is noun-then-adjective, so the label reads "עיגול אדום", not the reverse.
const SC_COLORS = [
  { id: "red", he: "אדום", circle: "circle-red", square: "square-red" },
  { id: "blue", he: "כחול", circle: "circle-blue", square: "square-blue" },
  { id: "green", he: "ירוק", circle: "circle-green", square: "square-green" },
  { id: "yellow", he: "צהוב", circle: "circle-yellow", square: "square-yellow" },
  { id: "purple", he: "סגול", circle: "circle-purple", square: "square-purple" },
];

export function makeShapesColorsQuestion(round, rng = Math.random) {
  const withColor = round >= 4;

  if (!withColor) {
    const shapes = sample(SHAPES, 4, rng);
    const target = shapes[Math.floor(rng() * shapes.length)];
    const options = shuffle(
      shapes.map((s) => ({ pic: s.pic, name: s.name, correct: s.id === target.id })),
      rng,
    );
    return {
      // `pic` lets the game show the target shape itself — a pre-reader can
      // match on the picture without needing the Hebrew shape word.
      prompt: { kind: "find-shape", name: target.name, pic: target.pic },
      options: withIds(options),
    };
  }

  const shape = rng() < 0.5 ? SHAPES[0] : SHAPES[1]; // circle | square
  const colors = sample(SC_COLORS, 4, rng);
  const targetColor = colors[Math.floor(rng() * colors.length)];
  const label = (c) => `${shape.name} ${c.he}`; // "עיגול אדום"
  const options = shuffle(
    colors.map((c) => ({
      pic: c[shape.id],
      name: label(c),
      correct: c.id === targetColor.id,
    })),
    rng,
  );
  return {
    prompt: {
      kind: "find-colored-shape",
      name: label(targetColor),
      pic: targetColor[shape.id],
    },
    options: withIds(options),
  };
}

// ---------- Which Doesn't Belong ----------
export function makeWhichDoesntBelongQuestion(round, rng = Math.random) {
  const set = ODD_SETS[Math.floor(rng() * ODD_SETS.length)];
  const options = shuffle(
    set.items.map((pic) => ({ pic, correct: pic === set.odd })),
    rng,
  );
  return {
    prompt: null,
    group: set.group,
    why: set.why,
    options: withIds(options),
  };
}
