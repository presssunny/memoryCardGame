import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCountdown } from "./useCountdown";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

// One second per act() — each tick's setTimeout is only rescheduled after
// the effect from the previous tick flushes (same pattern as the other
// timer-hook tests).
function tick(n) {
  for (let i = 0; i < n; i++) act(() => vi.advanceTimersByTime(1000));
}

describe("useCountdown", () => {
  it("starts at the given number of seconds", () => {
    const { result } = renderHook(() => useCountdown(10));
    expect(result.current.secondsLeft).toBe(10);
    expect(result.current.isExpired).toBe(false);
  });

  it("ticks down one per second and stops at zero", () => {
    const { result } = renderHook(() => useCountdown(3));
    tick(1);
    expect(result.current.secondsLeft).toBe(2);
    tick(2);
    expect(result.current.secondsLeft).toBe(0);
    expect(result.current.isExpired).toBe(true);
    tick(3);
    expect(result.current.secondsLeft).toBe(0);
  });

  it("calls onExpire exactly once, on the tick that reaches zero", () => {
    const onExpire = vi.fn();
    renderHook(() => useCountdown(2, { onExpire }));
    tick(1);
    expect(onExpire).not.toHaveBeenCalled();
    tick(1);
    expect(onExpire).toHaveBeenCalledTimes(1);
    tick(5);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it("does not tick while running is false", () => {
    const { result, rerender } = renderHook(
      ({ running }) => useCountdown(5, { running }),
      { initialProps: { running: false } },
    );
    tick(3);
    expect(result.current.secondsLeft).toBe(5);
    rerender({ running: true });
    tick(2);
    expect(result.current.secondsLeft).toBe(3);
  });

  it("reset() restores the seconds and re-arms onExpire", () => {
    const onExpire = vi.fn();
    const { result } = renderHook(() => useCountdown(2, { onExpire }));
    tick(2);
    expect(onExpire).toHaveBeenCalledTimes(1);
    act(() => result.current.reset());
    expect(result.current.secondsLeft).toBe(2);
    tick(2);
    expect(onExpire).toHaveBeenCalledTimes(2);
  });

  it("reset(n) restores to a custom value", () => {
    const { result } = renderHook(() => useCountdown(10));
    tick(4);
    act(() => result.current.reset(7));
    expect(result.current.secondsLeft).toBe(7);
  });
});
