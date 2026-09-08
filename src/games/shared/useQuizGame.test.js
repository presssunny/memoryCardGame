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

  it("review mode pauses on an answered question until next() is called", () => {
    const { result } = renderHook(() =>
      useQuizGame({ generate, review: "always" }),
    );
    act(() => result.current.answer("ok"));
    expect(result.current.phase).toBe("review");
    expect(result.current.feedback).toEqual({ id: "ok", correct: true });

    // The auto-advance timer must NOT fire in review mode.
    flush(5000);
    expect(result.current.round).toBe(1);
    expect(result.current.phase).toBe("review");

    act(() => result.current.next());
    expect(result.current.phase).toBe("idle");
    expect(result.current.round).toBe(2);
    expect(result.current.feedback).toBeNull();
  });

  it('review: "wrong" only pauses after a wrong answer', () => {
    const { result } = renderHook(() =>
      useQuizGame({ generate, review: "wrong", advanceOnWrong: true }),
    );
    act(() => result.current.answer("ok"));
    expect(result.current.phase).toBe("idle"); // correct → no review
    flush();
    expect(result.current.round).toBe(2);

    act(() => result.current.answer("no1"));
    expect(result.current.phase).toBe("review");
    act(() => result.current.next());
    expect(result.current.round).toBe(3);
  });

  it("review + lives: the losing answer still shows its review first", () => {
    const { result } = renderHook(() =>
      useQuizGame({ generate, lives: 1, advanceOnWrong: true, review: "always" }),
    );
    act(() => result.current.answer("no1"));
    expect(result.current.phase).toBe("review");
    expect(result.current.status).toBe("playing"); // not lost yet
    act(() => result.current.next());
    expect(result.current.status).toBe("lost");
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

describe("useQuizGame — perQuestionMs (Stroop timer)", () => {
  const timed = { generate, advanceOnWrong: true, lives: 3, perQuestionMs: 3000 };

  it("is untimed by default — no clock ever fires", () => {
    const { result } = renderHook(() => useQuizGame({ generate }));
    act(() => vi.advanceTimersByTime(60000));
    expect(result.current.wrongCount).toBe(0);
    expect(result.current.round).toBe(1);
  });

  it("running out of time counts as a wrong answer and advances", () => {
    const { result } = renderHook(() => useQuizGame(timed));
    expect(result.current.round).toBe(1);
    act(() => vi.advanceTimersByTime(3000)); // deadline
    expect(result.current.feedback).toEqual({ id: null, correct: false });
    expect(result.current.streak).toBe(0);
    flush(); // feedback delay
    expect(result.current.wrongCount).toBe(1);
    expect(result.current.round).toBe(2);
  });

  it("answering in time cancels that question's deadline", () => {
    const { result } = renderHook(() => useQuizGame(timed));
    act(() => vi.advanceTimersByTime(1000));
    act(() => result.current.answer("ok"));
    flush();
    // now on round 2; advance less than a fresh deadline — round 1's must
    // not fire retroactively
    act(() => vi.advanceTimersByTime(2000));
    expect(result.current.wrongCount).toBe(0);
    expect(result.current.correctCount).toBe(1);
    expect(result.current.round).toBe(2);
  });

  it("three timeouts lose the game, and the clock stops after that", () => {
    const { result } = renderHook(() => useQuizGame(timed));
    for (let i = 0; i < 3; i += 1) {
      act(() => vi.advanceTimersByTime(3000));
      flush();
    }
    expect(result.current.status).toBe("lost");
    const roundAtLoss = result.current.round;
    act(() => vi.advanceTimersByTime(10000)); // no further ticking
    expect(result.current.round).toBe(roundAtLoss);
    expect(result.current.wrongCount).toBe(3);
  });

  it("restart() clears the clock — a stale deadline can't fire", () => {
    const { result } = renderHook(() => useQuizGame(timed));
    act(() => vi.advanceTimersByTime(1500));
    act(() => result.current.restart());
    act(() => vi.advanceTimersByTime(2000)); // 1500+2000 > 3000, but restarted
    expect(result.current.wrongCount).toBe(0);
    expect(result.current.round).toBe(1);
    // and the fresh clock still works
    act(() => vi.advanceTimersByTime(1500));
    flush();
    expect(result.current.wrongCount).toBe(1);
  });
});
