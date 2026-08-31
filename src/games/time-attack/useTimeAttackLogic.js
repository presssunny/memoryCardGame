import { useState } from "react";
import { useMatchingBoard } from "../shared/useMatchingBoard";
import { useCountdown } from "../shared/useCountdown";

export const TIME_LIMIT_SECONDS = 60;

export function useTimeAttackLogic(cardValues) {
  const board = useMatchingBoard(cardValues);
  const { resetBoard, isGameWon } = board;

  const [isTimeUp, setIsTimeUp] = useState(false);

  const { secondsLeft, reset: resetClock } = useCountdown(TIME_LIMIT_SECONDS, {
    running: !isGameWon && !isTimeUp,
    onExpire: () => setIsTimeUp(true),
  });

  const startNewGame = () => {
    resetBoard();
    resetClock();
    setIsTimeUp(false);
  };

  return { ...board, secondsLeft, isTimeUp, startNewGame };
}
