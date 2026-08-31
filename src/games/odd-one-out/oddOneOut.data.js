// Groups of related emoji. A question shows three items from one group plus
// one "odd" item from a different group; the odd one is the answer.
export const GROUPS = [
  { id: "animals", items: ["🐶", "🐱", "🐭", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐸", "🐵"] },
  { id: "fruit", items: ["🍎", "🍌", "🍇", "🍓", "🍑", "🍒", "🍍", "🥝", "🍉", "🍊", "🥭"] },
  { id: "vehicles", items: ["🚗", "🚕", "🚙", "🚌", "🚓", "🚑", "🚒", "✈️", "🚀", "🚲", "🛵", "🚂"] },
  { id: "food", items: ["🍕", "🍔", "🌭", "🍟", "🥪", "🌮", "🍿", "🥨", "🧀", "🍩", "🥞"] },
  { id: "sports", items: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸", "🥊"] },
  { id: "nature", items: ["🌳", "🌲", "🌴", "🌵", "🌸", "🌻", "🍀", "🌷", "🌹", "🍁", "🌺"] },
  { id: "sea", items: ["🐟", "🐠", "🐡", "🦈", "🐬", "🐳", "🦀", "🦞", "🐙", "🦐", "🐚"] },
  { id: "music", items: ["🎸", "🎹", "🥁", "🎺", "🎻", "🎷", "🎤", "🪕", "🎧", "📻"] },
];

function sample(array, n, rng) {
  const pool = [...array];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

// generate(round) for useQuizGame: 3 from one group + 1 odd, shuffled.
export function makeOddOneOutQuestion(round, rng = Math.random) {
  const groups = sample(GROUPS, 2, rng);
  const [main, other] = groups;
  const picked = sample(main.items, 3, rng).map((emoji, i) => ({
    id: `m${i}`,
    emoji,
    correct: false,
  }));
  const [oddEmoji] = sample(other.items, 1, rng);
  const options = sample(
    [...picked, { id: "odd", emoji: oddEmoji, correct: true }],
    4,
    rng,
  );
  return { prompt: null, options, groupId: main.id, oddGroupId: other.id };
}
