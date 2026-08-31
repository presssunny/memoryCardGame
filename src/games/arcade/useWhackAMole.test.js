import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWhackAMole } from "./useWhackAMole";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

// rng that always spawns (0) so a mole appears quickly.
const rng0 = () => 0;

function advance(ms) {
  for (let t = 0; t < ms; t += 200) act(() => vi.advanceTimersByTime(200));
}

describe("useWhackAMole", () => {
  it("starts ready, then playing on the first whack", () => {
    const { result } = renderHook(() => useWhackAMole({ rng: rng0 }));
    expect(result.current.status).toBe("ready");
    act(() => result.current.whack(0));
    expect(result.current.status).toBe("playing");
  });

  it("spawns moles and counts a hit when one is whacked", () => {
    const { result } = renderHook(() => useWhackAMole({ rng: rng0 }));
    act(() => result.current.start());
    advance(600);
    const hole = [...result.current.upHoles][0];
    expect(hole).not.toBeUndefined();
    act(() => result.current.whack(hole));
    expect(result.current.hits).toBe(1);
  });

  it("ends after 30 seconds", () => {
    const { result } = renderHook(() => useWhackAMole({ rng: rng0 }));
    act(() => result.current.start());
    advance(31000);
    expect(result.current.status).toBe("over");
    expect(result.current.secondsLeft).toBe(0);
  });

  it("restart returns to ready with cleared counters", () => {
    const { result } = renderHook(() => useWhackAMole({ rng: rng0 }));
    act(() => result.current.start());
    advance(1000);
    act(() => result.current.restart());
    expect(result.current.status).toBe("ready");
    expect(result.current.hits).toBe(0);
    expect(result.current.misses).toBe(0);
  });
});
