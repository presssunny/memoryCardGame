import { useEffect, useRef, useState } from "react";
import { GameHeader } from "../../components/GameHeader";
import { LoseMessage } from "../../components/LoseMessage";
import { GameBoard, useSound } from "../../components/game-ui";
import { useGameResult } from "../shared/useGameResult";
import { useSwipe } from "../shared/useSwipe";
import { useSnake } from "./useSnake";
import { GRID, dirName } from "./snake";

const DPAD = [
  { name: "up", label: "▲", area: "u" },
  { name: "left", label: "◀", area: "l" },
  { name: "right", label: "▶", area: "r" },
  { name: "down", label: "▼", area: "d" },
];

export function SnakeGame({ gameId, bestScores, onExit }) {
  const game = useSnake();
  const { play } = useSound();
  const prevScore = useRef(0);
  const prevLevel = useRef(1);
  const [flash, setFlash] = useState(null); // "level" | "record" | null

  const best = useGameResult(bestScores, gameId, "default", {
    ended: game.status === "over",
    result: { moves: game.score, score: game.score },
    higherIsBetter: true,
  });
  const isRecord = game.score > 0 && (!best || game.score >= best.moves);

  useEffect(() => {
    if (game.score > prevScore.current) {
      prevScore.current = game.score;
      play("score");
    }
    if (game.level > prevLevel.current) {
      prevLevel.current = game.level;
      play("combo");
      setFlash("level");
      const id = setTimeout(() => setFlash(null), 900);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [game.score, game.level, play]);

  useEffect(() => {
    if (game.status === "over") play(isRecord ? "record" : "over");
  }, [game.status, isRecord, play]);

  const swipe = useSwipe(game.turn);

  const headKey = `${game.body[0].x},${game.body[0].y}`;
  const bodyKeys = new Set(game.body.slice(1).map((c) => `${c.x},${c.y}`));
  const tailKey = `${game.body[game.body.length - 1].x},${game.body[game.body.length - 1].y}`;
  const foodKey = game.food ? `${game.food.x},${game.food.y}` : null;
  const heading = dirName(game.dir);

  return (
    <>
      <GameHeader
        title="🐍 Snake"
        score={game.score}
        scoreLabel="Score:"
        moves={game.level}
        movesLabel="Level:"
        best={best}
        bestUnit="score"
        extraStat={{ label: "Speed:", value: `${game.speedTier}/5`, tone: "timer" }}
        onReset={game.restart}
        onExit={onExit}
      />
      {game.status === "over" && (
        <LoseMessage
          title="Game over"
          bigValue={game.score}
          bigLabel="length"
          isRecord={isRecord}
          onRetry={game.restart}
          onExit={onExit}
        />
      )}
      <GameBoard
        className="snake-board-frame"
        caption="Arrows / WASD · Space to pause · swipe on touch"
      >
        <div
          className={`snake-board is-${heading}${
            game.status === "paused" ? " is-paused" : ""
          }`}
          style={{
            gridTemplateColumns: `repeat(${GRID}, 1fr)`,
            gridTemplateRows: `repeat(${GRID}, 1fr)`,
          }}
          role="img"
          aria-label={`Snake — score ${game.score}, level ${game.level}`}
          {...swipe}
        >
          {Array.from({ length: GRID * GRID }, (_, i) => {
            const x = i % GRID;
            const y = Math.floor(i / GRID);
            const key = `${x},${y}`;
            let cls = "";
            if (key === headKey) cls = "is-head";
            else if (key === tailKey && bodyKeys.has(key)) cls = "is-body is-tail";
            else if (bodyKeys.has(key)) cls = "is-body";
            else if (key === foodKey) cls = "is-food";
            return <div key={i} className={`snake-cell ${cls}`.trim()} />;
          })}

          {game.status === "countdown" && (
            <div className="snake-overlay" aria-live="polite">
              <span className="snake-count" key={game.count}>
                {game.count > 0 ? game.count : "Go!"}
              </span>
            </div>
          )}
          {game.status === "paused" && (
            <div className="snake-overlay">
              <span className="snake-overlay-title">Paused</span>
              <span className="snake-overlay-sub">Space or tap to resume</span>
            </div>
          )}
          {flash === "level" && (
            <div className="snake-flash" aria-hidden="true">
              Level {game.level}
            </div>
          )}
        </div>
      </GameBoard>

      <div className="snake-controls">
        <button
          type="button"
          className="snake-pause-btn"
          onClick={game.togglePause}
          disabled={game.status === "over" || game.status === "countdown"}
        >
          {game.status === "paused" ? "▶ Resume" : "⏸ Pause"}
        </button>
        <div className="snake-dpad" role="group" aria-label="Direction pad">
          {DPAD.map((b) => (
            <button
              key={b.name}
              type="button"
              style={{ gridArea: b.area }}
              className="snake-dbtn"
              aria-label={b.name}
              onClick={() => game.turn(b.name)}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
