import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSnake } from "./useSnake";

const rng0 = () => 0;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// L1: the countdown used to jump straight from count=1 to phase="running",
// so `count` never reached 0 and SnakeGame's `count > 0 ? count : "Go!"`
// could never show "Go!". It must now pass through 0 before running starts.
describe("useSnake: countdown reaches 0 before running (L1)", () => {
  it("ticks 3 → 2 → 1 → 0, and only then flips to running", () => {
    const { result } = renderHook(() => useSnake({ rng: rng0 }));
    expect(result.current.status).toBe("countdown");
    expect(result.current.count).toBe(3);

    act(() => vi.advanceTimersByTime(700));
    expect(result.current.status).toBe("countdown");
    expect(result.current.count).toBe(2);

    act(() => vi.advanceTimersByTime(700));
    expect(result.current.count).toBe(1);

    act(() => vi.advanceTimersByTime(700));
    // This is the previously-unreachable "Go!" moment.
    expect(result.current.status).toBe("countdown");
    expect(result.current.count).toBe(0);

    act(() => vi.advanceTimersByTime(700));
    expect(result.current.status).toBe("running");
  });
});
