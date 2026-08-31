import { GameHeader } from "../../components/GameHeader";
import { LoseMessage } from "../../components/LoseMessage";
import { useGameResult } from "../shared/useGameResult";
import { useSnake } from "./useSnake";
import { GRID } from "./snake";

const DPAD = [
  { name: "up", label: "▲", area: "u" },
  { name: "left", label: "◀", area: "l" },
  { name: "right", label: "▶", area: "r" },
  { name: "down", label: "▼", area: "d" },
];

export function SnakeGame({ gameId, bestScores, onExit }) {
  const game = useSnake();

  const best = useGameResult(bestScores, gameId, "default", {
    ended: game.status === "over",
    result: { moves: game.score, score: game.score },
    higherIsBetter: true,
  });

  const headKey = `${game.body[0].x},${game.body[0].y}`;
  const bodyKeys = new Set(game.body.slice(1).map((c) => `${c.x},${c.y}`));
  const foodKey = game.food ? `${game.food.x},${game.food.y}` : null;

  return (
    <>
      <GameHeader
        title="🐍 Snake"
        score={game.score}
        scoreLabel="Score:"
        best={best}
        bestUnit="score"
        onReset={game.restart}
        onExit={onExit}
      />
      {game.status === "over" && (
        <LoseMessage
          title="Game over"
          message={`You scored ${game.score}.`}
          note={best && game.score >= best.moves ? "🏆 New high score!" : undefined}
          onRetry={game.restart}
        />
      )}
      <div
        className="snake-board"
        style={{ "--grid": GRID }}
        role="img"
        aria-label={`Snake — score ${game.score}`}
      >
        {Array.from({ length: GRID * GRID }, (_, i) => {
          const x = i % GRID;
          const y = Math.floor(i / GRID);
          const key = `${x},${y}`;
          const cls =
            key === headKey
              ? "is-head"
              : bodyKeys.has(key)
                ? "is-body"
                : key === foodKey
                  ? "is-food"
                  : "";
          return <div key={i} className={`snake-cell ${cls}`.trim()} />;
        })}
      </div>
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
      <p className="arcade-controls">Arrow keys / WASD, or the pad</p>
    </>
  );
}
