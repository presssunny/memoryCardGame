import { useEffect, useRef } from "react";
import { GameHeader } from "../../components/GameHeader";
import { WinMessage } from "../../components/WinMessage";
import { useGameResult } from "../shared/useGameResult";
import { useTypingTest } from "./useTypingTest";

export function TypingTestGame({ gameId, bestScores, onExit }) {
  const game = useTypingTest();
  const inputRef = useRef(null);

  useEffect(() => {
    if (game.phase !== "done") inputRef.current?.focus();
  }, [game.phase, game.target]);

  const best = useGameResult(bestScores, gameId, "default", {
    ended: game.phase === "done",
    result: { moves: game.result?.wpm ?? 0, score: game.result?.accuracy ?? 0 },
    higherIsBetter: true,
  });

  return (
    <>
      <GameHeader
        title="⌨️ Typing Test"
        score={game.typed.length}
        scoreLabel="Typed:"
        moves={game.target.length}
        movesLabel="of"
        best={best}
        bestUnit="wpm"
        extraStat={{ label: "Errors:", value: game.errors }}
        onReset={game.restart}
        onExit={onExit}
      />
      {game.phase === "done" ? (
        <WinMessage
          moves={game.result.wpm}
          score={game.result.accuracy}
          best={best}
          note={`${game.result.wpm} WPM · ${game.result.accuracy}% accuracy`}
          onNewGame={game.restart}
        />
      ) : (
        <div
          className="typing-stage"
          onClick={() => inputRef.current?.focus()}
        >
          <p className="typing-hint">Type the line below</p>
          <p className="typing-target" aria-hidden="true">
            {game.chars.map((c, i) => (
              <span key={i} className={`typing-ch typing-ch--${c.state || "todo"}`}>
                {c.ch === " " ? " " : c.ch}
              </span>
            ))}
          </p>
          {/* The per-character coloured target is decorative for a screen
              reader; this plain copy is what the input points at. */}
          <p id="typing-target-text" className="sr-only">
            {game.target}
          </p>
          <input
            ref={inputRef}
            className="typing-input"
            type="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            aria-label="Type the code snippet"
            aria-describedby="typing-target-text"
            value={game.typed}
            onChange={(e) => game.setValue(e.target.value)}
          />
        </div>
      )}
    </>
  );
}
