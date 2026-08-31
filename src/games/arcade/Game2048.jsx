import { useRef } from "react";
import { GameHeader } from "../../components/GameHeader";
import { LoseMessage } from "../../components/LoseMessage";
import { useGameResult } from "../shared/useGameResult";
import { use2048 } from "./use2048";

const TILE_CLASS = (v) => (v > 2048 ? "t-super" : `t-${v}`);

export function Game2048({ gameId, bestScores, onExit }) {
  const game = use2048();
  const startRef = useRef(null);

  const best = useGameResult(bestScores, gameId, "default", {
    ended: game.status === "over",
    result: { moves: game.score, score: game.best },
    higherIsBetter: true,
  });

  // Touch swipe.
  const onTouchStart = (e) => {
    const t = e.touches[0];
    startRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    if (!startRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - startRef.current.x;
    const dy = t.clientY - startRef.current.y;
    startRef.current = null;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) game.swipe(dx > 0 ? "right" : "left");
    else game.swipe(dy > 0 ? "down" : "up");
  };

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
          message={`Score ${game.score} · best tile ${game.best}.`}
          note={best && game.score >= best.moves ? "🏆 New high score!" : undefined}
          onRetry={game.restart}
        />
      )}
      <div
        className="g2048-board"
        role="group"
        aria-label="2048 board — use the arrow keys"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {game.grid.map((v, i) => (
          <div key={i} className={`g2048-tile ${v ? TILE_CLASS(v) : "t-empty"}`}>
            {v || ""}
          </div>
        ))}
      </div>
      <p className="arcade-controls">Arrow keys or WASD · swipe on touch</p>
    </>
  );
}
