import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useQuizGame } from "./useQuizGame";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

// A deterministic question: option "ok" is always correct.
const generate = (round) => ({
  prompt: `Q${round}`,
  options: [
    { id: "ok", correct: true },
    { id: "no1" },
    { id: "no2" },
  ],
});

const flush = (ms = 700) => act(() => vi.advanceTimersByTime(ms));

describe("useQuizGame", () => {
  it("starts on round 1 with the first generated question", () => {
    const { result } = renderHook(() => useQuizGame({ generate }));
    expect(result.current.round).toBe(1);
    expect(result.current.question.prompt).toBe("Q1");
    expect(result.current.status).toBe("playing");
  });

  it("a correct answer scores, streaks, then advances after the feedback delay", () => {
    const { result } = renderHook(() => useQuizGame({ generate }));
    act(() => result.current.answer("ok"));
    expect(result.current.feedback).toEqual({ id: "ok", correct: true });
    expect(result.current.correctCount).toBe(1);
    expect(result.current.streak).toBe(1);

    flush();
    expect(result.current.feedback).toBeNull();
    expect(result.current.round).toBe(2);
    expect(result.current.question.prompt).toBe("Q2");
  });

  it("ignores a second answer while feedback is showing", () => {
    const { result } = renderHook(() => useQuizGame({ generate }));
    act(() => result.current.answer("ok"));
    act(() => result.current.answer("no1"));
    expect(result.current.correctCount).toBe(1);
  });

  it("wins after totalRounds correct answers", () => {
    const { result } = renderHook(() =>
      useQuizGame({ generate, totalRounds: 2 }),
    );
    act(() => result.current.answer("ok"));
    flush();
    act(() => result.current.answer("ok"));
    flush();
    expect(result.current.status).toBe("won");
    expect(result.current.correctCount).toBe(2);
  });

  it("a wrong answer breaks the streak and, by default, keeps the same question", () => {
    const { result } = renderHook(() => useQuizGame({ generate }));
    act(() => result.current.answer("ok"));
    flush();
    act(() => result.current.answer("no1"));
    expect(result.current.feedback).toEqual({ id: "no1", correct: false });
    expect(result.current.streak).toBe(0);
    flush();
    expect(result.current.round).toBe(2); // unchanged
    expect(result.current.question.prompt).toBe("Q2");
  });

  it("loses after `lives` wrong answers", () => {
    const { result } = renderHook(() =>
      useQuizGame({ generate, lives: 2, advanceOnWrong: true }),
    );
    act(() => result.current.answer("no1"));
    flush();
    expect(result.current.livesLeft).toBe(1);
    act(() => result.current.answer("no2"));
    flush();
    expect(result.current.status).toBe("lost");
  });

  it("advanceOnWrong moves to the next question on a wrong answer", () => {
    const { result } = renderHook(() =>
      useQuizGame({ generate, lives: 5, advanceOnWrong: true }),
    );
    act(() => result.current.answer("no1"));
    flush();
    expect(result.current.round).toBe(2);
    expect(result.current.question.prompt).toBe("Q2");
  });

  it("restart() clears score, streak, lives and status", () => {
    const { result } = renderHook(() =>
      useQuizGame({ generate, totalRounds: 1 }),
    );
    act(() => result.current.answer("ok"));
    flush();
    expect(result.current.status).toBe("won");
    act(() => result.current.restart());
    expect(result.current.status).toBe("playing");
    expect(result.current.round).toBe(1);
    expect(result.current.correctCount).toBe(0);
    expect(result.current.question.prompt).toBe("Q1");
  });

  it("tracks the best streak across misses", () => {
    const { result } = renderHook(() => useQuizGame({ generate }));
    act(() => result.current.answer("ok"));
    flush();
    act(() => result.current.answer("ok"));
    flush();
    act(() => result.current.answer("no1"));
    flush();
    expect(result.current.streak).toBe(0);
    expect(result.current.bestStreak).toBe(2);
  });
});
