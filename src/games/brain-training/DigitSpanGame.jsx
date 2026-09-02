import { useEffect } from "react";
import { GameHeader } from "../../components/GameHeader";
import { LoseMessage } from "../../components/LoseMessage";
import { PhaseOverlay } from "../../components/PhaseOverlay";
import { useGameResult } from "../shared/useGameResult";
import { useDigitSpan } from "./useDigitSpan";

const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

export function DigitSpanGame({ gameId, bestScores, onExit }) {
  const game = useDigitSpan();

  // Type the digits back on the physical keyboard, not just the on-screen pad.
  const { pressDigit, phase } = game;
  useEffect(() => {
    if (phase !== "input") return undefined;
    const onKey = (e) => {
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        pressDigit(Number(e.key));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, pressDigit]);

  const best = useGameResult(bestScores, gameId, "default", {
    ended: game.phase === "lost",
    result: { moves: game.roundsCompleted, score: game.longestSpan },
    higherIsBetter: true,
  });
  const isNewBest = !best || game.roundsCompleted > best.moves;

  const showingDigit =
    game.phase === "showing" && game.shownIndex < game.sequence.length
      ? game.sequence[game.shownIndex]
      : null;

  return (
    <>
      <GameHeader
        title="🧮 Digit Span"
        score={game.level}
        scoreLabel="Length:"
        best={best}
        bestUnit="rounds"
        extraStat={{ label: "Cleared:", value: game.roundsCompleted }}
        onReset={game.restart}
        onExit={onExit}
      />

      {game.phase === "showing" && (
        <PhaseOverlay
          title={showingDigit != null ? String(showingDigit) : "Get ready…"}
          subtitle={`Remember ${game.sequence.length} digits`}
        />
      )}

      {game.phase === "lost" && (
        <LoseMessage
          title="Not quite"
          message={
            game.longestSpan > 0
              ? `You repeated ${game.longestSpan} digits.`
              : "Watch the digits, then type them back."
          }
          note={isNewBest && game.roundsCompleted > 0 ? "🏆 New best!" : undefined}
          onRetry={game.restart}
        />
      )}

      {game.phase === "input" && (
        <div className="digitspan-stage">
          <p className="digitspan-hint">
            Type the {game.sequence.length} digits — keyboard or the pad
          </p>
          <div className="digitspan-typed" aria-live="polite">
            {game.sequence.map((_, i) => (
              <span key={i} className={`digitspan-slot${i < game.typed.length ? " is-filled" : ""}`}>
                {i < game.typed.length ? game.typed[i] : "•"}
              </span>
            ))}
          </div>
          <div className="digitspan-keys" role="group" aria-label="Number keys">
            {KEYS.map((k) => (
              <button
                key={k}
                type="button"
                className="digitspan-key"
                onClick={() => game.pressDigit(k)}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
