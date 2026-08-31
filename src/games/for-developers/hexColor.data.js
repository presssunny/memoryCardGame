function clamp(n) {
  return Math.max(0, Math.min(255, Math.round(n)));
}
function toHex(r, g, b) {
  return (
    "#" +
    [r, g, b].map((c) => clamp(c).toString(16).padStart(2, "0")).join("")
  ).toUpperCase();
}

// generate(round): a random colour swatch and 3–4 hex codes to choose from.
// Distractors sit near the real colour, closer as the rounds go on.
export function makeHexQuestion(round, rng = Math.random) {
  const optionCount = round < 4 ? 3 : 4;
  const spread = Math.max(80 - round * 6, 24);

  const r = Math.floor(rng() * 256);
  const g = Math.floor(rng() * 256);
  const b = Math.floor(rng() * 256);
  const answer = toHex(r, g, b);

  const seen = new Set([answer]);
  const options = [{ id: "a", hex: answer, correct: true }];
  while (options.length < optionCount) {
    const nudge = () => (rng() - 0.5) * 2 * spread;
    const hex = toHex(r + nudge(), g + nudge(), b + nudge());
    if (!seen.has(hex)) {
      seen.add(hex);
      options.push({ id: `d${options.length}`, hex, correct: false });
    }
  }

  // shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { prompt: { hex: answer }, options };
}
