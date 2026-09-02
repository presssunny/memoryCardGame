import { useCallback, useEffect, useRef, useState } from "react";
import { GameHeader } from "../../components/GameHeader";
import { WinMessage } from "../../components/WinMessage";
import { LoseMessage } from "../../components/LoseMessage";
import { GameBoard, useSound } from "../../components/game-ui";
import { useGameResult } from "../shared/useGameResult";
import { useGameLoop } from "../shared/useGameLoop";
import { usePaddleKeys } from "./usePaddleKeys";
import { newBreakout, movePaddle, step, W, H, PADDLE_W, PADDLE_Y, BALL_R } from "./breakout";

const pct = (n, total) => `${(n / total) * 100}%`;

export function BreakoutGame({ gameId, bestScores, onExit }) {
  const [state, setState] = useState(newBreakout);
  const boardRef = useRef(null);
  const { play } = useSound();
  const prev = useRef({ score: 0, lives: 3 });

  useGameLoop((dt) => setState((s) => step(s, dt)), {
    running: state.status === "playing",
    fps: 60,
  });

  const best = useGameResult(bestScores, gameId, "default", {
    ended: state.status !== "playing",
    result: { moves: state.score, score: state.score },
    higherIsBetter: true,
  });

  useEffect(() => {
    if (state.score > prev.current.score) play("match");
    if (state.lives < prev.current.lives) play("wrong");
    prev.current = { score: state.score, lives: state.lives };
  }, [state.score, state.lives, play]);

  useEffect(() => {
    if (state.status === "over") play("over");
    if (state.status === "won") play("record");
  }, [state.status, play]);

  const restart = useCallback(() => {
    setState(newBreakout());
    prev.current = { score: 0, lives: 3 };
  }, []);

  const pointerX = useCallback((clientX) => {
    const el = boardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * W;
    setState((s) => movePaddle(s, x));
  }, []);

  usePaddleKeys(
    (d) => setState((s) => movePaddle(s, s.paddleX + d)),
    { axis: "x", speed: 8 },
  );

  const bricksLeft = state.bricks.filter((b) => b.alive).length;

  return (
    <>
      <GameHeader
        title="🧱 Breakout"
        score={state.score}
        scoreLabel="Score:"
        best={best}
        bestUnit="score"
        moves={bricksLeft}
        movesLabel="Bricks:"
        extraStat={{ label: "Lives:", value: state.lives, tone: "lives" }}
        onReset={restart}
        onExit={onExit}
      />
      {state.status === "won" && (
        <WinMessage
          moves={state.score}
          score={state.score}
          best={best}
          note="Every brick cleared!"
          onNewGame={restart}
          onExit={onExit}
        />
      )}
      {state.status === "over" && (
        <LoseMessage
          title="Out of lives"
          bigValue={state.score}
          bigLabel="score"
          isRecord={best && state.score >= best.moves}
          onRetry={restart}
          onExit={onExit}
        />
      )}
      <GameBoard className="breakout-frame" caption="Mouse / drag, or ← → / A D">
        <div
          ref={boardRef}
          className="breakout-board"
          style={{ aspectRatio: `${W} / ${H}` }}
          role="img"
          aria-label={`Breakout — score ${state.score}, ${state.lives} lives`}
          onMouseMove={(e) => pointerX(e.clientX)}
          onTouchMove={(e) => pointerX(e.touches[0].clientX)}
        >
          {state.bricks.map(
            (b, i) =>
              b.alive && (
                <div
                  key={i}
                  className={`breakout-brick row-${b.row}`}
                  style={{
                    left: pct(b.x, W),
                    top: pct(b.y, H),
                    width: pct(b.w, W),
                    height: pct(b.h, H),
                  }}
                />
              ),
          )}
          <div
            className="breakout-ball"
            style={{
              left: pct(state.ball.x - BALL_R, W),
              top: pct(state.ball.y - BALL_R, H),
              width: pct(BALL_R * 2, W),
              height: pct(BALL_R * 2, H),
            }}
          />
          <div
            className="breakout-paddle"
            style={{
              left: pct(state.paddleX - PADDLE_W / 2, W),
              top: pct(PADDLE_Y, H),
              width: pct(PADDLE_W, W),
            }}
          />
        </div>
      </GameBoard>
    </>
  );
}
