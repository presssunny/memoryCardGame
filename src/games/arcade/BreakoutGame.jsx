import { useCallback, useEffect, useRef, useState } from "react";
import { GameHeader } from "../../components/GameHeader";
import { WinMessage } from "../../components/WinMessage";
import { LoseMessage } from "../../components/LoseMessage";
import { useGameResult } from "../shared/useGameResult";
import { useGameLoop } from "../shared/useGameLoop";
import { newBreakout, movePaddle, step, W, H, PADDLE_W, PADDLE_Y, BALL_R } from "./breakout";

const pct = (n, total) => `${(n / total) * 100}%`;

export function BreakoutGame({ gameId, bestScores, onExit }) {
  const [state, setState] = useState(newBreakout);
  const boardRef = useRef(null);

  useGameLoop((dt) => setState((s) => step(s, dt)), {
    running: state.status === "playing",
    fps: 60,
  });

  const best = useGameResult(bestScores, gameId, "default", {
    ended: state.status !== "playing",
    result: { moves: state.score, score: state.score },
    higherIsBetter: true,
  });

  const restart = useCallback(() => setState(newBreakout()), []);

  const pointerX = useCallback((clientX) => {
    const el = boardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * W;
    setState((s) => movePaddle(s, x));
  }, []);

  useEffect(() => {
    const keys = { ArrowLeft: -6, ArrowRight: 6, a: -6, d: 6 };
    const onKey = (e) => {
      const delta = keys[e.key];
      if (delta == null) return;
      e.preventDefault();
      setState((s) => movePaddle(s, s.paddleX + delta));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <GameHeader
        title="🧱 Breakout"
        score={state.score}
        scoreLabel="Score:"
        best={best}
        bestUnit="score"
        extraStat={{ label: "Lives:", value: state.lives }}
        onReset={restart}
        onExit={onExit}
      />
      {state.status === "won" && (
        <WinMessage
          moves={state.score}
          score={state.score}
          best={best}
          note="Cleared every brick!"
          onNewGame={restart}
        />
      )}
      {state.status === "over" && (
        <LoseMessage
          title="Out of lives"
          message={`You scored ${state.score}.`}
          note={best && state.score >= best.moves ? "🏆 New high score!" : undefined}
          onRetry={restart}
        />
      )}
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
      <p className="arcade-controls">Move the mouse / drag, or ← →</p>
    </>
  );
}
