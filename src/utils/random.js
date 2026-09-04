// Fisher-Yates shuffle, shared by every game that needs a shuffled deck, a
// randomized option order, or a random subset. `rng` is injectable (defaults
// to Math.random) so callers — and their tests — can drive it
// deterministically; every consumer that already threaded a seeded `rng`
// through its own local copy of this function keeps doing exactly that,
// just against one shared implementation instead of nine near-identical
// ones.
export function shuffle(array, rng = Math.random) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// The first `n` items of a Fisher-Yates shuffle — a random, order-independent
// subset with no repeats (assuming `array` itself has none).
export function sample(array, n, rng = Math.random) {
  return shuffle(array, rng).slice(0, n);
}
