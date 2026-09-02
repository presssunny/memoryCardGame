import { useCallback, useEffect, useRef, useState } from "react";
import { GameHeader } from "../../components/GameHeader";
import { WinMessage } from "../../components/WinMessage";
import { LoseMessage } from "../../components/LoseMessage";
import { DifficultyPills, useSound } from "../../components/game-ui";
import { useGameResult } from "../shared/useGameResult";
import { useGameLoop } from "../shared/useGameLoop";
import {
  newPong,
  movePlayer,
  step,
  DIFFICULTIES,
  W,
  H,
  PADDLE_H,
  PADDLE_W,
  BALL_R,
  TARGET,
} from "./pong";

const pct = (n, total) => `${(n / total) * 100}%`;

export function PongGame({ gameId, bestScores, onExit }) {
  const [difficulty, setDifficulty] = useState("normal");
  const [state, setState] = useState(() => newPong("normal"));
  const [countdown, setCountdown] = useState(3);
  const boardRef = useRef(null);
  const { play } = useSound();
  const prevScores = useRef({ l: 0, r: 0 });

  useGameLoop((dt) => setState((s) => step(s, dt)), {
    running: state.status === "playing" && countdown <= 0,
    fps: 60,
  });

  // Keyed by difficulty so an Easy win can't overwrite a Hard best.
  const best = useGameResult(bestScores, gameId, difficulty, {
    ended: state.status !== "playing",
    result: { moves: state.scoreL, score: state.scoreL - state.scoreR },
    higherIsBetter: true,
  });

  useEffect(() => {
    if (countdown <= 0) return undefined;
    const id = setTimeout(() => setCountdown((c) => c - 1), 650);
    return () => clearTimeout(id);
  }, [countdown]);

  // A short chime when either side scores.
  useEffect(() => {
    const p = prevScores.current;
    if (state.scoreL !== p.l || state.scoreR !== p.r) {
      if (state.status === "playing") play("score");
      prevScores.current = { l: state.scoreL, r: state.scoreR };
    }
  }, [state.scoreL, state.scoreR, state.status, play]);

  const restart = useCallback(() => {
    setState(newPong(difficulty));
    setCountdown(3);
    prevScores.current = { l: 0, r: 0 };
  }, [difficulty]);

  const chooseDifficulty = useCallback((level) => {
    setDifficulty(level);
    setState(newPong(level));
    setCountdown(3);
    prevScores.current = { l: 0, r: 0 };
  }, []);

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

  const counting = countdown > 0 && state.status === "playing";

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
          score={state.scoreL}
          scoreLabel="your points"
          best={best}
          note={`You beat the ${difficulty} CPU ${state.scoreL}–${state.scoreR}.`}
          onNewGame={restart}
          onExit={onExit}
        />
      )}
      {state.status === "lost" && (
        <LoseMessage
          title="CPU wins"
          bigValue={state.scoreL}
          bigLabel="your points"
          note={`Final score ${state.scoreL}–${state.scoreR}.`}
          onRetry={restart}
          onExit={onExit}
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
        <div className="pong-scoreboard" aria-hidden="true">
          <span>{state.scoreL}</span>
          <span>{state.scoreR}</span>
        </div>
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
        {counting && (
          <div className="pong-countdown" aria-hidden="true">
            {countdown}
          </div>
        )}
      </div>
      <div className="pong-controls-row">
        <DifficultyPills
          options={DIFFICULTIES}
          value={difficulty}
          onChange={chooseDifficulty}
        />
      </div>
      <p className="arcade-controls">Move the mouse / drag, or ↑ ↓ · first to {TARGET}</p>
    </>
  );
}
