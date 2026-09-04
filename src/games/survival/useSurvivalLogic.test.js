import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSurvivalLogic, MOVE_LIMIT } from "./useSurvivalLogic";

// All-unique values so every pair attempt is guaranteed a mismatch, making
// it easy to drive moves up deterministically without hunting for pairs.
const ALL_UNIQUE = Array.from({ length: 8 }, (_, i) => `v${i}`);

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// Clicks two different-valued (never-matching) cards and lets the mismatch
// resolve. Nothing is ever removed from play, so it's safe to call
// repeatedly to drive `moves` up without ever winning.
function clickMismatch(result) {
  const cards = result.current.cards.filter((c) => !c.isMatched);
  const a = cards[0];
  const b = cards.find((c) => c.id !== a.id && c.value !== a.value);
  act(() => result.current.handleCardClick(a));
  act(() => result.current.handleCardClick(b));
  act(() => vi.advanceTimersByTime(1000)); // mismatch flip-back delay
}

// Clicks the two cards of a still-unmatched pair. Lets the match confirm
// unless `settle` is false, which leaves the attempt pending (isLocked) so
// the test can inspect that window itself.
function clickMatch(result, { settle = true } = {}) {
  const cards = result.current.cards.filter((c) => !c.isMatched);
  const a = cards[0];
  const b = cards.find((c) => c.id !== a.id && c.value === a.value);
  act(() => result.current.handleCardClick(a));
  act(() => result.current.handleCardClick(b));
  if (settle) act(() => vi.advanceTimersByTime(500)); // match confirm delay
}

describe("useSurvivalLogic", () => {
  it("starts with the full move budget available and not out of moves", () => {
    const { result } = renderHook(() => useSurvivalLogic(ALL_UNIQUE));
    expect(result.current.movesLeft).toBe(MOVE_LIMIT);
    expect(result.current.isOutOfMoves).toBe(false);
  });

  it("movesLeft decreases by one per pair attempt", () => {
    const { result } = renderHook(() => useSurvivalLogic(ALL_UNIQUE));
    clickMismatch(result);
    expect(result.current.movesLeft).toBe(MOVE_LIMIT - 1);
  });

  it("never reports a negative movesLeft even past the budget", () => {
    const { result } = renderHook(() => useSurvivalLogic(ALL_UNIQUE));
    // no two ALL_UNIQUE cards ever match, so nothing is ever removed from
    // play -- safe to click well past MOVE_LIMIT to test the floor.
    for (let i = 0; i < MOVE_LIMIT + 3; i++) clickMismatch(result);
    expect(result.current.movesLeft).toBe(0);
  });

  // L8: movesLeft said "0 left" a full move before isOutOfMoves would
  // actually end the game -- the display promised the game was over one
  // attempt before it really was. The move-limit-th attempt (the last one
  // actually allowed) must show 0 immediately, and the game must only end
  // once that attempt finishes resolving -- the same isLocked window that
  // protects a winning final move from a false-loss flash.
  it("shows 0 left exactly on the move-limit-th attempt, ends once it resolves (L8)", () => {
    const { result } = renderHook(() => useSurvivalLogic(ALL_UNIQUE));
    for (let i = 0; i < MOVE_LIMIT - 1; i++) clickMismatch(result);
    expect(result.current.moves).toBe(MOVE_LIMIT - 1);
    expect(result.current.movesLeft).toBe(1);
    expect(result.current.isOutOfMoves).toBe(false);

    // The move-limit-th (last allowed) attempt — click it, but don't let it
    // resolve yet.
    const cards = result.current.cards.filter((c) => !c.isMatched);
    const a = cards[0];
    const b = cards.find((c) => c.id !== a.id && c.value !== a.value);
    act(() => result.current.handleCardClick(a));
    act(() => result.current.handleCardClick(b));

    expect(result.current.moves).toBe(MOVE_LIMIT);
    expect(result.current.movesLeft).toBe(0);
    // Still resolving -- not out of moves yet, exactly like a winning final
    // move isn't prematurely a loss during this same window.
    expect(result.current.isOutOfMoves).toBe(false);

    act(() => vi.advanceTimersByTime(1000)); // mismatch flip-back delay
    expect(result.current.isOutOfMoves).toBe(true); // now it's really over
  });

  it("startNewGame resets moves and clears isOutOfMoves", () => {
    const { result } = renderHook(() => useSurvivalLogic(ALL_UNIQUE));
    clickMismatch(result);
    act(() => result.current.startNewGame());
    expect(result.current.movesLeft).toBe(MOVE_LIMIT);
    expect(result.current.isOutOfMoves).toBe(false);
    expect(result.current.moves).toBe(0);
  });

  // L8: the exact case the original `>` vs `>=` was protecting — a winning
  // final move landing on the move-limit-th attempt must win, never flash
  // a loss. Confirms the isLocked-based fix keeps this guarantee.
  it("a winning final move on the move-limit-th attempt wins, not loses (L8)", () => {
    const PAIRS = ["a", "a", "b", "b"]; // 2 pairs, 4 cards
    const { result } = renderHook(() => useSurvivalLogic(PAIRS));

    for (let i = 0; i < MOVE_LIMIT - 2; i++) clickMismatch(result);
    expect(result.current.moves).toBe(MOVE_LIMIT - 2);

    // Match the first pair — one pair left on the board.
    clickMatch(result);
    expect(result.current.moves).toBe(MOVE_LIMIT - 1);
    expect(result.current.isGameWon).toBe(false);

    // The move-limit-th attempt: only one pair remains, so this is both the
    // last allowed move and the board-completing one.
    clickMatch(result);
    expect(result.current.moves).toBe(MOVE_LIMIT);
    expect(result.current.isGameWon).toBe(true);
    expect(result.current.isOutOfMoves).toBe(false);
  });
});
