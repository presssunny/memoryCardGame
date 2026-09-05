import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useArcadeMode } from "./useArcadeMode";

const KEY = "arcade-home-mode";

beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

describe("useArcadeMode", () => {
  it("defaults to dark (isLight false) with no saved preference", () => {
    const { result } = renderHook(() => useArcadeMode());
    expect(result.current.isLight).toBe(false);
  });

  it("reads a saved light preference on mount", () => {
    localStorage.setItem(KEY, "light");
    const { result } = renderHook(() => useArcadeMode());
    expect(result.current.isLight).toBe(true);
  });

  it("toggleMode flips the mode and persists it", () => {
    const { result } = renderHook(() => useArcadeMode());
    act(() => result.current.toggleMode());
    expect(result.current.isLight).toBe(true);
    expect(localStorage.getItem(KEY)).toBe("light");

    act(() => result.current.toggleMode());
    expect(result.current.isLight).toBe(false);
    expect(localStorage.getItem(KEY)).toBe("dark");
  });

  it("a second hook instance picks up the persisted value (Home ↔ game consistency)", () => {
    const first = renderHook(() => useArcadeMode());
    act(() => first.result.current.toggleMode()); // → light, persisted
    const second = renderHook(() => useArcadeMode());
    expect(second.result.current.isLight).toBe(true);
  });
});
