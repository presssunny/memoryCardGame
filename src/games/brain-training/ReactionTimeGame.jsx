import { useEffect } from "react";
import { GameHeader } from "../../components/GameHeader";
import { WinMessage } from "../../components/WinMessage";
import { useGameResult } from "../shared/useGameResult";
import { useReactionTime } from "./useReactionTime";

const COPY = {
  idle: { cls: "wait", title: "Tap to start", sub: "Wait for green, then tap or press Space" },
  waiting: { cls: "wait", title: "Wait…", sub: "…for it…" },
  go: { cls: "go", title: "TAP!", sub: "" },
  result: { cls: "result", title: "", sub: "Tap or Space for the next one" },
  early: { cls: "early", title: "Too soon!", sub: "Wait for green. Tap to try again" },
};

export function ReactionTimeGame({ gameId, bestScores, onExit }) {
  const game = useReactionTime();

  // Space / Enter is the reaction key — same as tapping the pad.
  const { press, phase } = game;
  useEffect(() => {
    if (phase === "done") return undefined;
    const onKey = (e) => {
      if (e.repeat || (e.key !== " " && e.key !== "Enter")) return;
      e.preventDefault();
      press();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press, phase]);

  // Lower is better; store the best single reaction.
  const best = useGameResult(bestScores, gameId, "default", {
    ended: game.phase === "done",
    result: { moves: game.best ?? 0, score: game.average ?? 0 },
    higherIsBetter: false,
  });

  const view = COPY[game.phase] ?? COPY.idle;

  return (
    <>
      <GameHeader
        title="⚡ Reaction Time"
        score={game.trial}
        scoreLabel="Trial:"
        moves={game.trials}
        movesLabel="of"
        best={best}
        bestUnit="ms"
        extraStat={
          game.lastMs != null ? { label: "Last:", value: `${game.lastMs} ms` } : undefined
        }
        onReset={game.restart}
        onExit={onExit}
      />
      {game.phase === "done" ? (
        <WinMessage
          moves={game.best}
          score={game.average}
          best={best}
          note={`Best ${game.best} ms · average ${game.average} ms`}
          onNewGame={game.restart}
        />
      ) : (
        <button
          type="button"
          className={`reaction-pad reaction-pad--${view.cls}`}
          onClick={game.press}
        >
          <span className="reaction-title">
            {game.phase === "result" ? `${game.lastMs} ms` : view.title}
          </span>
          {view.sub && <span className="reaction-sub">{view.sub}</span>}
        </button>
      )}
    </>
  );
}
