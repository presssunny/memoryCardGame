export const COLORS = [
  { id: "red", name: "Red", hex: "#ef4444" },
  { id: "blue", name: "Blue", hex: "#3b82f6" },
  { id: "green", name: "Green", hex: "#22c55e" },
  { id: "yellow", name: "Yellow", hex: "#eab308" },
  { id: "purple", name: "Purple", hex: "#a855f7" },
  { id: "orange", name: "Orange", hex: "#f97316" },
  { id: "pink", name: "Pink", hex: "#ec4899" },
  { id: "cyan", name: "Cyan", hex: "#06b6d4" },
];

function sample(array, n, rng) {
  const pool = [...array];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

// generate(round): a target colour, and 4 swatch options that include it.
// Option count grows from 3 to 4 to 5 as the child progresses.
export function makeColorTapQuestion(round, rng = Math.random) {
  const optionCount = Math.min(3 + Math.floor((round - 1) / 3), COLORS.length, 5);
  const chosen = sample(COLORS, optionCount, rng);
  const target = chosen[Math.floor(rng() * chosen.length)];
  const options = sample(
    chosen.map((c) => ({ id: c.id, hex: c.hex, name: c.name, correct: c.id === target.id })),
    optionCount,
    rng,
  );
  return { prompt: target, options };
}
