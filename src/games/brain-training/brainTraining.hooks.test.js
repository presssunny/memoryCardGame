import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReactionTime } from "./useReactionTime";
import { useSchulteTable } from "./useSchulteTable";
import { useDigitSpan } from "./useDigitSpan";
import { usePatternGrid } from "./usePatternGrid";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const rng0 = () => 0; // deterministic

describe("useReactionTime", () => {
  it("goes idle → waiting → go, records a time, and repeats", () => {
    const { result } = renderHook(() => useReactionTime({ rng: rng0 }));
    expect(result.current.phase).toBe("idle");
    act(() => result.current.press()); // start
    expect(result.current.phase).toBe("waiting");
    act(() => vi.advanceTimersByTime(4000)); // wait out the delay
    expect(result.current.phase).toBe("go");
    act(() => result.current.press()); // tap
    expect(result.current.phase).toBe("result");
    expect(result.current.times).toHaveLength(1);
    expect(result.current.lastMs).toBeGreaterThanOrEqual(0);
  });

  it("tapping during the wait is a false start", () => {
    const { result } = renderHook(() => useReactionTime({ rng: rng0 }));
    act(() => result.current.press());
    act(() => result.current.press()); // too soon
    expect(result.current.phase).toBe("early");
    expect(result.current.times).toHaveLength(0);
  });

  it("finishes after the configured number of trials", () => {
    const { result } = renderHook(() => useReactionTime({ trials: 2, rng: rng0 }));
    for (let i = 0; i < 2; i++) {
      act(() => result.current.press());
      act(() => vi.advanceTimersByTime(4000));
      act(() => result.current.press());
    }
    expect(result.current.phase).toBe("done");
    expect(result.current.best).not.toBeNull();
    expect(result.current.average).not.toBeNull();
  });
});

describe("useSchulteTable", () => {
  it("has 1..N once, starts ready, and ignores out-of-order taps", () => {
    const { result } = renderHook(() => useSchulteTable({ size: 3, rng: rng0 }));
    expect([...result.current.cells].sort((a, b) => a - b)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
    expect(result.current.status).toBe("ready");
    act(() => result.current.tap(5)); // not 1
    expect(result.current.next).toBe(1);
    expect(result.current.misses).toBe(1);
  });

  it("completes when 1..N are tapped in order", () => {
    const { result } = renderHook(() => useSchulteTable({ size: 3, rng: rng0 }));
    for (let n = 1; n <= 9; n++) act(() => result.current.tap(n));
    expect(result.current.status).toBe("done");
    expect(result.current.next).toBe(10);
  });
});

// The playback effect reschedules only after React flushes the state update
// from the previous step, so advance in small slices (as the other timer
// tests do), not one big jump.
function playOut() {
  for (let i = 0; i < 30; i++) act(() => vi.advanceTimersByTime(300));
}

describe("useDigitSpan", () => {
  it("shows the sequence then accepts input; a wrong digit loses", () => {
    const { result } = renderHook(() => useDigitSpan({ rng: rng0 }));
    expect(result.current.phase).toBe("showing");
    playOut(); // rng0 => all digits 0; 3-digit playback
    expect(result.current.phase).toBe("input");
    act(() => result.current.pressDigit(9)); // wrong (expected 0)
    expect(result.current.phase).toBe("lost");
  });

  it("clearing a round grows the length by one", () => {
    const { result } = renderHook(() => useDigitSpan({ rng: rng0 }));
    playOut();
    act(() => result.current.pressDigit(0));
    act(() => result.current.pressDigit(0));
    act(() => result.current.pressDigit(0));
    expect(result.current.level).toBe(4);
    expect(result.current.roundsCompleted).toBe(1);
  });
});

describe("usePatternGrid", () => {
  it("shows a pattern, then a wrong cell loses and a right one is accepted", () => {
    const { result } = renderHook(() => usePatternGrid({ size: 4, rng: rng0 }));
    expect(result.current.phase).toBe("showing");
    expect(result.current.lit.size).toBe(3);
    act(() => vi.advanceTimersByTime(2000));
    expect(result.current.phase).toBe("input");

    const litIndex = [...result.current.lit][0];
    const unlit = [...Array(16).keys()].find((i) => !result.current.lit.has(i));
    act(() => result.current.tap(litIndex));
    expect(result.current.picked.has(litIndex)).toBe(true);
    act(() => result.current.tap(unlit));
    expect(result.current.phase).toBe("lost");
  });
});
