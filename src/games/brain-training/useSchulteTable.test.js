import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSchulteTable } from "./useSchulteTable";

function seededRng(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useSchulteTable", () => {
  it("deals a shuffled permutation of 1..total, ready to start", () => {
    const { result } = renderHook(() => useSchulteTable({ size: 2, rng: seededRng(1) }));
    expect(result.current.total).toBe(4);
    expect([...result.current.cells].sort((a, b) => a - b)).toEqual([1, 2, 3, 4]);
    expect(result.current.status).toBe("ready");
    expect(result.current.next).toBe(1);
    expect(result.current.misses).toBe(0);
  });

  it("a wrong tap counts a miss without advancing next or starting the clock", () => {
    const { result } = renderHook(() => useSchulteTable({ size: 2, rng: seededRng(2) }));
    act(() => result.current.tap(3)); // next is 1, so 3 is wrong
    expect(result.current.misses).toBe(1);
    expect(result.current.next).toBe(1);
    expect(result.current.status).toBe("ready");
  });

  it("tapping 1..total in order advances next each time and finishes done", () => {
    const { result } = renderHook(() => useSchulteTable({ size: 2, rng: seededRng(3) }));
    const { total } = result.current;

    act(() => result.current.tap(1));
    expect(result.current.status).toBe("playing");
    expect(result.current.next).toBe(2);

    for (let v = 2; v < total; v++) {
      act(() => result.current.tap(v));
      expect(result.current.next).toBe(v + 1);
      expect(result.current.status).toBe("playing");
    }

    act(() => result.current.tap(total));
    expect(result.current.status).toBe("done");
    expect(result.current.next).toBe(total + 1);
    expect(result.current.misses).toBe(0);
  });

  it("restart reshuffles into a fresh, valid permutation and resets all state", () => {
    const { result } = renderHook(() => useSchulteTable({ size: 2, rng: seededRng(4) }));
    const { total } = result.current;
    for (let v = 1; v <= total; v++) act(() => result.current.tap(v));
    expect(result.current.status).toBe("done");

    act(() => result.current.restart());
    expect(result.current.status).toBe("ready");
    expect(result.current.next).toBe(1);
    expect(result.current.misses).toBe(0);
    expect(result.current.elapsedMs).toBe(0);
    expect([...result.current.cells].sort((a, b) => a - b)).toEqual([1, 2, 3, 4]);
  });
});
