import { GameHeader } from "../../components/GameHeader";
import { WinMessage } from "../../components/WinMessage";
import { useGameResult } from "../shared/useGameResult";
import { useWhackAMole } from "./useWhackAMole";

export function WhackAMoleGame({ gameId, bestScores, onExit }) {
  const game = useWhackAMole();

  const best = useGameResult(bestScores, gameId, "default", {
    ended: game.status === "over",
    result: { moves: game.hits, score: game.accuracy },
    higherIsBetter: true,
  });

  return (
    <>
      <GameHeader
        title="🔨 Whack-a-Mole"
        score={game.hits}
        scoreLabel="Hits:"
        best={best}
        bestUnit="hits"
        extraStat={{ label: "Time:", value: `${game.secondsLeft}s` }}
        onReset={game.restart}
        onExit={onExit}
      />
      {game.status === "over" && (
        <WinMessage
          moves={game.hits}
          score={game.accuracy}
          best={best}
          note={`${game.hits} hits · ${game.accuracy}% accuracy`}
          onNewGame={game.restart}
        />
      )}
      <div className="whack-grid" role="group" aria-label="Mole holes">
        {Array.from({ length: game.holes }, (_, i) => {
          const up = game.upHoles.has(i);
          return (
            <button
              key={i}
              type="button"
              className={`whack-hole${up ? " is-up" : ""}`}
              aria-label={up ? "Mole up" : "Hole"}
              onClick={() => game.whack(i)}
            >
              <span className="whack-mole" aria-hidden="true">
                🐹
              </span>
            </button>
          );
        })}
      </div>
      <p className="arcade-controls">
        {game.status === "ready" ? "Tap a hole to start" : "Whack the moles!"}
      </p>
    </>
  );
}
