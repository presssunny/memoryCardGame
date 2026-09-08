// Shared score-metric semantics for the result screen (near-miss line) and
// the HUD "Best" chip.
//
// Direction is derived from `bestUnit`: across the whole catalogue only
// "moves" and "ms" are lower-is-better — every other unit (score / streak /
// rounds / hits / solved / margin / wpm) is higher-is-better. Keeping the
// rule here means no game has to thread a direction flag.

const LOWER_IS_BETTER_UNITS = new Set(["moves", "ms"]);

export function lowerIsBetter(bestUnit) {
  return LOWER_IS_BETTER_UNITS.has(bestUnit);
}

// The HUD "Best" chip label — "Fewest moves" / "Best time" / "Best streak"…,
// so a bare "Best 287" is never left without a sense of which way is good.
// The two lower-is-better units read as "fewest" / "time".
const BEST_LABEL = {
  ms: "Best time",
  moves: "Fewest moves",
  score: "Best score",
  streak: "Best streak",
  rounds: "Best rounds",
  hits: "Best hits",
  solved: "Best solved",
  margin: "Best margin",
  wpm: "Best WPM",
};

export function bestChipLabel(bestUnit, hebrew = false) {
  if (hebrew) return "שיא";
  return BEST_LABEL[bestUnit] ?? "Best";
}

// True once for a finished result — direction-aware, so a higher-is-better
// game's record isn't computed with a "<=" meant for times/moves.
export function isNewRecord(value, best, bestUnit) {
  if (value == null) return false;
  if (best == null) return true;
  return lowerIsBetter(bestUnit) ? value <= best : value >= best;
}

// A "so close" line for the (non-Hebrew) result screen. Returns null unless:
//  - there is a previous best,
//  - the result did NOT beat it (the record ribbon covers that),
//  - the result did NOT tie it,
//  - it isn't a zero score on a higher-is-better game (scoring nothing is
//    not a near miss, even when the recorded best is tiny — common for the
//    growing-sequence games where a first loss records best 1),
//  - and it landed CLOSE — the gap is within 15% of the best (min 1). A
//    distant run gets no line: no hollow encouragement.
export function nearMissLine({ value, best, bestUnit }) {
  if (value == null || best == null) return null;
  const low = lowerIsBetter(bestUnit);
  const beat = low ? value < best : value > best;
  if (beat || value === best) return null;
  if (!low && value <= 0) return null;

  const gap = Math.abs(value - best);
  const threshold = Math.max(1, Math.round(best * 0.15));
  if (gap > threshold) return null;

  if (low) {
    const unit = bestUnit === "ms" ? "ms" : gap === 1 ? "move" : "moves";
    return `So close — ${gap} ${unit} over your best (${best}).`;
  }
  return `So close — ${gap === 1 ? "1 away" : `${gap} away`} from your best (${best}).`;
}
