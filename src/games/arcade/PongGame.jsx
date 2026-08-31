import { useCallback, useEffect, useRef, useState } from "react";
import { GameHeader } from "../../components/GameHeader";
import { WinMessage } from "../../components/WinMessage";
import { LoseMessage } from "../../components/LoseMessage";
import { useGameResult } from "../shared/useGameResult";
import { useGameLoop } from "../shared/useGameLoop";
import {
  newPong,
  movePlayer,
  step,
  W,
  H,
  PADDLE_H,
  PADDLE_W,
  BALL_R,
  TARGET,
} from "./pong";

const pct = (n, total) => `${(n / total) * 100}%`;

export function PongGame({ gameId, bestScores, onExit }) {
  const [state, setState] = useState(newPong);
  const boardRef = useRef(null);

  useGameLoop((dt) => setState((s) => step(s, dt)), {
    running: state.status === "playing",
    fps: 60,
  });

  const best = useGameResult(bestScores, gameId, "default", {
    ended: state.status !== "playing",
    result: { moves: state.scoreL, score: state.scoreL - state.scoreR },
    higherIsBetter: true,
  });

  const restart = useCallback(() => setState(newPong()), []);

  const pointerY = useCallback((clientY) => {
    const el = boardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const y = ((clientY - rect.top) / rect.height) * H;
    setState((s) => movePlayer(s, y));
  }, []);

  useEffect(() => {
    const keys = { ArrowUp: -6, ArrowDown: 6, w: -6, s: 6 };
    const onKey = (e) => {
      const d = keys[e.key];
      if (d == null) return;
      e.preventDefault();
      setState((s) => movePlayer(s, s.playerY + d));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <GameHeader
        title="🏓 Pong"
        score={state.scoreL}
        scoreLabel="You:"
        moves={state.scoreR}
        movesLabel="CPU:"
        best={best}
        bestUnit="wins"
        onReset={restart}
        onExit={onExit}
      />
      {state.status === "won" && (
        <WinMessage
          moves={state.scoreL}
          score={state.scoreL - state.scoreR}
          best={best}
          note={`You won ${state.scoreL}–${state.scoreR}!`}
          onNewGame={restart}
        />
      )}
      {state.status === "lost" && (
        <LoseMessage
          title="CPU wins"
          message={`Final score ${state.scoreL}–${state.scoreR}.`}
          onRetry={restart}
        />
      )}
      <div
        ref={boardRef}
        className="pong-board"
        style={{ aspectRatio: `${W} / ${H}` }}
        role="img"
        aria-label={`Pong — ${state.scoreL} to ${state.scoreR}, first to ${TARGET}`}
        onMouseMove={(e) => pointerY(e.clientY)}
        onTouchMove={(e) => pointerY(e.touches[0].clientY)}
      >
        <div className="pong-net" />
        <div
          className="pong-paddle"
          style={{
            left: pct(3, W),
            top: pct(state.playerY - PADDLE_H / 2, H),
            width: pct(PADDLE_W, W),
            height: pct(PADDLE_H, H),
          }}
        />
        <div
          className="pong-paddle pong-paddle--ai"
          style={{
            left: pct(W - 3 - PADDLE_W, W),
            top: pct(state.aiY - PADDLE_H / 2, H),
            width: pct(PADDLE_W, W),
            height: pct(PADDLE_H, H),
          }}
        />
        <div
          className="pong-ball"
          style={{
            left: pct(state.ball.x - BALL_R, W),
            top: pct(state.ball.y - BALL_R, H),
            width: pct(BALL_R * 2, W),
            height: pct(BALL_R * 2, H),
          }}
        />
      </div>
      <p className="arcade-controls">Move the mouse / drag, or ↑ ↓</p>
    </>
  );
}
