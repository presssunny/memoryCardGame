import { GameResult } from "./game-ui/GameResult";

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
  // Optional override for games where "lower moves" isn't the ranking (e.g.
  // Pong's point margin — bigger is better).
  isRecord: isRecordProp,
  // Pre-reader read-aloud for the Hebrew win screen (a plain string).
  speak,
}) => {
  // `best` is the previous best (the new result records after render), so no
  // previous best OR beating it both count as a record.
  const isRecord = isRecordProp ?? (!best || moves <= best.moves);

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
      meta={best ? [{ label: "Best", value: best.moves }] : []}
      note={note}
      onPlayAgain={onNewGame}
      onExit={onExit}
    />
  );
};
