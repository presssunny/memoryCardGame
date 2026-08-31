import { GameHeader } from "../../components/GameHeader";
import { LoseMessage } from "../../components/LoseMessage";
import { PhaseOverlay } from "../../components/PhaseOverlay";
import { useSequenceLogic } from "../sequence-recall/useSequenceLogic";
import { useGameResult } from "../shared/useGameResult";
import { TERMINAL_COMMANDS } from "./devMatch.data";

// useSequenceLogic halves its input; give it 16 commands → 8 buttons.
const DECK = [...TERMINAL_COMMANDS];

// Sequence Recall with terminal commands: watch the prompt flash a growing
// list of commands, then click them back in order.
export function TerminalRecallGame({ gameId, bestScores, bestUnit, onExit }) {
  const { cards, phase, round, roundsCompleted, handleCardClick, startNewGame } =
    useSequenceLogic(DECK);

  const best = useGameResult(bestScores, gameId, "default", {
    ended: phase === "lost",
    result: { moves: roundsCompleted, score: roundsCompleted },
    higherIsBetter: true,
  });
  const isNewBest = !best || roundsCompleted > best.moves;

  return (
    <>
      <GameHeader
        title="⌨️ Terminal Recall"
        score={round}
        scoreLabel="Round:"
        best={best}
        bestUnit={bestUnit}
        onReset={startNewGame}
        onExit={onExit}
      />
      {phase === "showing" && (
        <PhaseOverlay title="Watch the sequence…" subtitle={`Round ${round}`} />
      )}
      {phase === "lost" && (
        <LoseMessage
          title="Command not found"
          message={`You recalled ${roundsCompleted} round${
            roundsCompleted === 1 ? "" : "s"
          }.`}
          note={isNewBest ? "🏆 New best!" : undefined}
          onRetry={startNewGame}
        />
      )}
      <div className="terminal-keys" role="group" aria-label="Commands">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            className={`terminal-key${card.isFlipped ? " is-lit" : ""}`}
            disabled={phase !== "input"}
            onClick={() => handleCardClick(card)}
          >
            <code>{card.value}</code>
          </button>
        ))}
      </div>
    </>
  );
}
