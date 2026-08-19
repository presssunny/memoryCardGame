import { useEffect } from "react";
import { GameHeader } from "../../components/GameHeader";
import { Card } from "../../components/Card";
import { LoseMessage } from "../../components/LoseMessage";
import { PhaseOverlay } from "../../components/PhaseOverlay";
import { useSequenceLogic } from "./useSequenceLogic";

export function SequenceRecallGame({
  gameId,
  cardValues,
  allThemes,
  activeThemeId,
  onThemeChange,
  bestScores,
  higherIsBetter,
  bestUnit,
  onExit,
}) {
  const { cards, phase, round, roundsCompleted, handleCardClick, startNewGame } =
    useSequenceLogic(cardValues);

  const { getBest, recordResult } = bestScores;
  const best = getBest(gameId, activeThemeId);
  const isNewBest = !best || roundsCompleted > best.moves;

  useEffect(() => {
    if (phase !== "lost") return;
    recordResult(
      gameId,
      activeThemeId,
      { moves: roundsCompleted, score: roundsCompleted },
      { higherIsBetter },
    );
  }, [phase, roundsCompleted, gameId, activeThemeId, recordResult, higherIsBetter]);

  return (
    <>
      <GameHeader
        title="🔁 Sequence Recall"
        score={round}
        scoreLabel="Round:"
        best={best}
        bestUnit={bestUnit}
        onReset={startNewGame}
        onExit={onExit}
        allThemes={allThemes}
        activeThemeId={activeThemeId}
        onThemeChange={onThemeChange}
      />
      {phase === "showing" && (
        <PhaseOverlay title="Watch closely..." subtitle={`Round ${round}`} />
      )}
      {phase === "lost" && (
        <LoseMessage
          title="Sequence broken!"
          message={`You correctly repeated ${roundsCompleted} round${
            roundsCompleted === 1 ? "" : "s"
          }.`}
          note={isNewBest ? "🏆 That's your new best!" : undefined}
          onRetry={startNewGame}
        />
      )}
      <div className="cards-grid">
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
    </>
  );
}
