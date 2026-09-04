import { useEffect, useRef, useState } from "react";
import { GameHeader } from "../../components/GameHeader";
import { LoseMessage } from "../../components/LoseMessage";
import { GameBoard, useSound } from "../../components/game-ui";
import { useGameResult } from "../shared/useGameResult";
import { useSwipe } from "../shared/useSwipe";
import { use2048 } from "./use2048";

const TILE_CLASS = (v) => (v > 2048 ? "t-super" : `t-${v}`);

export function Game2048({ gameId, bestScores, onExit }) {
  const game = use2048();
  const { play } = useSound();
  const swipe = useSwipe(game.swipe);
  const prevScore = useRef(0);
  const [gain, setGain] = useState(null);

  const best = useGameResult(bestScores, gameId, "default", {
    ended: game.status === "over",
    result: { moves: game.score, score: game.best },
    higherIsBetter: true,
  });

  // Float the points earned on each merge.
  useEffect(() => {
    const delta = game.score - prevScore.current;
    prevScore.current = game.score;
    if (delta > 0) {
      play("match");
      setGain({ value: delta, n: Date.now() });
      const id = setTimeout(() => setGain(null), 800);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [game.score, play]);

  useEffect(() => {
    if (game.status === "over") play("over");
  }, [game.status, play]);

  return (
    <>
      <GameHeader
        title="🔢 2048"
        score={game.score}
        scoreLabel="Score:"
        best={best}
        bestUnit="score"
        extraStat={{ label: "Tile:", value: game.best }}
        onReset={game.restart}
        onExit={onExit}
      />
      {game.status === "over" && (
        <LoseMessage
          title="No moves left"
          bigValue={game.score}
          bigLabel="score"
          isRecord={(!best || game.score >= best.moves) && game.score > 0}
          meta={[{ label: "Best tile", value: game.best }]}
          onRetry={game.restart}
          onExit={onExit}
        />
      )}
      <GameBoard className="g2048-wrap" caption="Arrow keys or WASD · swipe on touch">
        {gain && (
          <span key={gain.n} className="g2048-gain" aria-hidden="true">
            +{gain.value}
          </span>
        )}
        <div
          className="g2048-board"
          role="group"
          aria-label="2048 board — arrow keys, WASD, or swipe"
          {...swipe}
        >
          {game.grid.map((v, i) => (
            <div
              key={i}
              className={`g2048-tile ${v ? TILE_CLASS(v) : "t-empty"}`}
              aria-hidden="true"
            >
              {v || ""}
            </div>
          ))}
        </div>
      </GameBoard>
    </>
  );
}
