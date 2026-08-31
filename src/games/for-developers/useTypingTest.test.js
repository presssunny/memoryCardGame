import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTypingTest } from "./useTypingTest";

// Force a known short target.
const rngFor = (index) => () => index / 100;

describe("useTypingTest", () => {
  it("starts idle with an untyped target", () => {
    const { result } = renderHook(() => useTypingTest({ rng: rngFor(0) }));
    expect(result.current.phase).toBe("idle");
    expect(result.current.typed).toBe("");
    expect(result.current.target.length).toBeGreaterThan(0);
  });

  it("marks characters correct/incorrect as they are typed", () => {
    const { result } = renderHook(() => useTypingTest({ rng: rngFor(0) }));
    const target = result.current.target;
    act(() => result.current.setValue(target.slice(0, 1)));
    expect(result.current.chars[0].state).toBe("ok");
    expect(result.current.phase).toBe("typing");

    act(() => result.current.setValue("X" + target.slice(1, 2)));
    expect(result.current.chars[0].state).toBe("bad");
    expect(result.current.errors).toBe(1);
  });

  it("finishes with WPM and accuracy once the whole target is typed", () => {
    const { result } = renderHook(() => useTypingTest({ rng: rngFor(0) }));
    const target = result.current.target;
    act(() => result.current.setValue(target));
    expect(result.current.phase).toBe("done");
    expect(result.current.result.accuracy).toBe(100);
    expect(result.current.result.wpm).toBeGreaterThan(0);
  });

  it("computes accuracy below 100 when there were mistakes", () => {
    const { result } = renderHook(() => useTypingTest({ rng: rngFor(0) }));
    const target = result.current.target;
    const wrong = "X" + target.slice(1);
    act(() => result.current.setValue(wrong));
    expect(result.current.phase).toBe("done");
    expect(result.current.result.accuracy).toBeLessThan(100);
  });

  it("restart picks a fresh attempt", () => {
    const { result } = renderHook(() => useTypingTest({ rng: rngFor(0) }));
    act(() => result.current.setValue(result.current.target));
    expect(result.current.phase).toBe("done");
    act(() => result.current.restart());
    expect(result.current.phase).toBe("idle");
    expect(result.current.typed).toBe("");
  });
});
