import { describe, it, expect } from "vitest";
import { buildCategorySections, CATEGORY_GROUPS } from "./homeData";

const game = (id, group) => ({ id, group });

describe("buildCategorySections", () => {
  it("returns one unlabelled section for a category with no declared groups", () => {
    const games = [game("a"), game("b")];
    const sections = buildCategorySections("brain-training", games);
    expect(sections).toHaveLength(1);
    expect(sections[0].label).toBeNull();
    expect(sections[0].games).toEqual(games);
  });

  it("splits kids games into declared groups, in declared order", () => {
    const games = [
      game("ready-1", "ready-for-school"),
      game("fun-1", "fun"),
      game("ready-2", "ready-for-school"),
    ];
    const sections = buildCategorySections("kids", games);
    expect(sections.map((s) => s.id)).toEqual(["fun", "ready-for-school"]);
    expect(sections[0].games.map((g) => g.id)).toEqual(["fun-1"]);
    expect(sections[1].games.map((g) => g.id)).toEqual(["ready-1", "ready-2"]);
  });

  it("drops declared groups that have no games", () => {
    const sections = buildCategorySections("kids", [game("fun-1", "fun")]);
    expect(sections.map((s) => s.id)).toEqual(["fun"]);
  });

  it("puts games with an unknown or missing group in a trailing 'More games' section", () => {
    const games = [game("fun-1", "fun"), game("loose"), game("weird", "nope")];
    const sections = buildCategorySections("kids", games);
    const last = sections[sections.length - 1];
    expect(last.id).toBe("more");
    expect(last.label).toBe("More games");
    expect(last.games.map((g) => g.id)).toEqual(["loose", "weird"]);
  });

  it("returns an empty array for a category with no games", () => {
    expect(buildCategorySections("kids", [])).toEqual([]);
  });

  it("every declared group id is unique within its category", () => {
    for (const groups of Object.values(CATEGORY_GROUPS)) {
      const ids = groups.map((g) => g.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});
