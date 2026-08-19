import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "memory-game-best-scores";

// Shape: { [gameId]: { [themeId]: { moves, score, achievedAt } } }
function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

// Tracks each game's best result per theme, persisted to localStorage the
// same way useTheme persists the active theme. Most games rank "fewer
// moves" as better; pass { higherIsBetter: true } for games where a bigger
// number wins (e.g. rounds survived).
export function useBestScores() {
  const [scores, setScores] = useState(loadAll);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    } catch {
      // localStorage unavailable — nothing to persist to
    }
  }, [scores]);

  const getBest = useCallback(
    (gameId, themeId) => scores[gameId]?.[themeId] ?? null,
    [scores],
  );

  const getBestOverall = useCallback(
    (gameId, { higherIsBetter = false } = {}) => {
      const byTheme = scores[gameId];
      if (!byTheme) return null;
      return Object.values(byTheme).reduce((best, entry) => {
        if (!best) return entry;
        const better = higherIsBetter
          ? entry.moves > best.moves
          : entry.moves < best.moves;
        return better ? entry : best;
      }, null);
    },
    [scores],
  );

  const recordResult = useCallback(
    (gameId, themeId, { moves, score }, { higherIsBetter = false } = {}) => {
      setScores((prev) => {
        const existing = prev[gameId]?.[themeId];
        if (existing) {
          const improved = higherIsBetter
            ? moves > existing.moves
            : moves < existing.moves;
          if (!improved) return prev;
        }
        return {
          ...prev,
          [gameId]: {
            ...prev[gameId],
            [themeId]: { moves, score, achievedAt: Date.now() },
          },
        };
      });
    },
    [],
  );

  return { getBest, getBestOverall, recordResult };
}
