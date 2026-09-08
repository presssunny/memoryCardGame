import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { WinMessage } from "./WinMessage";

// UI/UX #2 — the win screen used to show the headline number and "Best N"
// with the *same* value stacked (because `best` re-reads as the just-played
// result right after a win). Best is now shown only when it differs.
const renderWin = (props) =>
  render(<WinMessage onNewGame={vi.fn()} {...props} />);

const metaText = (container) =>
  container.querySelector(".gx-result-meta")?.textContent ?? null;

describe("WinMessage — Best meta is hidden when it equals the headline (#2)", () => {
  it("no Best line when the score equals the recorded best", () => {
    const { container } = renderWin({ moves: 11, best: { moves: 11 } });
    expect(metaText(container)).toBeNull();
    // the record ribbon still communicates "this is your best"
    expect(container.querySelector(".gx-result-record")).not.toBeNull();
  });

  it("shows Best when the score did not beat the recorded best", () => {
    const { container } = renderWin({ moves: 13, best: { moves: 11 } });
    expect(metaText(container)).toContain("Best");
    expect(metaText(container)).toContain("11");
    expect(container.querySelector(".gx-result-record")).toBeNull();
  });

  it("no Best line on a first-ever win (no previous best)", () => {
    const { container } = renderWin({ moves: 11, best: null });
    expect(metaText(container)).toBeNull();
    expect(container.querySelector(".gx-result-record")).not.toBeNull();
  });

  it("the Hebrew win screen never shows raw numbers regardless", () => {
    const { container } = renderWin({
      moves: 5,
      best: { moves: 9 },
      hebrew: true,
      note: "מצוין!",
    });
    expect(metaText(container)).toBeNull();
    expect(container.querySelector(".gx-result-score")).toBeNull();
  });
});
