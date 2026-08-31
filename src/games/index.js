import { MemoryMatchGame } from "./memory-match/MemoryMatchGame";
import { SpeedMatchGame } from "./speed-match/SpeedMatchGame";
import { TimeAttackGame } from "./time-attack/TimeAttackGame";
import { SurvivalGame } from "./survival/SurvivalGame";
import { SequenceRecallGame } from "./sequence-recall/SequenceRecallGame";
import { AnimalMatchGame } from "./animal-match/AnimalMatchGame";
import { SimonGame } from "./simon/SimonGame";
import { OddOneOutGame } from "./odd-one-out/OddOneOutGame";
import { ColorTapGame } from "./color-tap/ColorTapGame";
import { FindLetterGame } from "./ready-for-school/FindLetterGame";
import { LetterPictureGame } from "./ready-for-school/LetterPictureGame";
import { CountChooseGame } from "./ready-for-school/CountChooseGame";
import { WhatComesNextGame } from "./ready-for-school/WhatComesNextGame";
import { FirstMathGame } from "./ready-for-school/FirstMathGame";
import { ShapesColorsGame } from "./ready-for-school/ShapesColorsGame";
import { WhichDoesntBelongGame } from "./ready-for-school/WhichDoesntBelongGame";
import { FollowInstructionsGame } from "./ready-for-school/FollowInstructionsGame";
import { StroopGame } from "./brain-training/StroopGame";
import { MathSprintGame } from "./brain-training/MathSprintGame";
import { ReactionTimeGame } from "./brain-training/ReactionTimeGame";
import { SchulteTableGame } from "./brain-training/SchulteTableGame";
import { DigitSpanGame } from "./brain-training/DigitSpanGame";
import { PatternGridGame } from "./brain-training/PatternGridGame";

