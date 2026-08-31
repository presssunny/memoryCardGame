import { sample } from "./schoolData";

// The pool of tappable targets for Follow Instructions.
export const TARGETS = [
  { id: "red-circle", emoji: "🔴", label: "red circle" },
  { id: "blue-square", emoji: "🟦", label: "blue square" },
  { id: "green-circle", emoji: "🟢", label: "green circle" },
  { id: "yellow-square", emoji: "🟨", label: "yellow square" },
  { id: "star", emoji: "⭐", label: "star" },
  { id: "heart", emoji: "❤️", label: "heart" },
];

function joinSteps(labels) {
  if (labels.length === 1) return `Tap the ${labels[0]}`;
  return `Tap the ${labels.slice(0, -1).join(", the ")}, then the ${labels[labels.length - 1]}`;
}

// makeFollowRound(round): a shuffled board plus an ordered list of target ids
// to tap. One step at round 1, growing to three.
export function makeFollowRound(round, rng = Math.random) {
  const board = sample(TARGETS, TARGETS.length, rng);
  const stepCount = Math.min(1 + Math.floor((round - 1) / 2), 3);
  const steps = sample(board, stepCount, rng).map((t) => t.id);
  const labels = steps.map((id) => TARGETS.find((t) => t.id === id).label);
  return { board, steps, text: joinSteps(labels) };
}
