// Animal picture pool — ids into the shared Kids asset library
// (src/assets/kids). A board uses PAIR_COUNT of these, doubled and shuffled
// by useMatchingBoard (face="pic").
export const ANIMALS = [
  "dog", "cat", "mouse", "rabbit", "fox", "bear", "panda", "koala",
  "tiger", "lion", "frog", "monkey", "pig", "cow", "chicken", "penguin",
  "owl", "unicorn", "turtle", "tropical-fish", "dolphin", "butterfly",
];

export const PAIR_COUNT = 6;

// Picks PAIR_COUNT distinct animals and returns them doubled (the pair set
// useMatchingBoard expects). `rng` is injectable for tests.
export function pickAnimalPairs(pairCount = PAIR_COUNT, rng = Math.random) {
  const pool = [...ANIMALS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const chosen = pool.slice(0, pairCount);
  return [...chosen, ...chosen];
}
