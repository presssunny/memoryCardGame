import { useEffect, useRef, useState } from "react";
import { GameHeader } from "../../components/GameHeader";
import { WinMessage } from "../../components/WinMessage";
import { useGameResult } from "../shared/useGameResult";
import { useTypingTest } from "./useTypingTest";

export function TypingTestGame({ gameId, bestScores, onExit }) {
  const game = useTypingTest();
  const inputRef = useRef(null);
  // Until the player has tapped in (or started typing), a "⌨️ Tap to type"
  // prompt sits over the code — a programmatic focus() on mount raises the
  // keyboard on desktop but not on mobile, so mobile needs a real target.
  // Tracking which line we tapped in for auto-re-arms it on a fresh line.
  const [tappedFor, setTappedFor] = useState(null);
  const focusInput = () => {
    setTappedFor(game.target);
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (game.phase !== "done") inputRef.current?.focus();
  }, [game.phase, game.target]);

  const showTapCta =
    tappedFor !== game.target &&
    game.typed.length === 0 &&
    game.phase !== "done";

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
          bestUnit="wpm"
          note={`${game.result.wpm} WPM · ${game.result.accuracy}% accuracy`}
          onNewGame={game.restart}
        />
      ) : (
        <div
          className="typing-stage"
          onClick={focusInput}
        >
          <p className="typing-hint">
            {showTapCta
              ? "Tap the code to bring up the keyboard"
              : "Type the line below"}
          </p>
          <div className="typing-code-wrap">
            <p className="typing-target" aria-hidden="true">
              {game.chars.map((c, i) => (
                <span key={i} className={`typing-ch typing-ch--${c.state || "todo"}`}>
                  {c.ch === " " ? " " : c.ch}
                </span>
              ))}
            </p>
            {showTapCta && (
              <button type="button" className="typing-cta" onClick={focusInput}>
                <span aria-hidden="true">⌨️</span> Tap to type
              </button>
            )}
          </div>
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
