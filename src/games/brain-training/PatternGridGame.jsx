import { GameHeader } from "../../components/GameHeader";
import { LoseMessage } from "../../components/LoseMessage";
import { PhaseOverlay } from "../../components/PhaseOverlay";
import { useGameResult } from "../shared/useGameResult";
import { usePatternGrid } from "./usePatternGrid";

export function PatternGridGame({ gameId, bestScores, onExit }) {
  const game = usePatternGrid();

  const best = useGameResult(bestScores, gameId, "default", {
    ended: game.phase === "lost",
    result: { moves: game.roundsCompleted, score: game.roundsCompleted },
    higherIsBetter: true,
  });
  const isNewBest = !best || game.roundsCompleted > best.moves;

  const showing = game.phase === "showing";

  return (
    <>
      <GameHeader
        title="🔲 Pattern Grid"
        score={game.round}
        scoreLabel="Round:"
        best={best}
        bestUnit="rounds"
        extraStat={{ label: "Cells:", value: game.litCount }}
        onReset={game.restart}
        onExit={onExit}
      />

      {showing && (
        <PhaseOverlay
          title="Memorise the pattern"
          subtitle={`${game.litCount} cells`}
        />
      )}
      {game.phase === "lost" && (
        <LoseMessage
          title="Missed one"
          message={`You cleared ${game.roundsCompleted} round${
            game.roundsCompleted === 1 ? "" : "s"
          }.`}
          note={isNewBest && game.roundsCompleted > 0 ? "🏆 New best!" : undefined}
          onRetry={game.restart}
        />
      )}

      {game.phase !== "lost" && (
        <div
          className="pattern-grid"
          style={{ "--cols": game.size }}
          role="group"
          aria-label="Pattern grid"
        >
          {Array.from({ length: game.cellCount }, (_, i) => {
            const isLit = showing && game.lit.has(i);
            const isPicked = game.picked.has(i);
            return (
              <button
                key={i}
                type="button"
                className={`pattern-cell${isLit ? " is-lit" : ""}${
                  isPicked ? " is-picked" : ""
                }`}
                aria-label={`Cell ${i + 1}`}
                disabled={showing || isPicked}
                onClick={() => game.tap(i)}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
