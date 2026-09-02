// Memory Match board sizes, in pairs. The board is clamped to however many
// icons the active theme carries (Dev Tools 8, Emoji 16, Gabby 7), so "Hard"
// is only really hard on the themes with enough art.
export const LEVELS = { easy: 4, classic: 8, hard: 12 };
export const LEVEL_ORDER = ["easy", "classic", "hard"];
export const DEFAULT_LEVEL = "classic";

/** How many pairs a level actually yields for a theme with `iconCount` icons. */
export function pairsFor(level, iconCount) {
  const wanted = LEVELS[level] ?? LEVELS[DEFAULT_LEVEL];
  return Math.max(2, Math.min(wanted, iconCount));
}

/** Pill options for the selector, labelled with the real (clamped) pair count. */
export function levelPills(iconCount) {
  return LEVEL_ORDER.map((level) => ({
    value: level,
    label: `${level[0].toUpperCase()}${level.slice(1)} · ${pairsFor(level, iconCount)}`,
  }));
}

/** Grid column count for a board of `pairCount` pairs. */
export function colsFor(pairCount) {
  return pairCount >= 10 ? 6 : 4;
}
