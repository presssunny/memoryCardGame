import { MemoryMatchGame } from "./memory-match/MemoryMatchGame";
import { SpeedMatchGame } from "./speed-match/SpeedMatchGame";
import { TimeAttackGame } from "./time-attack/TimeAttackGame";
import { SurvivalGame } from "./survival/SurvivalGame";
import { SequenceRecallGame } from "./sequence-recall/SequenceRecallGame";

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
];

/** Look up one game by its registry id. */
export function getGame(gameId) {
  return GAMES.find((game) => game.id === gameId) ?? null;
}

/** Every game in a Browse Categories bucket, in registry order. */
export function gamesInCategory(categoryId) {
  return GAMES.filter((game) => game.category === categoryId);
}
