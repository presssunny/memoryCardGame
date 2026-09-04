import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMatchingBoard } from "./useMatchingBoard";

// Small, all-unique card set so a 2-pair board is easy to reason about and
// drive to a full win.
const VALUES = ["a", "a", "b", "b"];

function findMismatchPair(cards) {
  const a = cards[0];
  const b = cards.find((c) => c.value !== a.value);
  return [a, b];
}

function findMatchPair(cards) {
  const a = cards[0];
  const b = cards.find((c) => c.id !== a.id && c.value === a.value);
  return [a, b];
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useMatchingBoard: initial deal", () => {
  it("deals one card per value, face-down by default", () => {
    const { result } = renderHook(() => useMatchingBoard(VALUES));
    expect(result.current.cards).toHaveLength(4);
    expect(result.current.cards.every((c) => c.isFlipped === false)).toBe(
      true,
    );
    expect(result.current.cards.every((c) => c.isMatched === false)).toBe(
      true,
    );
    expect(result.current.score).toBe(0);
    expect(result.current.moves).toBe(0);
    expect(result.current.isGameWon).toBe(false);
  });

  it("deals face-up when initialFlipped is true", () => {
    const { result } = renderHook(() =>
      useMatchingBoard(VALUES, { initialFlipped: true }),
    );
    expect(result.current.cards.every((c) => c.isFlipped === true)).toBe(
      true,
    );
  });

  it("assigns every card a unique id covering the full board", () => {
    const { result } = renderHook(() => useMatchingBoard(VALUES));
    const ids = result.current.cards.map((c) => c.id).sort((a, b) => a - b);
    expect(ids).toEqual([0, 1, 2, 3]);
  });
});

describe("useMatchingBoard: streak + mismatch feedback", () => {
  it("builds a streak on consecutive matches and breaks it on a mismatch", () => {
    const { result } = renderHook(() => useMatchingBoard(["a", "a", "b", "b"]));

    // First pair — a match.
    let [a, b] = findMatchPair(result.current.cards);
    act(() => result.current.handleCardClick(a));
    act(() => result.current.handleCardClick(b));
    act(() => vi.advanceTimersByTime(500));
    expect(result.current.streak).toBe(1);
    expect(result.current.bestStreak).toBe(1);

    // Second pair — also a match.
    const rest = result.current.cards.filter((c) => !c.isMatched);
    act(() => result.current.handleCardClick(rest[0]));
    act(() => result.current.handleCardClick(rest[1]));
    act(() => vi.advanceTimersByTime(500));
    expect(result.current.streak).toBe(2);
    expect(result.current.bestStreak).toBe(2);
  });

  it("exposes the mismatched pair while it resolves, then clears it", () => {
    const { result } = renderHook(() => useMatchingBoard(["a", "a", "b", "b"]));
    const [a, b] = findMismatchPair(result.current.cards);
    act(() => result.current.handleCardClick(a));
    act(() => result.current.handleCardClick(b));
    expect(result.current.mismatchedCards.sort()).toEqual([a.id, b.id].sort());
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.mismatchedCards).toEqual([]);
    expect(result.current.streak).toBe(0);
  });
});

describe("useMatchingBoard: mismatched pair", () => {
  it("flips both back down after the delay, counts one move, no score", () => {
    const { result } = renderHook(() => useMatchingBoard(VALUES));
    const [a, b] = findMismatchPair(result.current.cards);

    act(() => result.current.handleCardClick(a));
    act(() => result.current.handleCardClick(b));

    expect(result.current.moves).toBe(1);
    expect(result.current.score).toBe(0);
    expect(
      result.current.cards.filter((c) => c.isFlipped).map((c) => c.id).sort(),
    ).toEqual([a.id, b.id].sort());

    act(() => vi.advanceTimersByTime(1000));

    expect(result.current.cards.every((c) => !c.isFlipped)).toBe(true);
    expect(result.current.cards.every((c) => !c.isMatched)).toBe(true);
  });

  it("ignores a third click while the mismatch is resolving", () => {
    const { result } = renderHook(() => useMatchingBoard(VALUES));
    const cards = result.current.cards;
    const [a, b] = findMismatchPair(cards);
    const c = cards.find((c) => c.id !== a.id && c.id !== b.id);

    act(() => result.current.handleCardClick(a));
    act(() => result.current.handleCardClick(b));
    act(() => result.current.handleCardClick(c));

    expect(result.current.cards.find((x) => x.id === c.id).isFlipped).toBe(
      false,
    );
    expect(result.current.moves).toBe(1);
  });
});

