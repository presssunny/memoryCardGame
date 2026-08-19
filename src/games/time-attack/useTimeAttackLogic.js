import { useState, useEffect } from "react";
import { useMatchingBoard } from "../shared/useMatchingBoard";

export const TIME_LIMIT_SECONDS = 60;

export function useTimeAttackLogic(cardValues) {
  const board = useMatchingBoard(cardValues);
  const { resetBoard, isGameWon } = board;

  const [secondsLeft, setSecondsLeft] = useState(TIME_LIMIT_SECONDS);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (isGameWon || isTimeUp) return undefined;

    const timer = setTimeout(() => {
      if (secondsLeft <= 1) {
        setIsTimeUp(true);
      } else {
        setSecondsLeft((s) => s - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft, isGameWon, isTimeUp]);

  const startNewGame = () => {
    resetBoard();
    setSecondsLeft(TIME_LIMIT_SECONDS);
    setIsTimeUp(false);
  };

  return { ...board, secondsLeft, isTimeUp, startNewGame };
}
