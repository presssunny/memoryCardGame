import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { GameHUD } from "./GameHUD";

// UI/UX #10 — the sound toggle announced "צליל: on" on the Hebrew games
// (Hebrew label, English state word). Both parts are localised now, and
// aria-pressed still tracks the state.
beforeEach(() => {
  try {
    localStorage.clear();
  } catch {
    /* ignore */
  }
});

const soundBtn = (container, hebrew) =>
  container.querySelector(`[title="${hebrew ? "צליל" : "Sound"}"]`);

// The label's state word must always agree with aria-pressed, in the game's
// own language.
const expectLabelMatchesState = (btn, hebrew) => {
  const pressed = btn.getAttribute("aria-pressed") === "true";
  const word = hebrew
    ? pressed
      ? "מופעל"
      : "כבוי"
    : pressed
      ? "on"
      : "off";
  const label = hebrew ? "צליל" : "Sound";
  expect(btn.getAttribute("aria-label")).toBe(`${label}: ${word}`);
};

describe("GameHUD — localised sound toggle label (#10)", () => {
  it("Hebrew: label and state word are both Hebrew, and track aria-pressed", () => {
    const { container } = render(
      <GameHUD title="חשבון ראשון" hebrew onReset={vi.fn()} onExit={vi.fn()} />,
    );
    const btn = soundBtn(container, true);
    expect(btn).toBeTruthy();
    expect(btn.getAttribute("aria-label")).toMatch(/^צליל: (מופעל|כבוי)$/);
    expectLabelMatchesState(btn, true);

    const before = btn.getAttribute("aria-pressed");
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-pressed")).not.toBe(before);
    expectLabelMatchesState(btn, true);
  });

  it("English: label reads 'Sound: on' / 'Sound: off' and tracks aria-pressed", () => {
    const { container } = render(
      <GameHUD title="Snake" onReset={vi.fn()} onExit={vi.fn()} />,
    );
    const btn = soundBtn(container, false);
    expect(btn.getAttribute("aria-label")).toMatch(/^Sound: (on|off)$/);
    expectLabelMatchesState(btn, false);

    const before = btn.getAttribute("aria-pressed");
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-pressed")).not.toBe(before);
    expectLabelMatchesState(btn, false);
  });
});
