// One question generator per "Ready for School" game. Each returns the shape
// useQuizGame expects: { prompt, options: [{ id, correct, ... }] } plus any
// extra fields the game's renderer needs. `rng` is injectable for tests.
import {
  HEBREW_LETTERS,
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
export function makeFindLetterQuestion(round, rng = Math.random) {
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
  return { prompt: { kind: "letter", letter: target }, options: withIds(options) };
}

// ---------- Letter & Picture ----------
export function makeLetterPictureQuestion(round, rng = Math.random) {
  const optionCount = Math.min(3 + Math.floor((round - 1) / 4), 4);
  const chosen = sample(LETTER_WORDS, optionCount, rng);
  const answer = chosen[Math.floor(rng() * chosen.length)];
  const options = shuffle(
    chosen.map((w) => ({
      emoji: w.emoji,
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
  // pattern: ABAB… of two emoji
  const [a, b] = sample(["🔴", "🔵", "🟡", "🟢", "⭐", "❤️"], 2, rng);
  const seq = [a, b, a, b];
  const answer = a;
  const distractors = ["🔴", "🔵", "🟡", "🟢", "⭐", "❤️"].filter((x) => x !== answer);
  const options = shuffle(
    [answer, ...sample(distractors, 2, rng)].map((emoji) => ({
      emoji,
      correct: emoji === answer,
    })),
    rng,
  );
  return { prompt: { kind: "sequence", items: seq }, options: withIds(options) };
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
    prompt: { kind: "sequence", items: seq.map(String) },
    options: withIds(options),
  };
}

// ---------- First Math ----------
export function makeFirstMathQuestion(round, rng = Math.random) {
  const max = Math.min(3 + Math.floor((round - 1) / 2), 10);
  const isPlus = round < 3 ? true : rng() < 0.55;

  let a;
  let b;
  let answer;
  if (isPlus) {
    a = 1 + Math.floor(rng() * max);
    b = 1 + Math.floor(rng() * Math.max(1, max - a));
    answer = a + b;
  } else {
    a = 2 + Math.floor(rng() * (max - 1));
    b = 1 + Math.floor(rng() * a); // never larger than a → no negatives
    answer = a - b;
  }

  const candidates = new Set([answer]);
  while (candidates.size < 4) {
    const alt = answer + (rng() < 0.5 ? 1 : -1) * (1 + Math.floor(rng() * 3));
    if (alt >= 0 && alt <= 20) candidates.add(alt);
  }
  const options = shuffle(
    [...candidates].map((n) => ({ label: String(n), value: n, correct: n === answer })),
    rng,
  );
  return {
    prompt: { kind: "math", a, b, op: isPlus ? "+" : "−", showDots: round < 4 && a + b <= 10 },
    options: withIds(options),
  };
}

// ---------- Shapes & Colors ----------
// Coloured geometric emoji so "the red circle" is unambiguous.
const COLORED = {
  circle: { red: "🔴", blue: "🔵", green: "🟢", yellow: "🟡", purple: "🟣" },
  square: { red: "🟥", blue: "🟦", green: "🟩", yellow: "🟨", purple: "🟪" },
};
const SC_COLOR_NAMES = ["red", "blue", "green", "yellow", "purple"];

export function makeShapesColorsQuestion(round, rng = Math.random) {
  const withColor = round >= 4;

  if (!withColor) {
    const shapes = sample(SHAPES, 4, rng);
    const target = shapes[Math.floor(rng() * shapes.length)];
    const options = shuffle(
      shapes.map((s) => ({ emoji: s.emoji, name: s.name, correct: s.id === target.id })),
      rng,
    );
    return {
      prompt: { kind: "find-shape", name: target.name },
      options: withIds(options),
    };
  }

  const shapeKind = rng() < 0.5 ? "circle" : "square";
  const colors = sample(SC_COLOR_NAMES, 4, rng);
  const targetColor = colors[Math.floor(rng() * colors.length)];
  const options = shuffle(
    colors.map((c) => ({
      emoji: COLORED[shapeKind][c],
      name: `${c} ${shapeKind}`,
      correct: c === targetColor,
    })),
    rng,
  );
  return {
    prompt: {
      kind: "find-colored-shape",
      name: `${targetColor} ${shapeKind}`,
      emoji: COLORED[shapeKind][targetColor],
    },
    options: withIds(options),
  };
}

// ---------- Which Doesn't Belong ----------
export function makeWhichDoesntBelongQuestion(round, rng = Math.random) {
  const set = ODD_SETS[Math.floor(rng() * ODD_SETS.length)];
  const options = shuffle(
    set.items.map((emoji) => ({ emoji, correct: emoji === set.odd })),
    rng,
  );
  return { prompt: null, options: withIds(options) };
}
