// Groups of related pictures (ids into src/assets/kids). A question shows
// three items from one group plus one "odd" item from a different group;
// the odd one is the answer.
export const GROUPS = [
  { id: "animals", items: ["dog", "cat", "mouse", "rabbit", "fox", "bear", "panda", "koala", "tiger", "lion", "frog", "monkey"] },
  { id: "fruit", items: ["apple", "banana", "grapes", "strawberry", "peach", "cherries", "pineapple", "kiwi", "watermelon", "orange", "mango"] },
  { id: "vehicles", items: ["car", "taxi", "suv", "bus", "police-car", "ambulance", "fire-truck", "airplane", "rocket", "bicycle", "scooter", "train"] },
  { id: "food", items: ["pizza", "burger", "hot-dog", "fries", "sandwich", "taco", "popcorn", "pretzel", "cheese", "donut", "pancakes"] },
  { id: "sports", items: ["soccer-ball", "basketball", "football", "baseball", "tennis-ball", "volleyball", "rugby", "billiards", "ping-pong", "badminton", "boxing-glove"] },
  { id: "nature", items: ["tree", "pine-tree", "palm-tree", "cactus", "blossom", "sunflower", "clover", "tulip", "rose", "maple-leaf", "hibiscus"] },
  { id: "sea", items: ["fish", "tropical-fish", "blowfish", "shark", "dolphin", "whale", "crab", "lobster", "octopus", "shrimp", "shell"] },
  { id: "music", items: ["guitar", "piano", "drum", "trumpet", "violin", "saxophone", "microphone", "banjo", "headphones", "radio"] },
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
  const picked = sample(main.items, 3, rng).map((pic, i) => ({
    id: `m${i}`,
    pic,
    correct: false,
  }));
  const [oddPic] = sample(other.items, 1, rng);
  const options = sample(
    [...picked, { id: "odd", pic: oddPic, correct: true }],
    4,
    rng,
  );
  return { prompt: null, options, groupId: main.id, oddGroupId: other.id };
}
