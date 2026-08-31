import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useGameResult } from "./useGameResult";

function makeBestScores(initialBest = null) {
  const recordResult = vi.fn();
  const getBest = vi.fn(() => initialBest);
  return { getBest, recordResult, getBestOverall: vi.fn() };
}

describe("useGameResult", () => {
  it("does not record while the game is unfinished", () => {
    const bestScores = makeBestScores();
    renderHook(() =>
      useGameResult(bestScores, "g", "default", {
        ended: false,
        result: { moves: 5, score: 5 },
      }),
    );
    expect(bestScores.recordResult).not.toHaveBeenCalled();
  });

  it("records once when the game ends", () => {
    const bestScores = makeBestScores();
    const { rerender } = renderHook(
      ({ ended }) =>
        useGameResult(bestScores, "g", "devtools", {
          ended,
          result: { moves: 7, score: 7 },
          higherIsBetter: true,
        }),
      { initialProps: { ended: false } },
    );
    rerender({ ended: true });
    expect(bestScores.recordResult).toHaveBeenCalledTimes(1);
    expect(bestScores.recordResult).toHaveBeenCalledWith(
      "g",
      "devtools",
      { moves: 7, score: 7 },
      { higherIsBetter: true },
    );
  });

  it("re-records if the result changes after ending (e.g. a new run)", () => {
    const bestScores = makeBestScores();
    const { rerender } = renderHook(
      ({ moves }) =>
        useGameResult(bestScores, "g", "default", {
          ended: true,
          result: { moves, score: moves },
        }),
      { initialProps: { moves: 10 } },
    );
    rerender({ moves: 8 });
    expect(bestScores.recordResult).toHaveBeenCalledTimes(2);
    expect(bestScores.recordResult).toHaveBeenLastCalledWith(
      "g",
      "default",
      { moves: 8, score: 8 },
      { higherIsBetter: false },
    );
  });

  it("returns the current best from the store", () => {
    const bestScores = makeBestScores({ moves: 3, score: 3 });
    const { result } = renderHook(() =>
      useGameResult(bestScores, "g", "default", {
        ended: false,
        result: { moves: 0, score: 0 },
      }),
    );
    expect(result.current).toEqual({ moves: 3, score: 3 });
  });
});
