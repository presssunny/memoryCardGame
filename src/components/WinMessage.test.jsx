import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { WinMessage } from "./WinMessage";

const renderWin = (props) =>
  render(<WinMessage onNewGame={vi.fn()} {...props} />);

const metaText = (c) => c.querySelector(".gx-result-meta")?.textContent ?? null;
const nearMissText = (c) =>
  c.querySelector(".gx-result-nearmiss")?.textContent ?? null;
const hasRibbon = (c) => c.querySelector(".gx-result-record") != null;

// ---- #2: the redundant "Best" line ----------------------------------------
describe("WinMessage — Best meta is hidden when it equals the headline (#2)", () => {
  it("no Best line when the score equals the recorded best", () => {
    const { container } = renderWin({ moves: 11, best: { moves: 11 } });
    expect(metaText(container)).toBeNull();
    expect(hasRibbon(container)).toBe(true);
  });

  it("shows Best when the score did not beat the recorded best", () => {
    const { container } = renderWin({ moves: 13, best: { moves: 11 } });
    expect(metaText(container)).toContain("11");
    expect(hasRibbon(container)).toBe(false);
  });

  it("no Best line on a first-ever win", () => {
    const { container } = renderWin({ moves: 11, best: null });
    expect(metaText(container)).toBeNull();
    expect(hasRibbon(container)).toBe(true);
  });
});

// ---- #2: near-miss, direction-aware --------------------------------------
describe("WinMessage — near-miss line (#2)", () => {
  it("lower-is-better (moves): a close miss over your best", () => {
    const { container } = renderWin({ moves: 13, best: { moves: 11 } });
    // gap 2, threshold max(1, round(11*.15)) = 2 -> close
    expect(nearMissText(container)).toMatch(/2 moves over your best \(11\)/);
  });

  it("higher-is-better (streak): a close miss away from your best", () => {
    const { container } = renderWin({
      moves: 18,
      best: { moves: 20 },
      bestUnit: "streak",
    });
    // gap 2, threshold max(1, round(20*.15)) = 3 -> close
    expect(nearMissText(container)).toMatch(/2 away from your best \(20\)/);
  });

  it("no near-miss on a new record", () => {
    const { container } = renderWin({ moves: 9, best: { moves: 11 } });
    expect(nearMissText(container)).toBeNull();
    expect(hasRibbon(container)).toBe(true);
  });

  it("no near-miss on a tie", () => {
    const { container } = renderWin({ moves: 11, best: { moves: 11 } });
    expect(nearMissText(container)).toBeNull();
  });

  it("no near-miss with no previous best", () => {
    const { container } = renderWin({ moves: 11, best: null });
    expect(nearMissText(container)).toBeNull();
  });

  it("no near-miss when the run is not actually close", () => {
    // moves 40 vs best 11, gap 29, threshold 2 -> far, no hollow praise
    const { container } = renderWin({ moves: 40, best: { moves: 11 } });
    expect(nearMissText(container)).toBeNull();
  });

  it("higher-is-better record is detected (no backwards <=)", () => {
    const { container } = renderWin({
      moves: 25,
      best: { moves: 20 },
      bestUnit: "streak",
    });
    expect(hasRibbon(container)).toBe(true);
    expect(nearMissText(container)).toBeNull();
  });

  it("the Hebrew win screen shows no near-miss (number-free by design)", () => {
    const { container } = renderWin({
      moves: 6,
      best: { moves: 8 },
      bestUnit: "streak",
      hebrew: true,
      note: "מצוין!",
    });
    expect(nearMissText(container)).toBeNull();
    expect(container.querySelector(".gx-result-score")).toBeNull();
  });
});

// ---- #3: semantic Best-chip label --------------------------------------
describe("WinMessage — semantic Best label (#3)", () => {
  it("lower-is-better moves reads 'Fewest moves'", () => {
    const { container } = renderWin({ moves: 13, best: { moves: 11 } });
    expect(metaText(container)).toContain("Fewest moves");
  });

  it("a time metric reads 'Best time'", () => {
    const { container } = renderWin({
      moves: 9000,
      best: { moves: 8000 },
      bestUnit: "ms",
    });
    expect(metaText(container)).toContain("Best time");
  });
});
