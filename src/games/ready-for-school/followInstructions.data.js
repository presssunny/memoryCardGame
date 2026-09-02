import { sample } from "./schoolData";

// The pool of tappable targets for Follow Instructions. `label` is the
// child-facing Hebrew name (also the button's aria-label); `pic` is the
// asset id (src/assets/kids).
export const TARGETS = [
  { id: "red-circle", pic: "circle-red", label: "עיגול אדום" },
  { id: "blue-square", pic: "square-blue", label: "ריבוע כחול" },
  { id: "green-circle", pic: "circle-green", label: "עיגול ירוק" },
  { id: "yellow-square", pic: "square-yellow", label: "ריבוע צהוב" },
  { id: "star", pic: "star", label: "כוכב" },
  { id: "heart", pic: "heart", label: "לב" },
];

// "הקישו על עיגול אדום, ואז על כוכב" — a comma list joined with ואז before
// the last step, so it reads naturally when a parent says it aloud.
function joinSteps(labels) {
  if (labels.length === 1) return `הקישו על ${labels[0]}`;
  return `הקישו על ${labels.slice(0, -1).join(", ")}, ואז על ${
    labels[labels.length - 1]
  }`;
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
