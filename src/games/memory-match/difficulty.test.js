import { describe, it, expect } from "vitest";
import { LEVELS, LEVEL_ORDER, pairsFor, levelPills, colsFor } from "./difficulty";

describe("Memory Match difficulty", () => {
  it("pairsFor clamps to the icon count and never drops below 2", () => {
    expect(pairsFor("easy", 16)).toBe(4);
    expect(pairsFor("classic", 16)).toBe(8);
    expect(pairsFor("hard", 16)).toBe(12);
    // Dev Tools has 8 icons — "hard" is really "classic".
    expect(pairsFor("hard", 8)).toBe(8);
    // Gabby has 7.
    expect(pairsFor("classic", 7)).toBe(7);
    expect(pairsFor("hard", 1)).toBe(2);
    // Unknown level falls back to the default.
    expect(pairsFor("nope", 16)).toBe(LEVELS.classic);
  });

  it("levelPills is one entry per level, labelled with the real pair count", () => {
    const pills = levelPills(8);
    expect(pills.map((p) => p.value)).toEqual(LEVEL_ORDER);
    expect(pills.find((p) => p.value === "hard").label).toBe("Hard · 8");
    expect(levelPills(16).find((p) => p.value === "hard").label).toBe("Hard · 12");
  });

  it("colsFor widens the grid only for big boards", () => {
    expect(colsFor(4)).toBe(4);
    expect(colsFor(8)).toBe(4);
    expect(colsFor(12)).toBe(6);
  });
});
