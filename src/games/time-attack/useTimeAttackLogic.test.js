import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTimeAttackLogic, TIME_LIMIT_SECONDS } from "./useTimeAttackLogic";

const VALUES = ["a", "a", "b", "b"];

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// Each tick's setTimeout is only (re)scheduled once React flushes the
// effect that runs after the previous tick's state update, so a single
// large advance can outrun timers that don't exist yet -- advance one
// second per act() instead (same pattern as the Sequence Recall tests).
function tickSeconds(n) {
  for (let i = 0; i < n; i++) {
    act(() => vi.advanceTimersByTime(1000));
  }
}

describe("useTimeAttackLogic", () => {
  it("starts with the full time limit and not timed out", () => {
    const { result } = renderHook(() => useTimeAttackLogic(VALUES));
    expect(result.current.secondsLeft).toBe(TIME_LIMIT_SECONDS);
    expect(result.current.isTimeUp).toBe(false);
  });

  it("ticks down by one per second", () => {
    const { result } = renderHook(() => useTimeAttackLogic(VALUES));
    tickSeconds(1);
    expect(result.current.secondsLeft).toBe(TIME_LIMIT_SECONDS - 1);
  });

  it("sets isTimeUp once the clock reaches zero, without going negative", () => {
    const { result } = renderHook(() => useTimeAttackLogic(VALUES));
    tickSeconds(TIME_LIMIT_SECONDS);
    expect(result.current.isTimeUp).toBe(true);
    expect(result.current.secondsLeft).toBeGreaterThanOrEqual(0);
  });

  it("stops ticking once time is up (no further countdown)", () => {
    const { result } = renderHook(() => useTimeAttackLogic(VALUES));
    tickSeconds(TIME_LIMIT_SECONDS);
    const secondsAtTimeUp = result.current.secondsLeft;
    tickSeconds(5);
    expect(result.current.secondsLeft).toBe(secondsAtTimeUp);
  });

  it("startNewGame resets the clock and clears isTimeUp", () => {
    const { result } = renderHook(() => useTimeAttackLogic(VALUES));
    tickSeconds(TIME_LIMIT_SECONDS);
    expect(result.current.isTimeUp).toBe(true);

    act(() => result.current.startNewGame());
    expect(result.current.isTimeUp).toBe(false);
    expect(result.current.secondsLeft).toBe(TIME_LIMIT_SECONDS);
  });

  it("stops ticking once the game is won", () => {
    const { result } = renderHook(() => useTimeAttackLogic(VALUES));
    const [a, b] = [
      result.current.cards[0],
      result.current.cards.find(
        (c) => c.id !== result.current.cards[0].id && c.value === result.current.cards[0].value,
      ),
    ];
    act(() => result.current.handleCardClick(a));
    act(() => result.current.handleCardClick(b));
    act(() => vi.advanceTimersByTime(500)); // match confirmation delay

    const cards2 = result.current.cards.filter((c) => !c.isMatched);
    const c = cards2[0];
    const d = cards2.find((x) => x.id !== c.id && x.value === c.value);
    act(() => result.current.handleCardClick(c));
    act(() => result.current.handleCardClick(d));
    act(() => vi.advanceTimersByTime(500));

    expect(result.current.isGameWon).toBe(true);
    const secondsAtWin = result.current.secondsLeft;
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.secondsLeft).toBe(secondsAtWin);
    expect(result.current.isTimeUp).toBe(false);
  });
});
