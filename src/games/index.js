import { MemoryMatchGame } from "./memory-match/MemoryMatchGame";
import { SpeedMatchGame } from "./speed-match/SpeedMatchGame";

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
];
