import { useState, useCallback, useRef, useEffect } from "react";

const MATCH_CONFIRM_DELAY_MS = 500;
const MATCH_MESSAGE_DURATION_MS = 2000;
const MISMATCH_FLIP_BACK_DELAY_MS = 1000;

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Core flip/match/score engine shared by every matching-pairs game. Games
// differ in when cards start face-up vs face-down and what happens around
// that (compare MemoryMatchGame with SpeedMatchGame), but the
// click-two-cards, check-for-a-match, score-and-lock behavior below is
// identical between them, so it lives here once instead of being
// copy-pasted per game.
//
// `initialFlipped` controls whether a freshly dealt board starts face-up
// (Speed Match's memorize phase) or face-down (Memory Match's default).
// `face` decides how <Card> draws each card's revealed side:
//   "image" (default) — card.value is an icon URL (the themed games)
//   "pic"             — card.value is a kids-asset id (Animal Match)
//   "emoji"           — card.value is an emoji
//   "text"            — card.value is a word/code string
// Matching is always on card.value, so a `pairKey` can differ from the
// face for asymmetric pairs (Git Command Match: command ↔ description).
export const useMatchingBoard = (
  cardValues,
  { initialFlipped = false, face = "image" } = {},
) => {
  const buildDeck = useCallback(
    (flipped) => {
      const shuffled = shuffleArray(cardValues);
      return shuffled.map((entry, index) => {
        const isPair = entry !== null && typeof entry === "object";
        const value = isPair ? entry.value : entry;
        const faceValue = isPair && entry.face !== undefined ? entry.face : value;
        const card = {
          id: index,
          value,
          isFlipped: flipped,
          isMatched: false,
        };
        if (isPair && entry.faceLabel) card.faceLabel = entry.faceLabel;
        if (face === "emoji") card.emoji = faceValue;
        else if (face === "pic") card.pic = faceValue;
        else if (face === "text") card.text = faceValue;
        return card;
      });
    },
    [cardValues, face],
  );

  const [cards, setCards] = useState(() => buildDeck(initialFlipped));
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [matchMessage, setMatchMessage] = useState("");
  // Consecutive matches with no mismatch in between — drives the combo badge.
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  // The two card ids from the most recent mismatch, so the UI can shake
  // them; cleared when they flip back.
  const [mismatchedCards, setMismatchedCards] = useState([]);

  // Match/mismatch resolution runs on setTimeout, outside React's own
  // lifecycle. Every timer scheduled below is tracked here so a restart or
  // an unmount (leaving the game, switching theme) can cancel whatever is
  // still pending instead of letting a stale callback fire later and mutate
  // a board it no longer describes.
  const pendingTimeouts = useRef([]);

  const trackTimeout = useCallback((fn, delay) => {
    const id = setTimeout(() => {
      pendingTimeouts.current = pendingTimeouts.current.filter(
        (t) => t !== id,
      );
      fn();
    }, delay);
    pendingTimeouts.current.push(id);
    return id;
  }, []);

  const clearPendingTimeouts = useCallback(() => {
    pendingTimeouts.current.forEach(clearTimeout);
    pendingTimeouts.current = [];
  }, []);

  // Cancel any in-flight resolution when the component unmounts (back to
  // menu, or a theme switch that remounts this game with a new key).
  useEffect(() => clearPendingTimeouts, [clearPendingTimeouts]);

  // Deals a fresh shuffled board and resets every counter. `flipped`
  // defaults to this board's own starting face state; a game can pass
  // `true`/`false` explicitly to override it (Speed Match's "New Game"
  // wants the next board to start revealed again, just like the first).
  const resetBoard = useCallback(
    (flipped = initialFlipped) => {
      clearPendingTimeouts();
      setCards(buildDeck(flipped));
      setIsLocked(false);
      setMoves(0);
      setScore(0);
      setMatchMessage("");
      setMatchedCards([]);
      setFlippedCards([]);
      setStreak(0);
      setBestStreak(0);
      setMismatchedCards([]);
    },
    [buildDeck, initialFlipped, clearPendingTimeouts],
  );

  // Flips every unmatched card face-up or face-down at once, without
  // touching score/moves/matched state. Used by games that reveal the
  // board on a timer instead of one card at a time (e.g. Speed Match).
  const setAllFaceState = useCallback((flipped) => {
    setCards((prev) =>
      prev.map((c) => (c.isMatched ? c : { ...c, isFlipped: flipped })),
    );
  }, []);

  const handleCardClick = useCallback(
    (card) => {
      if (
        card.isFlipped ||
        card.isMatched ||
        isLocked ||
        flippedCards.length === 2
      ) {
        return;
      }

      const newCards = cards.map((c) => {
        if (c.id === card.id) {
          return { ...c, isFlipped: true };
        } else {
          return c;
        }
      });
      setCards(newCards);

      const newFlippedCards = [...flippedCards, card.id];
      setFlippedCards(newFlippedCards);

      if (flippedCards.length === 1) {
        setIsLocked(true);

        const firstCard = cards.find((c) => c.id === flippedCards[0]);

        if (firstCard.value === card.value) {
          trackTimeout(() => {
            setMatchedCards((prev) => [...prev, firstCard.id, card.id]);
            setScore((prev) => prev + 1);
            setStreak((prev) => {
              const next = prev + 1;
              setBestStreak((b) => Math.max(b, next));
              return next;
            });
            setCards((prev) =>
              prev.map((c) => {
                if (c.id === card.id || c.id === firstCard.id) {
                  return { ...c, isMatched: true };
                } else {
                  return c;
                }
              }),
            );

            setFlippedCards([]);
            setIsLocked(false);
            setMatchMessage("You found a match!");
            trackTimeout(() => {
              setMatchMessage("");
            }, MATCH_MESSAGE_DURATION_MS);
          }, MATCH_CONFIRM_DELAY_MS);
        } else {
          setStreak(0);
          setMismatchedCards(newFlippedCards);
          trackTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                newFlippedCards.includes(c.id)
                  ? { ...c, isFlipped: false }
                  : c,
              ),
            );
            setFlippedCards([]);
            setMismatchedCards([]);
            setIsLocked(false);
          }, MISMATCH_FLIP_BACK_DELAY_MS);
        }

        setMoves((prev) => prev + 1);
      }
    },
    [cards, flippedCards, isLocked, trackTimeout],
  );

  const isGameWon = matchedCards.length === cardValues.length;

  return {
    cards,
    score,
    moves,
    isGameWon,
    matchMessage,
    isLocked,
    streak,
    bestStreak,
    mismatchedCards,
    resetBoard,
    setAllFaceState,
    handleCardClick,
  };
};
