import { useMatchingBoard } from "../shared/useMatchingBoard";

// Memory Match is the plain case of the shared matching-board engine: cards
// start face-down and the player flips them two at a time. This wrapper
// only exists to keep this game's external API (`initializeGame` instead
// of `resetBoard`) exactly as it was before the shared engine was
// extracted, so MemoryMatchGame didn't need to change at all.
export const useGameLogic = (cardValues) => {
  const { cards, score, moves, isGameWon, matchMessage, resetBoard, handleCardClick } =
    useMatchingBoard(cardValues);

  return {
    cards,
    score,
    moves,
    isGameWon,
    matchMessage,
    // Wrapped instead of aliasing `resetBoard` directly: this is used as a
    // <button onClick> handler, which would otherwise pass the click event
    // as `resetBoard`'s first (optional) argument.
    initializeGame: () => resetBoard(),
    handleCardClick,
  };
};
