import { useEffect, useRef, useState } from "react";
import { GameHeader } from "../../components/GameHeader";
import { LoseMessage } from "../../components/LoseMessage";
import { GameBoard, ComboBadge, useSound } from "../../components/game-ui";
import { useGameResult } from "../shared/useGameResult";
import { useWhackAMole } from "./useWhackAMole";

export function WhackAMoleGame({ gameId, bestScores, onExit }) {
  const game = useWhackAMole();
  const { play } = useSound();
  const [fx, setFx] = useState(null); // transient hole feedback

  const best = useGameResult(bestScores, gameId, "default", {
    ended: game.status === "over",
    result: { moves: game.hits, score: game.accuracy },
    higherIsBetter: true,
  });

  // Turn the hook's last event into a short-lived per-hole class + a sound.
  const seen = useRef(null);
  useEffect(() => {
    const ev = game.lastEvent;
    if (!ev || ev.n === seen.current) return undefined;
    seen.current = ev.n;
    setFx(ev);
    play(ev.kind === "hit" ? "score" : "wrong");
    const id = setTimeout(() => setFx(null), 340);
    return () => clearTimeout(id);
  }, [game.lastEvent, play]);

  useEffect(() => {
    if (game.streak > 0 && game.streak % 5 === 0) play("combo");
  }, [game.streak, play]);

  // Desktop: number keys 1–9 map to the 3×3 grid (1 = top-left).
  const whack = game.whack;
  useEffect(() => {
    const onKey = (e) => {
      if (e.key < "1" || e.key > "9") return;
      e.preventDefault();
      whack(Number(e.key) - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [whack]);

  return (
    <>
      <GameHeader
        title="🔨 Whack-a-Mole"
        score={game.hits}
        scoreLabel="Hits:"
        moves={game.streak}
        movesLabel="Streak:"
        best={best}
        bestUnit="hits"
        extraStat={{ label: "Time:", value: `${game.secondsLeft}s`, tone: "timer" }}
        onReset={game.restart}
        onExit={onExit}
      />

      {game.status === "over" && (
        <LoseMessage
          title="Time's up!"
          bigValue={game.hits}
          bigLabel="moles bopped"
          isRecord={best && game.hits >= best.moves}
          meta={[
            { label: "Accuracy", value: `${game.accuracy}%` },
            { label: "Best streak", value: game.bestStreak },
          ]}
          onRetry={game.restart}
          onExit={onExit}
        />
      )}

      <div className="whack-combo-slot">
        <ComboBadge count={game.streak} threshold={3} label="streak" />
      </div>

      <GameBoard
        className="whack-board"
        caption={
          game.status === "ready"
            ? "Tap a hole — or press 1–9 — to start"
            : "Bop the moles! (tap or keys 1–9)"
        }
      >
        <div className="whack-grid" role="group" aria-label="Mole field">
          {Array.from({ length: game.holes }, (_, i) => {
            const up = game.upHoles.has(i);
            const hitFx = fx?.hole === i && fx.kind === "hit";
            const whiffFx = fx?.hole === i && fx.kind === "whiff";
            return (
              <button
                key={i}
                type="button"
                className={`whack-hole${up ? " is-up" : ""}${
                  hitFx ? " is-bonked" : ""
                }${whiffFx ? " is-whiff" : ""}`}
                aria-label={up ? "Mole up" : "Hole"}
                onClick={() => game.whack(i)}
              >
                <span className="whack-mound" aria-hidden="true" />
                <span className="whack-mole" aria-hidden="true">
                  🐹
                </span>
                {hitFx && (
                  <span className="whack-burst" aria-hidden="true">
                    ⭐
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </GameBoard>
    </>
  );
}
