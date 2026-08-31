import { useEffect } from "react";

// Records a finished game's result into the shared best-scores store, and
// hands back the current best. Every game had an identical copy of this
// effect; it lives here once now.
//
//   bestScores  — the useBestScores() hook value
//   gameId      — registry id
//   themeId     — the card theme for card games; "default" for the rest
//                 (a non-card game's best must not change when the player
//                 switches card themes elsewhere)
//   ended       — true once the game is over (won or lost)
//   result      — { moves, score }; `moves` is the ranked metric (fewer wins
//                 unless higherIsBetter), `score` is shown on the result screen
//   higherIsBetter — a bigger `moves` is a better result
export function useGameResult(
  bestScores,
  gameId,
  themeId,
  { ended, result, higherIsBetter = false },
) {
  const { getBest, recordResult } = bestScores;
  const best = getBest(gameId, themeId);
  const { moves, score } = result;

  useEffect(() => {
    if (!ended) return;
    recordResult(gameId, themeId, { moves, score }, { higherIsBetter });
  }, [ended, gameId, themeId, moves, score, higherIsBetter, recordResult]);

  return best;
}
