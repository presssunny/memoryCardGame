import { useMatchingBoard } from "../shared/useMatchingBoard";

export const MOVE_LIMIT = 18;

export function useSurvivalLogic(cardValues) {
  const board = useMatchingBoard(cardValues);
  const { moves, isGameWon, isLocked, resetBoard } = board;

  const movesLeft = Math.max(MOVE_LIMIT - moves, 0);
  // `moves` increments the instant the 2nd card of an attempt is clicked —
  // before useMatchingBoard's match-confirmation delay resolves isGameWon —
  // so treating a move as "used up" right at that instant would flash a
  // false loss on a winning final move. `isLocked` covers exactly that
  // resolving window (for a match AND a mismatch alike, and it clears in
  // the same state update that sets isGameWon), so gating on it protects
  // the winning move without silently granting an extra, undisplayed
  // attempt on every other move the way a loose `moves > MOVE_LIMIT` did.
  const isOutOfMoves = !isGameWon && !isLocked && moves >= MOVE_LIMIT;

  const startNewGame = () => resetBoard();

  return { ...board, movesLeft, isOutOfMoves, startNewGame };
}
