import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSequenceLogic } from "./useSequenceLogic";

// cardValues is a theme's doubled pair-list; this game halves it back to a
// unique icon set (see useSequenceLogic.js), so 3 unique values in.
const CARD_VALUES = ["a", "b", "c", "a", "b", "c"];

let randomSpy;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  randomSpy?.mockRestore();
});

// Math.random() is only ever consumed as Math.floor(Math.random() * n) to
// pick a card index, so pinning its return value pins exactly which card
// the sequence grows with -- making every test below fully deterministic
// instead of guessing against a real shuffle.
function mockNextCardIndex(index, count = 3) {
  randomSpy = vi
    .spyOn(Math, "random")
    .mockReturnValue(index / count + 0.001);
}

function playThroughShowing(steps = 1) {
  // Advance one flash (150ms delay + 550ms duration) per act() call rather
  // than one big jump -- each step's timer is only scheduled once React
  // flushes the effect that runs after the previous step's state update,
  // so a single large advance can outrun timers that don't exist yet.
  for (let i = 0; i < steps; i++) {
    act(() => vi.advanceTimersByTime(150 + 550));
  }
}

describe("useSequenceLogic: setup", () => {
  it("deals one card per unique icon, starts on round 1 showing", () => {
    const { result } = renderHook(() => useSequenceLogic(CARD_VALUES));
    expect(result.current.cards).toHaveLength(3);
    expect(result.current.phase).toBe("showing");
    expect(result.current.round).toBe(1);
  });
});

describe("useSequenceLogic: correct play", () => {
  it("moves to input phase after the sequence finishes playing", () => {
    mockNextCardIndex(0);
    const { result } = renderHook(() => useSequenceLogic(CARD_VALUES));
    playThroughShowing(1);
    expect(result.current.phase).toBe("input");
  });

  it("advances to round 2, showing again, after correctly repeating round 1", () => {
    mockNextCardIndex(1); // round 1 = [card id 1], round 2 appends another id-1
    const { result } = renderHook(() => useSequenceLogic(CARD_VALUES));
    playThroughShowing(1);

    const correctCard = result.current.cards.find((c) => c.id === 1);
    act(() => result.current.handleCardClick(correctCard));

    expect(result.current.phase).toBe("showing");
    expect(result.current.round).toBe(2);
    expect(result.current.roundsCompleted).toBe(2);
  });
});

describe("useSequenceLogic: wrong play", () => {
  it("moves to the lost phase on a wrong click, roundsCompleted stays 0", () => {
    mockNextCardIndex(0); // round 1 = [card id 0]
    const { result } = renderHook(() => useSequenceLogic(CARD_VALUES));
    playThroughShowing(1);

    const wrongCard = result.current.cards.find((c) => c.id !== 0);
    act(() => result.current.handleCardClick(wrongCard));

    expect(result.current.phase).toBe("lost");
    expect(result.current.roundsCompleted).toBe(0);
  });

  it("a wrong click on round 2 leaves roundsCompleted at 1 (round 1 was real)", () => {
    mockNextCardIndex(0); // both round 1 and its round-2 extension pick id 0
    const { result } = renderHook(() => useSequenceLogic(CARD_VALUES));
    playThroughShowing(1);
    act(() =>
      result.current.handleCardClick(
        result.current.cards.find((c) => c.id === 0),
      ),
    );
    expect(result.current.round).toBe(2);

    playThroughShowing(2); // round 2 has 2 steps to play back
    const wrongCard = result.current.cards.find((c) => c.id !== 0);
    act(() => result.current.handleCardClick(wrongCard));

    expect(result.current.phase).toBe("lost");
    expect(result.current.roundsCompleted).toBe(1);
  });

  it("ignores clicks while a sequence is still playing back", () => {
    mockNextCardIndex(0);
    const { result } = renderHook(() => useSequenceLogic(CARD_VALUES));
    // still in "showing" -- flash delay hasn't elapsed yet
    act(() => result.current.handleCardClick(result.current.cards[0]));
    expect(result.current.phase).toBe("showing");
    expect(result.current.round).toBe(1);
  });
});

describe("useSequenceLogic: replay", () => {
  it("startNewGame resets to round 1 showing after a loss", () => {
    mockNextCardIndex(0);
    const { result } = renderHook(() => useSequenceLogic(CARD_VALUES));
    playThroughShowing(1);
    act(() =>
      result.current.handleCardClick(
        result.current.cards.find((c) => c.id !== 0),
      ),
    );
    expect(result.current.phase).toBe("lost");

    act(() => result.current.startNewGame());
    expect(result.current.phase).toBe("showing");
    expect(result.current.round).toBe(1);
  });
});
