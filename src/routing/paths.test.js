import { describe, it, expect } from "vitest";
import { GAMES } from "../games";
import { CATEGORIES, CATEGORY_GROUPS } from "../components/home/homeData";
import {
  gamePath,
  categoryPath,
  groupPath,
  resolveGamesPath,
  parentPath,
  breadcrumbs,
  isHebrewContext,
  allPaths,
  pageTitle,
} from "./paths";

describe("routing/paths", () => {
  it("derives a unique, slug-shaped path for every one of the 34 games", () => {
    const paths = GAMES.map(gamePath);
    expect(paths).toHaveLength(GAMES.length);
    expect(new Set(paths).size).toBe(paths.length);
    for (const p of paths) {
      expect(p).toMatch(/^\/games\/[a-z0-9-]+(\/[a-z0-9-]+){1,2}$/);
    }
  });

  it("only Kids games carry a group segment", () => {
    for (const game of GAMES) {
      const segs = gamePath(game).split("/").filter(Boolean); // games, cat, [group], id
      if (game.group) {
        expect(segs).toHaveLength(4);
        expect(segs[1]).toBe("kids");
        expect(segs[2]).toBe(game.group);
      } else {
        expect(segs).toHaveLength(3);
      }
    }
  });

  it("resolves the games index", () => {
    expect(resolveGamesPath("/games")).toEqual({ type: "index" });
    expect(resolveGamesPath("/games/")).toEqual({ type: "index" });
  });

  it("resolves every category path", () => {
    for (const cat of CATEGORIES) {
      const r = resolveGamesPath(categoryPath(cat.id));
      expect(r.type).toBe("category");
      expect(r.category.id).toBe(cat.id);
    }
  });

  it("resolves every declared sub-section path", () => {
    for (const [catId, groups] of Object.entries(CATEGORY_GROUPS)) {
      for (const g of groups) {
        const r = resolveGamesPath(groupPath(catId, g.id));
        expect(r.type).toBe("group");
        expect(r.group.id).toBe(g.id);
      }
    }
  });

  it("round-trips every game path back to its registry entry", () => {
    for (const game of GAMES) {
      const r = resolveGamesPath(gamePath(game));
      expect(r.type).toBe("game");
      expect(r.game.id).toBe(game.id);
    }
  });

  it("rejects unknown / malformed paths", () => {
    expect(resolveGamesPath("/games/arcade/not-a-real-game").type).toBe("notfound");
    expect(resolveGamesPath("/games/nonsense").type).toBe("notfound");
    expect(resolveGamesPath("/games/kids/not-a-group").type).toBe("notfound");
    expect(resolveGamesPath("/games/arcade/snake/extra").type).toBe("notfound");
    // right game id, wrong group segment
    expect(resolveGamesPath("/games/kids/fun/find-the-letter").type).toBe("notfound");
    // a non-grouped game addressed with a stray segment
    expect(resolveGamesPath("/games/arcade/fun/snake").type).toBe("notfound");
  });

  it("points 'back' up one real level of the hierarchy", () => {
    expect(parentPath(resolveGamesPath("/games/arcade/snake"))).toBe("/games/arcade");
    expect(parentPath(resolveGamesPath("/games/kids/ready-for-school/first-math"))).toBe(
      "/games/kids/ready-for-school",
    );
    expect(parentPath(resolveGamesPath("/games/kids/ready-for-school"))).toBe("/games/kids");
    expect(parentPath(resolveGamesPath("/games/kids"))).toBe("/games");
    expect(parentPath(resolveGamesPath("/games"))).toBe("/");
  });

  it("builds an English breadcrumb trail for a non-Hebrew game", () => {
    const r = resolveGamesPath("/games/arcade/snake");
    expect(breadcrumbs(r, "en").map((c) => c.label)).toEqual(["Games", "Arcade", "Snake"]);
    expect(breadcrumbs(r, "en").at(-1).to).toBeNull();
  });

  it("builds a Hebrew breadcrumb trail for the Ready for School subtree", () => {
    const r = resolveGamesPath("/games/kids/ready-for-school/first-math");
    expect(isHebrewContext(r)).toBe(true);
    expect(breadcrumbs(r, "he").map((c) => c.label)).toEqual([
      "משחקים",
      "ילדים",
      "מוכנים לכיתה א׳",
      "חשבון ראשון",
    ]);
  });

  it("names every screen in the document title, localised for the Hebrew subtree", () => {
    expect(pageTitle(resolveGamesPath("/games"))).toBe("Games · Game Arcade");
    expect(pageTitle(resolveGamesPath("/games/arcade"))).toBe("Arcade · Game Arcade");
    expect(pageTitle(resolveGamesPath("/games/arcade/snake"))).toBe(
      "Snake · Game Arcade",
    );
    const school = resolveGamesPath("/games/kids/ready-for-school/first-math");
    expect(pageTitle(school, "he")).toBe("חשבון ראשון · Game Arcade");
    expect(pageTitle(resolveGamesPath("/games/nope/nope"))).toBe(
      "Page not found · Game Arcade",
    );
  });

  it("allPaths() enumerates root + every category, group and game", () => {
    const { root, categories, groups, games } = allPaths();
    expect(root).toBe("/games");
    expect(categories).toHaveLength(CATEGORIES.length);
    expect(games).toHaveLength(GAMES.length);
    const declaredGroups = Object.values(CATEGORY_GROUPS).flat().length;
    expect(groups).toHaveLength(declaredGroups);
  });
});
