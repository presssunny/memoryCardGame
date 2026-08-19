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

function clickMismatch(result) {
  const cards = result.current.cards.filter((c) => !c.isMatched);
  const a = cards[0];
  const b = cards.find((c) => c.id !== a.id && c.value !== a.value);
  act(() => result.current.handleCardClick(a));
  act(() => result.current.handleCardClick(b));
  act(() => vi.advanceTimersByTime(1000)); // mismatch flip-back delay
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

  it("stays false at exactly the budget, true once it's exceeded", () => {
    const { result } = renderHook(() => useSurvivalLogic(ALL_UNIQUE));
    for (let i = 0; i < MOVE_LIMIT; i++) clickMismatch(result);
    expect(result.current.moves).toBe(MOVE_LIMIT);
    expect(result.current.isOutOfMoves).toBe(false);

    clickMismatch(result);
    expect(result.current.moves).toBe(MOVE_LIMIT + 1);
    expect(result.current.isOutOfMoves).toBe(true);
  });

  it("startNewGame resets moves and clears isOutOfMoves", () => {
    const { result } = renderHook(() => useSurvivalLogic(ALL_UNIQUE));
    clickMismatch(result);
    act(() => result.current.startNewGame());
    expect(result.current.movesLeft).toBe(MOVE_LIMIT);
    expect(result.current.isOutOfMoves).toBe(false);
    expect(result.current.moves).toBe(0);
  });
});
