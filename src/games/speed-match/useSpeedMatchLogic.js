import { useState, useEffect } from "react";
import { useMatchingBoard } from "../shared/useMatchingBoard";

export const MEMORIZE_SECONDS = 3;
export const COUNTDOWN_SECONDS = 3;

// Speed Match reuses the same click/match/score engine Memory Match uses
// (via useMatchingBoard) and wraps it in a phase machine:
//
//   "memorize"  -> board dealt face-up, player studies it
//   "countdown" -> a visible 3-2-1 warning right before cards hide
//   "playing"   -> cards flipped face-down, player finds pairs from memory
//
// isGameWon (from useMatchingBoard) covers the implicit fourth state: won.
export function useSpeedMatchLogic(cardValues) {
  const board = useMatchingBoard(cardValues, { initialFlipped: true });
  const { resetBoard, setAllFaceState } = board;

  const [phase, setPhase] = useState("memorize");
  const [secondsLeft, setSecondsLeft] = useState(MEMORIZE_SECONDS);

  useEffect(() => {
    if (phase !== "memorize" && phase !== "countdown") return undefined;

    const timer = setTimeout(() => {
      if (secondsLeft > 1) {
        setSecondsLeft((s) => s - 1);
      } else if (phase === "memorize") {
        setPhase("countdown");
        setSecondsLeft(COUNTDOWN_SECONDS);
      } else {
        setAllFaceState(false);
        setPhase("playing");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, secondsLeft, setAllFaceState]);

  // Deals a fresh board revealed face-up and restarts the memorize phase —
  // used for both "Restart Game" and the win screen's "New Game".
  const startNewGame = () => {
    resetBoard(true);
    setPhase("memorize");
    setSecondsLeft(MEMORIZE_SECONDS);
  };

  return { ...board, phase, secondsLeft, startNewGame };
}
