import { sample } from "../../utils/random";

// Groups of related pictures (ids into src/assets/kids). A question shows
// three items from one group plus one "odd" item from a different group;
// the odd one is the answer. `near` lists groups that are conceptually
// close — early rounds pair a group with a FAR one (obvious), later rounds
// with a NEAR one (the odd one is subtler).
export const GROUPS = [
  { id: "animals", near: ["sea"], items: ["dog", "cat", "mouse", "rabbit", "fox", "bear", "panda", "koala", "tiger", "lion", "frog", "monkey"] },
  { id: "fruit", near: ["food", "nature"], items: ["apple", "banana", "grapes", "strawberry", "peach", "cherries", "pineapple", "kiwi", "watermelon", "orange", "mango"] },
  { id: "vehicles", near: [], items: ["car", "taxi", "suv", "bus", "police-car", "ambulance", "fire-truck", "airplane", "rocket", "bicycle", "scooter", "train"] },
  { id: "food", near: ["fruit"], items: ["pizza", "burger", "hot-dog", "fries", "sandwich", "taco", "popcorn", "pretzel", "cheese", "donut", "pancakes"] },
  { id: "sports", near: [], items: ["soccer-ball", "basketball", "football", "baseball", "tennis-ball", "volleyball", "rugby", "billiards", "ping-pong", "badminton", "boxing-glove"] },
  { id: "nature", near: ["fruit"], items: ["tree", "pine-tree", "palm-tree", "cactus", "blossom", "sunflower", "clover", "tulip", "rose", "maple-leaf", "hibiscus"] },
  { id: "sea", near: ["animals"], items: ["fish", "tropical-fish", "blowfish", "shark", "dolphin", "whale", "crab", "lobster", "octopus", "shrimp", "shell"] },
  { id: "music", near: [], items: ["guitar", "piano", "drum", "trumpet", "violin", "saxophone", "microphone", "banjo", "headphones", "radio"] },
];

// generate(round): 3 from one group + 1 odd, shuffled. The round chooses how
// close the odd one's group is:
//   1–3   a FAR group (music vs fruit) — the odd one jumps out
//   4–6   any other group
//   7+    prefer a NEAR group (sea vs animals) — a real "which is the odd one"
export function makeOddOneOutQuestion(round, rng = Math.random) {
  const [main] = sample(GROUPS, 1, rng);
  const near = new Set(main.near);
  const far = GROUPS.filter((g) => g.id !== main.id && !near.has(g.id));
  const close = GROUPS.filter((g) => near.has(g.id));

  let otherPool;
  if (round <= 3) otherPool = far;
  else if (round <= 6 || close.length === 0) otherPool = far.concat(close);
  else otherPool = close;

  const [other] = sample(otherPool, 1, rng);
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
