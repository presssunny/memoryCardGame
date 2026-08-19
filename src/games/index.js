import { MemoryMatchGame } from "./memory-match/MemoryMatchGame";
import { SpeedMatchGame } from "./speed-match/SpeedMatchGame";
import { TimeAttackGame } from "./time-attack/TimeAttackGame";
import { SurvivalGame } from "./survival/SurvivalGame";
import { SequenceRecallGame } from "./sequence-recall/SequenceRecallGame";

// To add a new game: append one object here with a unique id, label,
// description, icon, and a component. The component is rendered with
// { gameId, cardValues, allThemes, activeThemeId, onThemeChange, bestScores, onExit }
// — see MemoryMatchGame for the reference shape. If higher scores mean a
// better result (not fewer moves), set higherScoreIsBetter and bestUnit.
export const GAMES = [
  {
    id: "memory-match",
    label: "Memory Match",
    description: "Flip two cards at a time and find every matching pair.",
    icon: "🧠",
    component: MemoryMatchGame,
  },
  {
    id: "speed-match",
    label: "Speed Match",
    description: "Memorize the board, then find every pair from memory alone.",
    icon: "⚡",
    component: SpeedMatchGame,
  },
  {
    id: "time-attack",
    label: "Time Attack",
    description: "Race the clock — match every pair before time runs out.",
    icon: "⏱️",
    component: TimeAttackGame,
  },
  {
    id: "survival",
    label: "Survival",
    description: "Match every pair before you run out of moves.",
    icon: "🎯",
    component: SurvivalGame,
  },
  {
    id: "sequence-recall",
    label: "Sequence Recall",
    description: "Watch the sequence, then repeat it back — one step longer each round.",
    icon: "🔁",
    component: SequenceRecallGame,
    higherScoreIsBetter: true,
    bestUnit: "rounds",
  },
];
