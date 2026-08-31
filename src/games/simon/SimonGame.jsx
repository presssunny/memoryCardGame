import { GameHeader } from "../../components/GameHeader";
import { LoseMessage } from "../../components/LoseMessage";
import { PhaseOverlay } from "../../components/PhaseOverlay";
import { useSequenceLogic } from "../sequence-recall/useSequenceLogic";
import { useGameResult } from "../shared/useGameResult";
import { PADS, PAD_DECK } from "./simon.data";

// A kids' Simon: the same growing-sequence engine as Sequence Recall
// (useSequenceLogic), drawn as four big colour pads instead of a card grid.
export function SimonGame({ gameId, bestScores, bestUnit, onExit }) {
  const { cards, phase, round, roundsCompleted, handleCardClick, startNewGame } =
    useSequenceLogic(PAD_DECK);

  const best = useGameResult(bestScores, gameId, "default", {
    ended: phase === "lost",
    result: { moves: roundsCompleted, score: roundsCompleted },
    higherIsBetter: true,
  });
  const isNewBest = !best || roundsCompleted > best.moves;

  const padFor = (cardValue) => PADS.find((p) => p.id === cardValue) ?? PADS[0];
  const watching = phase === "showing";

  return (
    <>
      <GameHeader
        title="🟢 Simon"
        score={round}
        scoreLabel="Round:"
        best={best}
        bestUnit={bestUnit}
        onReset={startNewGame}
        onExit={onExit}
      />
      {watching && (
        <PhaseOverlay title="Watch the colours!" subtitle={`Round ${round}`} />
      )}
      {phase === "lost" && (
        <LoseMessage
          title="Oops!"
          message={`You repeated ${roundsCompleted} round${
            roundsCompleted === 1 ? "" : "s"
          }.`}
          note={isNewBest ? "🏆 New best!" : undefined}
          onRetry={startNewGame}
        />
      )}
      <div
        className={`simon-pads${watching ? " is-watching" : ""}`}
        role="group"
        aria-label="Simon pads"
      >
        {cards.map((card) => {
          const pad = padFor(card.value);
          return (
            <button
              key={card.id}
              type="button"
              className={`simon-pad${card.isFlipped ? " is-lit" : ""}`}
              style={{ "--pad": pad.color }}
              aria-label={pad.label}
              disabled={phase !== "input"}
              onClick={() => handleCardClick(card)}
            />
          );
        })}
      </div>
    </>
  );
}