describe("useMatchingBoard: matching pair", () => {
  it("marks both matched, scores, and shows a message after the delay", () => {
    const { result } = renderHook(() => useMatchingBoard(VALUES));
    const [a, b] = findMatchPair(result.current.cards);

    act(() => result.current.handleCardClick(a));
    act(() => result.current.handleCardClick(b));
    act(() => vi.advanceTimersByTime(500));

    expect(result.current.score).toBe(1);
    expect(result.current.moves).toBe(1);
    expect(result.current.matchMessage).toBe("You found a match!");
    expect(
      result.current.cards.filter((c) => c.isMatched).map((c) => c.id).sort(),
    ).toEqual([a.id, b.id].sort());
  });

  it("uses a custom matchMessage when given, instead of the hardcoded English default (L4)", () => {
    const { result } = renderHook(() =>
      useMatchingBoard(VALUES, { matchMessage: "מצאתם זוג!" }),
    );
    const [a, b] = findMatchPair(result.current.cards);

    act(() => result.current.handleCardClick(a));
    act(() => result.current.handleCardClick(b));
    act(() => vi.advanceTimersByTime(500));

    expect(result.current.matchMessage).toBe("מצאתם זוג!");
  });

  it("clears the match message after its own delay", () => {
    const { result } = renderHook(() => useMatchingBoard(VALUES));
    const [a, b] = findMatchPair(result.current.cards);

    act(() => result.current.handleCardClick(a));
    act(() => result.current.handleCardClick(b));
    act(() => vi.advanceTimersByTime(500));
    expect(result.current.matchMessage).not.toBe("");

    act(() => vi.advanceTimersByTime(2000));
    expect(result.current.matchMessage).toBe("");
  });

  it("wins once every pair has been matched", () => {
    const { result } = renderHook(() => useMatchingBoard(VALUES));

    let [a, b] = findMatchPair(result.current.cards);
    act(() => result.current.handleCardClick(a));
    act(() => result.current.handleCardClick(b));
    act(() => vi.advanceTimersByTime(500));
    expect(result.current.isGameWon).toBe(false);

    [a, b] = findMatchPair(result.current.cards.filter((c) => !c.isMatched));
    act(() => result.current.handleCardClick(a));
    act(() => result.current.handleCardClick(b));
    act(() => vi.advanceTimersByTime(500));

    expect(result.current.isGameWon).toBe(true);
    expect(result.current.score).toBe(2);
  });
});

describe("useMatchingBoard: click guards", () => {
  it("ignores clicking an already-flipped card again", () => {
    const { result } = renderHook(() => useMatchingBoard(VALUES));
    const id = result.current.cards[0].id;

    act(() => result.current.handleCardClick(result.current.cards[0]));
    // re-read: the card object from before the click is now stale
    act(() =>
      result.current.handleCardClick(
        result.current.cards.find((c) => c.id === id),
      ),
    );

    // still only one card flipped, no move counted from the second click
    expect(result.current.cards.filter((c) => c.isFlipped)).toHaveLength(1);
    expect(result.current.moves).toBe(0);
  });

  it("ignores clicking a matched card", () => {
    const { result } = renderHook(() => useMatchingBoard(VALUES));
    const [a, b] = findMatchPair(result.current.cards);
    act(() => result.current.handleCardClick(a));
    act(() => result.current.handleCardClick(b));
    act(() => vi.advanceTimersByTime(500));

    act(() => result.current.handleCardClick(result.current.cards[0]));
    expect(result.current.moves).toBe(1); // unchanged
  });
});

// Regression coverage for the confirmed board-corruption bug: restarting
// (or unmounting, e.g. leaving the game / switching theme) while a
// match/mismatch resolution timeout is still pending must not let that
// stale callback mutate the board it no longer describes.
describe("useMatchingBoard: resetBoard cancels in-flight resolution", () => {
  it("a pending mismatch resolution does not resurrect after resetBoard", () => {
    const { result } = renderHook(() => useMatchingBoard(VALUES));
    const [a, b] = findMismatchPair(result.current.cards);

    act(() => result.current.handleCardClick(a));
    act(() => result.current.handleCardClick(b));
    // still mid-resolution (1000ms delay not yet elapsed)
    act(() => result.current.resetBoard());

    // advance well past when the stale timeout would have fired
    act(() => vi.advanceTimersByTime(2000));

    expect(result.current.moves).toBe(0);
    expect(result.current.score).toBe(0);
    expect(result.current.cards.every((c) => !c.isFlipped)).toBe(true);
    expect(result.current.cards.every((c) => !c.isMatched)).toBe(true);
  });

  it("a pending match resolution does not resurrect after resetBoard", () => {
    const { result } = renderHook(() => useMatchingBoard(VALUES));
    const [a, b] = findMatchPair(result.current.cards);

    act(() => result.current.handleCardClick(a));
    act(() => result.current.handleCardClick(b));
    // still mid-resolution (500ms delay not yet elapsed)
    act(() => result.current.resetBoard());

    act(() => vi.advanceTimersByTime(2000));

    expect(result.current.moves).toBe(0);
    expect(result.current.score).toBe(0);
    expect(result.current.cards.every((c) => !c.isMatched)).toBe(true);
  });

  it("cancels pending resolution on unmount instead of updating unmounted state", () => {
    const { result, unmount } = renderHook(() => useMatchingBoard(VALUES));
    const [a, b] = findMismatchPair(result.current.cards);

    act(() => result.current.handleCardClick(a));
    act(() => result.current.handleCardClick(b));

    const errors = [];
    const originalError = console.error;
    console.error = (...args) => errors.push(args.join(" "));

    unmount();
    act(() => vi.advanceTimersByTime(2000));

    console.error = originalError;
    expect(errors.join("\n")).not.toMatch(/state update.*unmounted/i);
  });
});