// The single source of truth for every playable game. To add one, append an
// object here plus its component — nothing else in the app enumerates games.
//
// Fields:
//   id, label, description, icon   — identity + how it shows on a card
//   component                      — rendered with the prop shape below
//   category                       — which Browse Categories bucket it lives in
//                                    ("kids" | "brain-training" | "arcade" | "for-developers")
//   group        (optional)        — a sub-section id within a category
//                                    (see CATEGORY_GROUPS in home/homeData.js)
//   usesCards    (optional)        — true for games built on the card grid +
//                                    card-icon themes; gates the ThemeSwitcher
//   higherScoreIsBetter (optional) — a bigger number wins (default: fewer wins)
//   bestUnit            (optional) — the word after the best score ("moves")
//
// Every component receives:
//   { gameId, cardValues, allThemes, activeThemeId, onThemeChange,
//     bestScores, higherIsBetter, bestUnit, onExit }
// Non-card games ignore the theme props and don't forward them to GameHeader —
// see MemoryMatchGame for the card reference shape.
export const GAMES = [
  {
    id: "memory-match",
    label: "Memory Match",
    description: "Flip two cards at a time and find every matching pair.",
    icon: "🧠",
    category: "brain-training",
    usesCards: true,
    component: MemoryMatchGame,
  },
  {
    id: "speed-match",
    label: "Speed Match",
    description: "Memorize the board, then find every pair from memory alone.",
    icon: "⚡",
    category: "brain-training",
    usesCards: true,
    component: SpeedMatchGame,
  },
  {
    id: "time-attack",
    label: "Time Attack",
    description: "Race the clock — match every pair before time runs out.",
    icon: "⏱️",
    category: "arcade",
    usesCards: true,
    component: TimeAttackGame,
  },
  {
    id: "survival",
    label: "Survival",
    description: "Match every pair before you run out of moves.",
    icon: "🎯",
    category: "arcade",
    usesCards: true,
    component: SurvivalGame,
  },
  {
    id: "sequence-recall",
    label: "Sequence Recall",
    description: "Watch the sequence, then repeat it back — one step longer each round.",
    icon: "🔁",
    category: "brain-training",
    usesCards: true,
    higherScoreIsBetter: true,
    bestUnit: "rounds",
    component: SequenceRecallGame,
  },

  // ---------- Kids · Fun Games ----------
  {
    id: "animal-match",
    label: "Animal Match",
    description: "Flip the cards and find every pair of animals.",
    icon: "🐾",
    category: "kids",
    group: "fun",
    component: AnimalMatchGame,
  },
  {
    id: "simon",
    label: "Simon",
    description: "Watch the colours light up, then tap them back in order.",
    icon: "🟢",
    category: "kids",
    group: "fun",
    higherScoreIsBetter: true,
    bestUnit: "rounds",
    component: SimonGame,
  },
  {
    id: "odd-one-out",
    label: "Odd One Out",
    description: "Four things — tap the one that doesn't belong.",
    icon: "🔍",
    category: "kids",
    group: "fun",
    higherScoreIsBetter: true,
    bestUnit: "streak",
    component: OddOneOutGame,
  },
  {
    id: "color-tap",
    label: "Color Tap",
    description: "Tap the colour that matches the one shown.",
    icon: "🎨",
    category: "kids",
    group: "fun",
    higherScoreIsBetter: true,
    bestUnit: "streak",
    component: ColorTapGame,
  },

  // ---------- Kids · Ready for School ----------
  {
    id: "find-the-letter",
    label: "Find the Letter",
    description: "See a Hebrew letter and tap the matching one.",
    icon: "🔤",
    category: "kids",
    group: "ready-for-school",
    higherScoreIsBetter: true,
    bestUnit: "streak",
    component: FindLetterGame,
  },
  {
    id: "letter-and-picture",
    label: "Letter & Picture",
    description: "Match a letter to a picture that starts with it.",
    icon: "🖼️",
    category: "kids",
    group: "ready-for-school",
    higherScoreIsBetter: true,
    bestUnit: "streak",
    component: LetterPictureGame,
  },
  {
    id: "count-and-choose",
    label: "Count & Choose",
    description: "Count the things and pick the right number.",
    icon: "🔢",
    category: "kids",
    group: "ready-for-school",
    higherScoreIsBetter: true,
    bestUnit: "streak",
    component: CountChooseGame,
  },
  {
    id: "what-comes-next",
    label: "What Comes Next?",
    description: "Finish the pattern — numbers, colours and shapes.",
    icon: "➡️",
    category: "kids",
    group: "ready-for-school",
    higherScoreIsBetter: true,
    bestUnit: "streak",
    component: WhatComesNextGame,
  },
  {
    id: "first-math",
    label: "First Math",
    description: "Simple adding and taking away, with dots to help.",
    icon: "➕",
    category: "kids",
    group: "ready-for-school",
    higherScoreIsBetter: true,
    bestUnit: "streak",
    component: FirstMathGame,
  },
  {
    id: "shapes-and-colors",
    label: "Shapes & Colors",
    description: "Find the right shape — and the right colour.",
    icon: "🔺",
    category: "kids",
    group: "ready-for-school",
    higherScoreIsBetter: true,
    bestUnit: "streak",
    component: ShapesColorsGame,
  },
  {
    id: "which-doesnt-belong",
    label: "Which Doesn't Belong?",
    description: "Four things — tap the one that isn't like the rest.",
    icon: "🧩",
    category: "kids",
    group: "ready-for-school",
    higherScoreIsBetter: true,
    bestUnit: "streak",
    component: WhichDoesntBelongGame,
  },
  {
    id: "follow-instructions",
    label: "Follow Instructions",
    description: "Listen and tap the things in the right order.",
    icon: "👂",
    category: "kids",
    group: "ready-for-school",
    higherScoreIsBetter: true,
    bestUnit: "streak",
    component: FollowInstructionsGame,
  },

  // ---------- Brain Training ----------
  {
    id: "stroop-test",
    label: "Stroop Test",
    description: "Name the ink colour, not the word. Harder than it sounds.",
    icon: "🎨",
    category: "brain-training",
    higherScoreIsBetter: true,
    bestUnit: "streak",
    component: StroopGame,
  },
  {
    id: "math-sprint",
    label: "Math Sprint",
    description: "Solve as many as you can in 45 seconds.",
    icon: "⏱️",
    category: "brain-training",
    higherScoreIsBetter: true,
    bestUnit: "solved",
    component: MathSprintGame,
  },
  {
    id: "reaction-time",
    label: "Reaction Time",
    description: "Wait for green, then tap. Measured in milliseconds.",
    icon: "⚡",
    category: "brain-training",
    bestUnit: "ms",
    component: ReactionTimeGame,
  },
  {
    id: "schulte-table",
    label: "Schulte Table",
    description: "Find 1 to 25 in order, against the clock.",
    icon: "🔢",
    category: "brain-training",
    bestUnit: "ms",
    component: SchulteTableGame,
  },
  {
    id: "digit-span",
    label: "Digit Span",
    description: "A row of digits flashes — type it back. Each round adds one.",
    icon: "🧮",
    category: "brain-training",
    higherScoreIsBetter: true,
    bestUnit: "rounds",
    component: DigitSpanGame,
  },
  {
    id: "pattern-grid",
    label: "Pattern Grid",
    description: "Memorise the lit cells, then tap them from memory.",
    icon: "🔲",
    category: "brain-training",
    higherScoreIsBetter: true,
    bestUnit: "rounds",
    component: PatternGridGame,
  },
];

/** Look up one game by its registry id. */
export function getGame(gameId) {
  return GAMES.find((game) => game.id === gameId) ?? null;
}

/** Every game in a Browse Categories bucket, in registry order. */
export function gamesInCategory(categoryId) {
  return GAMES.filter((game) => game.category === categoryId);
}
