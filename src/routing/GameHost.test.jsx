import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { GameHost } from "./GameHost";

// A game screen must inherit the light/dark choice made on Home / Category —
// the same persisted `arcade-home-mode` preference, read via useArcadeMode
// (M3). GameHost puts `.is-light` on the `.app` root so the --gx-* token
// layer re-points for every game.

const StubGame = () => <div data-testid="stub-game">game</div>;

const resolved = {
  game: { id: "snake", component: StubGame, usesCards: false },
  category: { id: "arcade" },
  group: null,
  subgroup: null,
};
const theme = {
  activeTheme: { id: "default" },
  cardValues: [],
  allThemes: [],
  changeTheme: () => {},
};
const bestScores = { getBest: () => null, recordResult: () => {} };

const renderHost = () =>
  render(
    <MemoryRouter initialEntries={["/games/arcade/snake"]}>
      <GameHost resolved={resolved} theme={theme} bestScores={bestScores} />
    </MemoryRouter>,
  );

beforeEach(() => {
  localStorage.clear();
});
afterEach(() => {
  localStorage.clear();
});

describe("GameHost — light/dark inherited from the arcade-mode preference (M3)", () => {
  it("adds .is-light to the .app root when the saved preference is light", () => {
    localStorage.setItem("arcade-home-mode", "light");
    const { container } = renderHost();
    const app = container.querySelector(".app.app-game");
    expect(app).toBeTruthy();
    expect(app.classList.contains("is-light")).toBe(true);
  });

  it("does not add .is-light when the preference is dark (the default)", () => {
    const { container } = renderHost();
    const app = container.querySelector(".app.app-game");
    expect(app.classList.contains("is-light")).toBe(false);
  });

  it("does not add .is-light when the preference is explicitly dark", () => {
    localStorage.setItem("arcade-home-mode", "dark");
    const { container } = renderHost();
    expect(
      container.querySelector(".app.app-game").classList.contains("is-light"),
    ).toBe(false);
  });

  it("keeps the card-theme class independent of light mode", () => {
    localStorage.setItem("arcade-home-mode", "light");
    const cardResolved = {
      ...resolved,
      game: { id: "memory-match", component: StubGame, usesCards: true },
      category: { id: "brain-training" },
    };
    const { container } = render(
      <MemoryRouter initialEntries={["/games/brain-training/memory-match"]}>
        <GameHost resolved={cardResolved} theme={theme} bestScores={bestScores} />
      </MemoryRouter>,
    );
    const app = container.querySelector(".app.app-game");
    expect(app.classList.contains("is-light")).toBe(true);
    expect(app.classList.contains("theme--default")).toBe(true);
  });
});
