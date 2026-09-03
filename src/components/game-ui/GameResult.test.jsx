import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GameResult } from "./GameResult";
import { GameExitContext } from "./gameExit";

const renderResult = (props = {}, exitValue) =>
  render(
    <GameExitContext.Provider value={exitValue ?? null}>
      <GameResult
        variant="win"
        title="Congratulations!"
        onPlayAgain={vi.fn()}
        {...props}
      />
    </GameExitContext.Provider>,
  );

describe("GameResult — Back to Games is never missing (H1)", () => {
  it("shows a Back to Games button from GameHost's exit context alone", () => {
    const exit = vi.fn();
    renderResult({}, exit);
    const btn = screen.getByRole("button", { name: "Back to Games" });
    fireEvent.click(btn);
    expect(exit).toHaveBeenCalledTimes(1);
  });

  it("an explicit onExit prop wins over the context", () => {
    const ctxExit = vi.fn();
    const propExit = vi.fn();
    renderResult({ onExit: propExit }, ctxExit);
    fireEvent.click(screen.getByRole("button", { name: "Back to Games" }));
    expect(propExit).toHaveBeenCalledTimes(1);
    expect(ctxExit).not.toHaveBeenCalled();
  });

  it("with neither prop nor context there is no exit button (unchanged)", () => {
    renderResult({}, null);
    expect(
      screen.queryByRole("button", { name: "Back to Games" }),
    ).not.toBeInTheDocument();
  });

  it("uses the Hebrew label for the kids games", () => {
    renderResult({ hebrew: true }, vi.fn());
    expect(
      screen.getByRole("button", { name: "חזרה למשחקים" }),
    ).toBeInTheDocument();
  });
});

describe("GameResult — modal focus management (H3)", () => {
  it("is an accessible modal dialog", () => {
    renderResult({}, vi.fn());
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName("Congratulations!");
  });

  it("moves focus into the dialog when it opens", () => {
    renderResult({}, vi.fn());
    const dialog = screen.getByRole("dialog");
    expect(dialog.contains(document.activeElement)).toBe(true);
    // first focusable = the primary action
    expect(document.activeElement).toHaveTextContent("Play Again");
  });

  it("traps Tab within the dialog", () => {
    renderResult({}, vi.fn());
    const buttons = screen.getAllByRole("button");
    const first = buttons[0];
    const last = buttons[buttons.length - 1];

    last.focus();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Tab" });
    expect(document.activeElement).toBe(first);

    first.focus();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it("restores focus to the opener when it closes", () => {
    const opener = document.createElement("button");
    opener.textContent = "Finish";
    document.body.appendChild(opener);
    opener.focus();
    expect(document.activeElement).toBe(opener);

    const { unmount } = renderResult({}, vi.fn());
    expect(document.activeElement).not.toBe(opener);

    unmount();
    expect(document.activeElement).toBe(opener);
    opener.remove();
  });
});
