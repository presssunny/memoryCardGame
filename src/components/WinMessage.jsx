import { GameResult } from "./game-ui/GameResult";
import { bestChipLabel, isNewRecord, nearMissLine } from "../games/shared/metric";

// Win screen. Public API unchanged (moves, score, best, note, onNewGame,
// hebrew) plus optional onExit for a "Back to Games" button and scoreLabel
// to name the headline number. Renders the shared GameResult.
//
// The headline is `moves` — the ranked metric the game card also shows as
// "Best" — so the big number and the "Best" line are the same measure and a
// win never mixes two units on one screen. `score` stays in the signature
// for callers but isn't shown here. For the Hebrew kids games it's purely
// celebratory: no raw numbers, the per-game `note` carries the praise.
export const WinMessage = ({
  moves,
  // eslint-disable-next-line no-unused-vars
  score,
  best,
  note,
  onNewGame,
  onExit,
  hebrew = false,
  scoreLabel,
  // The ranked unit ("moves" / "score" / "streak" / "ms" / …). Drives the
  // record direction and the near-miss line; defaults to the historical
  // "moves" (lower-is-better) assumption.
  bestUnit = "moves",
  // Optional explicit override for the record flag.
  isRecord: isRecordProp,
  // Pre-reader read-aloud for the Hebrew win screen (a plain string).
  speak,
}) => {
  // `best` is the previous best (the new result records after render), so no
  // previous best OR matching/beating it (in the metric's own direction)
  // both count as a record.
  const isRecord = isRecordProp ?? isNewRecord(moves, best?.moves ?? null, bestUnit);
  // English-only: the Hebrew (pre-reader) win screen is number-free by design.
  const nearMiss = hebrew
    ? null
    : nearMissLine({ value: moves, best: best?.moves ?? null, bestUnit });

  if (hebrew) {
    return (
      <GameResult
        variant="win"
        badge="✓"
        title="כל הכבוד!"
        isRecord={isRecord}
        note={note}
        speak={
          speak ??
          (typeof note === "string" ? `כל הכבוד! ${note}` : "כל הכבוד!")
        }
        onPlayAgain={onNewGame}
        onExit={onExit}
        hebrew
      />
    );
  }

  return (
    <GameResult
      variant="win"
      title="Congratulations!"
      bigValue={moves}
      bigLabel={scoreLabel}
      isRecord={isRecord}
      // `best` re-reads as the just-recorded result right after the win, so
      // a record win would otherwise show "11" and "Best 11" — the same
      // number stacked. Only show Best when it differs from the headline;
      // the record ribbon already says "this is your best".
      meta={
        best && best.moves !== moves
          ? [{ label: bestChipLabel(bestUnit), value: best.moves }]
          : []
      }
      note={note}
      nearMiss={nearMiss}
      onPlayAgain={onNewGame}
      onExit={onExit}
    />
  );
};
