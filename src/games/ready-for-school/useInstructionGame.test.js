import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInstructionGame } from "./useInstructionGame";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

// Round N asks for the first N targets, in order.
const board = [
  { id: "a", emoji: "🔴", label: "a" },
  { id: "b", emoji: "🟦", label: "b" },
  { id: "c", emoji: "⭐", label: "c" },
];
const makeRound = (round) => ({
  board,
  steps: ["a", "b", "c"].slice(0, Math.min(round, 3)),
  text: "tap them",
});

const flush = (ms = 650) => act(() => vi.advanceTimersByTime(ms));

describe("useInstructionGame", () => {
  it("starts on round 1, step 0", () => {
    const { result } = renderHook(() => useInstructionGame({ makeRound }));
    expect(result.current.round).toBe(1);
    expect(result.current.step).toBe(0);
    expect(result.current.status).toBe("playing");
  });

  it("a correct single-step round advances to round 2", () => {
    const { result } = renderHook(() => useInstructionGame({ makeRound }));
    act(() => result.current.tap("a"));
    flush();
    expect(result.current.round).toBe(2);
    expect(result.current.streak).toBe(1);
    expect(result.current.step).toBe(0);
  });

  it("a wrong tap resets the attempt to step 0 and breaks the streak", () => {
    const { result } = renderHook(() => useInstructionGame({ makeRound }));
    // reach round 3 (needs 3 ordered taps)
    act(() => result.current.tap("a"));
    flush();
    act(() => result.current.tap("a"));
    flush();
    act(() => result.current.tap("b"));
    flush();
    expect(result.current.round).toBe(3);

    act(() => result.current.tap("a"));
    flush();
    act(() => result.current.tap("c")); // wrong — expected "b"
    flush();
    expect(result.current.step).toBe(0);
    expect(result.current.done).toEqual([]);
    expect(result.current.streak).toBe(0);
  });

  it("multi-step rounds require the exact order", () => {
    const { result } = renderHook(() => useInstructionGame({ makeRound }));
    act(() => result.current.tap("a"));
    flush(); // -> round 2, steps ["a","b"]
    act(() => result.current.tap("a"));
    flush();
    expect(result.current.step).toBe(1);
    act(() => result.current.tap("b"));
    flush();
    expect(result.current.round).toBe(3);
  });

  it("wins after totalRounds", () => {
    const { result } = renderHook(() =>
      useInstructionGame({ makeRound, totalRounds: 2 }),
    );
    act(() => result.current.tap("a"));
    flush();
    act(() => result.current.tap("a"));
    flush();
    act(() => result.current.tap("b"));
    flush();
    expect(result.current.status).toBe("won");
  });

  it("restart() returns to round 1", () => {
    const { result } = renderHook(() =>
      useInstructionGame({ makeRound, totalRounds: 1 }),
    );
    act(() => result.current.tap("a"));
    flush();
    expect(result.current.status).toBe("won");
    act(() => result.current.restart());
    expect(result.current.round).toBe(1);
    expect(result.current.status).toBe("playing");
  });
});
