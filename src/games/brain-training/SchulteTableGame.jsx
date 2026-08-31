import { GameHeader } from "../../components/GameHeader";
import { WinMessage } from "../../components/WinMessage";
import { useGameResult } from "../shared/useGameResult";
import { useSchulteTable } from "./useSchulteTable";

const fmt = (ms) => `${(ms / 1000).toFixed(1)}s`;

export function SchulteTableGame({ gameId, bestScores, onExit }) {
  const game = useSchulteTable({ size: 5 });

  const best = useGameResult(bestScores, gameId, "default", {
    ended: game.status === "done",
    result: { moves: game.elapsedMs, score: game.misses },
    higherIsBetter: false,
  });

  return (
    <>
      <GameHeader
        title="🔢 Schulte Table"
        score={game.next > game.total ? game.total : game.next - 1}
        scoreLabel="Found:"
        moves={game.total}
        movesLabel="of"
        best={best}
        bestUnit="ms"
        extraStat={{ label: "Time:", value: fmt(game.elapsedMs) }}
        onReset={game.restart}
        onExit={onExit}
      />
      {game.status === "done" ? (
        <WinMessage
          moves={game.elapsedMs}
          score={game.misses}
          best={best}
          note={`${fmt(game.elapsedMs)} · ${game.misses} wrong tap${
            game.misses === 1 ? "" : "s"
          }${best && game.elapsedMs <= best.moves ? " · 🏆 new best!" : ""}`}
          onNewGame={game.restart}
        />
      ) : (
        <>
          <p className="schulte-target" aria-live="polite">
            Find <strong>{game.next}</strong>
          </p>
          <div
            className="schulte-grid"
            style={{ "--cols": game.size }}
            role="group"
            aria-label="Number grid"
          >
            {game.cells.map((value) => (
              <button
                key={value}
                type="button"
                className={`schulte-cell${value < game.next ? " is-found" : ""}`}
                onClick={() => game.tap(value)}
                disabled={value < game.next}
              >
                {value}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}
