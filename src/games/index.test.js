import { describe, it, expect } from "vitest";
import { GAMES, getGame, gamesInCategory } from "./index";
import { CATEGORIES } from "../components/home/homeData";

const CATEGORY_IDS = CATEGORIES.map((c) => c.id);

describe("games registry", () => {
  it("every game has the required fields", () => {
    for (const g of GAMES) {
      expect(typeof g.id).toBe("string");
      expect(typeof g.label).toBe("string");
      expect(typeof g.description).toBe("string");
      expect(typeof g.icon).toBe("string");
      expect(typeof g.component).toBe("function");
    }
  });

  it("game ids are unique", () => {
    const ids = GAMES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every game belongs to a real category", () => {
    for (const g of GAMES) {
      expect(CATEGORY_IDS).toContain(g.category);
    }
  });

  it("getGame finds by id and returns null for unknown ids", () => {
    expect(getGame("memory-match")?.label).toBe("Memory Match");
    expect(getGame("does-not-exist")).toBeNull();
  });

  it("gamesInCategory returns only that category's games, in registry order", () => {
    const brain = gamesInCategory("brain-training");
    expect(brain.length).toBeGreaterThan(0);
    expect(brain.every((g) => g.category === "brain-training")).toBe(true);
    const order = GAMES.filter((g) => g.category === "brain-training").map((g) => g.id);
    expect(brain.map((g) => g.id)).toEqual(order);
  });

  it("gamesInCategory returns [] for an unknown category", () => {
    expect(gamesInCategory("nonsense")).toEqual([]);
  });
});
