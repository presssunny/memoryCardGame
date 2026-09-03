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
      expect(p).toMatch(/^\/games\/[a-z0-9-]+(\/[a-z0-9-]+){1,3}$/);
    }
  });

  it("a game's path carries exactly the group / subgroup segments it declares", () => {
    for (const game of GAMES) {
      const segs = gamePath(game).split("/").filter(Boolean); // games, cat, [group], [subgroup], id
      const expected = ["games", game.category, game.group, game.subgroup, game.id].filter(
        Boolean,
      );
      expect(segs).toEqual(expected);
      if (game.group) expect(segs[1]).toBe("kids");
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

  it("resolves every declared strand (subgroup) path", () => {
    for (const [catId, groups] of Object.entries(CATEGORY_GROUPS)) {
      for (const g of groups) {
        for (const s of g.subgroups ?? []) {
          const r = resolveGamesPath(`/games/${catId}/${g.id}/${s.id}`);
          expect(r.type).toBe("subgroup");
          expect(r.subgroup.id).toBe(s.id);
          expect(r.group.id).toBe(g.id);
        }
      }
    }
  });

  it("redirects a legacy pre-strand game path to its canonical deep path", () => {
    const r = resolveGamesPath("/games/kids/ready-for-school/first-math");
    expect(r.type).toBe("redirect");
    expect(r.to).toBe("/games/kids/ready-for-school/math/first-math");
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
    expect(resolveGamesPath("/games/kids/ready-for-school/not-a-strand").type).toBe(
      "notfound",
    );
    expect(
      resolveGamesPath("/games/kids/ready-for-school/hebrew/first-math").type,
    ).toBe("notfound"); // real game, wrong strand
    // right game id, wrong group segment
    expect(resolveGamesPath("/games/kids/fun/find-the-letter").type).toBe("notfound");
    // a non-grouped game addressed with a stray segment
    expect(resolveGamesPath("/games/arcade/fun/snake").type).toBe("notfound");
  });

  it("points 'back' up one real level of the hierarchy", () => {
    expect(parentPath(resolveGamesPath("/games/arcade/snake"))).toBe("/games/arcade");
    expect(
      parentPath(resolveGamesPath("/games/kids/ready-for-school/math/first-math")),
    ).toBe("/games/kids/ready-for-school/math");
    expect(parentPath(resolveGamesPath("/games/kids/ready-for-school/math"))).toBe(
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

  it("builds a Hebrew breadcrumb trail through the strand for Ready for School", () => {
    const r = resolveGamesPath("/games/kids/ready-for-school/math/first-math");
    expect(isHebrewContext(r)).toBe(true);
    expect(breadcrumbs(r, "he").map((c) => c.label)).toEqual([
      "משחקים",
      "ילדים",
      "מוכנים לכיתה א׳",
      "חשבון",
      "חשבון ראשון",
    ]);
  });

  it("marks the strand page itself as Hebrew context", () => {
    const r = resolveGamesPath("/games/kids/ready-for-school/hebrew");
    expect(r.type).toBe("subgroup");
    expect(isHebrewContext(r)).toBe(true);
  });

  it("names every screen in the document title, localised for the Hebrew subtree", () => {
    expect(pageTitle(resolveGamesPath("/games"))).toBe("Games · Game Arcade");
    expect(pageTitle(resolveGamesPath("/games/arcade"))).toBe("Arcade · Game Arcade");
    expect(pageTitle(resolveGamesPath("/games/arcade/snake"))).toBe(
      "Snake · Game Arcade",
    );
    const school = resolveGamesPath("/games/kids/ready-for-school/math/first-math");
    expect(pageTitle(school, "he")).toBe("חשבון ראשון · Game Arcade");
    expect(
      pageTitle(resolveGamesPath("/games/kids/ready-for-school/hebrew"), "he"),
    ).toBe("עברית · Game Arcade");
    expect(pageTitle(resolveGamesPath("/games/nope/nope"))).toBe(
      "Page not found · Game Arcade",
    );
  });

  it("allPaths() enumerates root + every category, group, strand and game", () => {
    const { root, categories, groups, subgroups, games } = allPaths();
    expect(root).toBe("/games");
    expect(categories).toHaveLength(CATEGORIES.length);
    expect(games).toHaveLength(GAMES.length);
    const declaredGroups = Object.values(CATEGORY_GROUPS).flat().length;
    expect(groups).toHaveLength(declaredGroups);
    const declaredSubgroups = Object.values(CATEGORY_GROUPS)
      .flat()
      .reduce((n, g) => n + (g.subgroups?.length ?? 0), 0);
    expect(subgroups).toHaveLength(declaredSubgroups);
    for (const p of [...groups, ...subgroups, ...games]) {
      expect(["group", "subgroup", "game"]).toContain(resolveGamesPath(p).type);
    }
  });
});
