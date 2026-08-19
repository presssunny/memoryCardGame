import { useState, useEffect } from "react";

const FLASH_DELAY_MS = 150;
const FLASH_DURATION_MS = 550;
const INPUT_FEEDBACK_MS = 400;

function randomIndex(count) {
  return Math.floor(Math.random() * count);
}

function freshCards(icons) {
  return icons.map((value, id) => ({
    id,
    value,
    isFlipped: false,
    isMatched: false,
  }));
}

// Each theme's cardValues are doubled for pair-matching games; this game
// only needs one of each icon.
function uniqueIcons(cardValues) {
  return cardValues.slice(0, cardValues.length / 2);
}

export function useSequenceLogic(cardValues) {
  const icons = uniqueIcons(cardValues);

  const [cards, setCards] = useState(() => freshCards(icons));
  const [sequence, setSequence] = useState(() => [randomIndex(icons.length)]);
  const [phase, setPhase] = useState("showing"); // "showing" | "input" | "lost"
  const [playbackStep, setPlaybackStep] = useState(0);
  const [inputStep, setInputStep] = useState(0);

  const flipCard = (id, flipped) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: flipped } : c)),
    );
  };

  useEffect(() => {
    if (phase !== "showing") return undefined;

    const cardId = sequence[playbackStep];
    const showTimer = setTimeout(
      () => flipCard(cardId, true),
      FLASH_DELAY_MS,
    );
    const hideTimer = setTimeout(() => {
      flipCard(cardId, false);
      if (playbackStep + 1 < sequence.length) {
        setPlaybackStep((s) => s + 1);
      } else {
        setPlaybackStep(0);
        setInputStep(0);
        setPhase("input");
      }
    }, FLASH_DELAY_MS + FLASH_DURATION_MS);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [phase, playbackStep, sequence]);

  const handleCardClick = (card) => {
    if (phase !== "input") return;

    flipCard(card.id, true);
    setTimeout(() => flipCard(card.id, false), INPUT_FEEDBACK_MS);

    if (card.id !== sequence[inputStep]) {
      setPhase("lost");
      return;
    }

    if (inputStep + 1 < sequence.length) {
      setInputStep((s) => s + 1);
    } else {
      setSequence((prev) => [...prev, randomIndex(icons.length)]);
      setPlaybackStep(0);
      setPhase("showing");
    }
  };

  const startNewGame = () => {
    setCards(freshCards(icons));
    setSequence([randomIndex(icons.length)]);
    setPlaybackStep(0);
    setInputStep(0);
    setPhase("showing");
  };

  // sequence.length is the round currently being shown/attempted; on a
  // loss, every round before that one was completed successfully.
  const round = sequence.length;
  const roundsCompleted = phase === "lost" ? round - 1 : round;

  return {
    cards,
    phase,
    round,
    roundsCompleted,
    handleCardClick,
    startNewGame,
  };
}
