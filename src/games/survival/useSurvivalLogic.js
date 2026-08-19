import { useMatchingBoard } from "../shared/useMatchingBoard";

export const MOVE_LIMIT = 18;

export function useSurvivalLogic(cardValues) {
  const board = useMatchingBoard(cardValues);
  const { moves, isGameWon, resetBoard } = board;

  const movesLeft = Math.max(MOVE_LIMIT - moves, 0);
  // ">" rather than ">=": the move that completes the last pair increments
  // `moves` to exactly MOVE_LIMIT before the match-confirmation timeout has
  // resolved isGameWon, so ">=" would flash a false loss on a winning move.
  const isOutOfMoves = !isGameWon && moves > MOVE_LIMIT;

  const startNewGame = () => resetBoard();

  return { ...board, movesLeft, isOutOfMoves, startNewGame };
}
