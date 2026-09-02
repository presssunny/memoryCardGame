import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BugHuntGame } from "./BugHuntGame";

const noopScores = {
  getBest: () => null,
  recordResult: () => {},
};

describe("BugHuntGame — review flow", () => {
  it("shows the bug/fix review panel after an answer and waits for Next Bug", () => {
    render(
      <BugHuntGame gameId="bug-hunt" bestScores={noopScores} onExit={() => {}} />,
    );
    const options = screen.getAllByRole("button", { name: /Line \d+/ });
    fireEvent.click(options[0]);

    expect(screen.getByText("🐛 The bug")).toBeInTheDocument();
    expect(screen.getByText("✓ The fix")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Next Bug/ }),
    ).toBeInTheDocument();
  });
});
