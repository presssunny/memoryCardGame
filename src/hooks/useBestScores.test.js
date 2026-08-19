import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBestScores } from "./useBestScores";

const KEY = "memory-game-best-scores";

beforeEach(() => {
  localStorage.clear();
});

describe("useBestScores: default comparator (fewer moves is better)", () => {
  it("records the first result for a game+theme combo", () => {
    const { result } = renderHook(() => useBestScores());
    act(() =>
      result.current.recordResult("memory-match", "devtools", {
        moves: 20,
        score: 8,
      }),
    );
    expect(result.current.getBest("memory-match", "devtools")).toMatchObject({
      moves: 20,
      score: 8,
    });
  });

  it("keeps a better (lower) result and rejects a worse one", () => {
    const { result } = renderHook(() => useBestScores());
    act(() =>
      result.current.recordResult("memory-match", "devtools", {
        moves: 20,
        score: 8,
      }),
    );
    act(() =>
      result.current.recordResult("memory-match", "devtools", {
        moves: 30,
        score: 8,
      }),
    );
    expect(result.current.getBest("memory-match", "devtools").moves).toBe(20);

    act(() =>
      result.current.recordResult("memory-match", "devtools", {
        moves: 12,
        score: 8,
      }),
    );
    expect(result.current.getBest("memory-match", "devtools").moves).toBe(12);
  });

  it("keeps separate bests per theme for the same game", () => {
    const { result } = renderHook(() => useBestScores());
    act(() =>
      result.current.recordResult("memory-match", "devtools", {
        moves: 20,
        score: 8,
      }),
    );
    act(() =>
      result.current.recordResult("memory-match", "gabby", {
        moves: 14,
        score: 7,
      }),
    );
    expect(result.current.getBest("memory-match", "devtools").moves).toBe(20);
    expect(result.current.getBest("memory-match", "gabby").moves).toBe(14);
  });

  it("getBestOverall picks the lowest across every theme played", () => {
    const { result } = renderHook(() => useBestScores());
    act(() =>
      result.current.recordResult("memory-match", "devtools", {
        moves: 20,
        score: 8,
      }),
    );
    act(() =>
      result.current.recordResult("memory-match", "gabby", {
        moves: 14,
        score: 7,
      }),
    );
    expect(result.current.getBestOverall("memory-match").moves).toBe(14);
  });

  it("returns null for a game/theme with no recorded result", () => {
    const { result } = renderHook(() => useBestScores());
    expect(result.current.getBest("memory-match", "devtools")).toBeNull();
    expect(result.current.getBestOverall("memory-match")).toBeNull();
  });
});

describe("useBestScores: higherIsBetter comparator", () => {
  it("keeps a better (higher) result and rejects a lower one", () => {
    const { result } = renderHook(() => useBestScores());
    act(() =>
      result.current.recordResult(
        "sequence-recall",
        "devtools",
        { moves: 3, score: 3 },
        { higherIsBetter: true },
      ),
    );
    act(() =>
      result.current.recordResult(
        "sequence-recall",
        "devtools",
        { moves: 1, score: 1 },
        { higherIsBetter: true },
      ),
    );
    expect(result.current.getBest("sequence-recall", "devtools").moves).toBe(
      3,
    );

    act(() =>
      result.current.recordResult(
        "sequence-recall",
        "devtools",
        { moves: 5, score: 5 },
        { higherIsBetter: true },
      ),
    );
    expect(result.current.getBest("sequence-recall", "devtools").moves).toBe(
      5,
    );
  });

  it("getBestOverall respects higherIsBetter across themes", () => {
    const { result } = renderHook(() => useBestScores());
    act(() =>
      result.current.recordResult(
        "sequence-recall",
        "devtools",
        { moves: 2, score: 2 },
        { higherIsBetter: true },
      ),
    );
    act(() =>
      result.current.recordResult(
        "sequence-recall",
        "gabby",
        { moves: 6, score: 6 },
        { higherIsBetter: true },
      ),
    );
    expect(
      result.current.getBestOverall("sequence-recall", {
        higherIsBetter: true,
      }).moves,
    ).toBe(6);
  });

  it("games with different comparators don't interfere with each other", () => {
    const { result } = renderHook(() => useBestScores());
    act(() =>
      result.current.recordResult("memory-match", "devtools", {
        moves: 20,
        score: 8,
      }),
    );
    act(() =>
      result.current.recordResult(
        "sequence-recall",
        "devtools",
        { moves: 4, score: 4 },
        { higherIsBetter: true },
      ),
    );
    expect(result.current.getBest("memory-match", "devtools").moves).toBe(20);
    expect(result.current.getBest("sequence-recall", "devtools").moves).toBe(
      4,
    );
  });
});

describe("useBestScores: persistence", () => {
  it("persists to localStorage and a fresh hook instance reads it back", () => {
    const { result, unmount } = renderHook(() => useBestScores());
    act(() =>
      result.current.recordResult("memory-match", "devtools", {
        moves: 20,
        score: 8,
      }),
    );
    unmount();

    const { result: second } = renderHook(() => useBestScores());
    expect(second.current.getBest("memory-match", "devtools").moves).toBe(20);
  });

  it("survives corrupted JSON in storage without throwing", () => {
    localStorage.setItem(KEY, "{not valid json");
    const { result } = renderHook(() => useBestScores());
    expect(result.current.getBest("memory-match", "devtools")).toBeNull();

    // and can still record normally afterward
    act(() =>
      result.current.recordResult("memory-match", "devtools", {
        moves: 10,
        score: 8,
      }),
    );
    expect(result.current.getBest("memory-match", "devtools").moves).toBe(10);
  });

  it("survives a non-object JSON value in storage (e.g. a stray number or array)", () => {
    localStorage.setItem(KEY, "42");
    const { result } = renderHook(() => useBestScores());
    expect(result.current.getBest("memory-match", "devtools")).toBeNull();
  });

  it("survives a missing key entirely", () => {
    localStorage.removeItem(KEY);
    const { result } = renderHook(() => useBestScores());
    expect(result.current.getBestOverall("memory-match")).toBeNull();
  });
});
