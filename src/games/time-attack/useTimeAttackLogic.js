import { useState } from "react";
import { useMatchingBoard } from "../shared/useMatchingBoard";
import { useCountdown } from "../shared/useCountdown";
import { useCountIn } from "../shared/useCountIn";

export const TIME_LIMIT_SECONDS = 60;

export function useTimeAttackLogic(cardValues) {
  const board = useMatchingBoard(cardValues);
  const { resetBoard, isGameWon } = board;

  const [isTimeUp, setIsTimeUp] = useState(false);
  // A 3·2·1 count-in so the clock doesn't start before the board is in view.
  const { counting, count, reset: resetCountIn } = useCountIn();

  const { secondsLeft, reset: resetClock } = useCountdown(TIME_LIMIT_SECONDS, {
    running: !isGameWon && !isTimeUp && !counting,
    onExpire: () => setIsTimeUp(true),
  });

  const startNewGame = () => {
    resetBoard();
    resetClock();
    setIsTimeUp(false);
    resetCountIn();
  };

  return { ...board, secondsLeft, isTimeUp, counting, count, startNewGame };
}
