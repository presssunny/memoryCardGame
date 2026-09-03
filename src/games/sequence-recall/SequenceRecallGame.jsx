import { useCallback, useEffect } from "react";
import { GameHeader } from "../../components/GameHeader";
import { Card } from "../../components/Card";
import { LoseMessage } from "../../components/LoseMessage";
import { PhaseOverlay } from "../../components/PhaseOverlay";
import { useSound } from "../../components/game-ui";
import { useGameResult } from "../shared/useGameResult";
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
  const { play } = useSound();
  // A pitched blip per position — the tone helps you hold the sequence.
  const onFlash = useCallback((id) => play(`pad-${id % 4}`), [play]);
  const { cards, phase, round, roundsCompleted, handleCardClick, startNewGame } =
    useSequenceLogic(cardValues, { onFlash });

  useEffect(() => {
    if (phase === "lost") play("wrong");
  }, [phase, play]);

  const best = useGameResult(bestScores, gameId, activeThemeId, {
    ended: phase === "lost",
    result: { moves: roundsCompleted, score: roundsCompleted },
    higherIsBetter,
  });
  const isNewBest = !best || roundsCompleted > best.moves;

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
        <PhaseOverlay
          title="Watch closely..."
          subtitle={`Round ${round}`}
          dim={false}
        />
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
