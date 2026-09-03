import { test, expect } from "@playwright/test";
import { gotoMenu } from "./helpers.js";

// Sample paths that exercise every depth of the hierarchy.
const GAME_PATHS = [
  { path: "/games/arcade/snake", heading: "Snake" },
  { path: "/games/arcade/2048", heading: "2048" },
  { path: "/games/brain-training/reaction-time", heading: "Reaction Time" },
  { path: "/games/brain-training/pattern-grid", heading: "Pattern Grid" },
  { path: "/games/for-developers/bug-hunt", heading: "Bug Hunt" },
  { path: "/games/for-developers/typing-test", heading: "Typing Test" },
  { path: "/games/kids/fun/animal-match", heading: null },
  { path: "/games/kids/ready-for-school/hebrew/find-the-letter", heading: null },
  { path: "/games/kids/ready-for-school/math/first-math", heading: null },
];

test.describe("Routing — direct navigation", () => {
  for (const { path } of GAME_PATHS) {
    test(`opening ${path} directly lands on that game`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator(".game-header")).toBeVisible();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
    });
  }

  test("the games index lists the four categories", async ({ page }) => {
    await page.goto("/games");
    await expect(page.locator(".hp-category-card")).toHaveCount(4);
  });

  test("a category URL opens that category page", async ({ page }) => {
    await page.goto("/games/arcade");
    await expect(page.locator(".catpage-title")).toHaveText("Arcade");
  });

  test("a sub-category URL opens the focused section, in Hebrew for Ready for School", async ({
    page,
  }) => {
    await page.goto("/games/kids/ready-for-school");
    await expect(page.locator(".catpage-title")).toHaveText("מוכנים לכיתה א׳");
    await expect(page.locator(".catpage-grid .game-card")).toHaveCount(8);
    await expect(page.locator("main")).toHaveAttribute("dir", "rtl");
    // the three strands, each linking to its own focused page
    await expect(page.locator(".catpage-section-link")).toHaveCount(3);
  });

  test("a strand URL opens just that strand's games", async ({ page }) => {
    await page.goto("/games/kids/ready-for-school/math");
    await expect(page.locator(".catpage-title")).toHaveText("חשבון");
    await expect(page.locator(".catpage-grid .game-card")).toHaveCount(3);
    await expect(page.locator("main")).toHaveAttribute("dir", "rtl");
  });

  test("a legacy pre-strand game URL redirects to the deep path", async ({ page }) => {
    await page.goto("/games/kids/ready-for-school/first-math");
    await expect(page).toHaveURL(/\/games\/kids\/ready-for-school\/math\/first-math$/);
    await expect(page.locator(".game-header")).toBeVisible();
  });

  test("an unknown game URL shows Not Found, not a crash", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/games/arcade/not-a-real-game");
    await expect(page.getByText("Page not found")).toBeVisible();
    await page.locator(".catpage-back").click();
    await expect(page).toHaveURL(/\/games$/);
    expect(errors).toEqual([]);
  });

  test("a wrong-group game URL is Not Found", async ({ page }) => {
    await page.goto("/games/kids/fun/find-the-letter");
    await expect(page.getByText("Page not found")).toBeVisible();
  });
});

test.describe("Routing — refresh, back/forward, breadcrumbs", () => {
  test("refresh inside a game keeps you in that game", async ({ page }) => {
    await page.goto("/games/arcade/snake");
    await expect(page.locator(".game-header")).toBeVisible();
    await page.reload();
    await expect(page).toHaveURL(/\/games\/arcade\/snake$/);
    await expect(page.locator(".game-header")).toBeVisible();
  });

  test("browser Back walks the hierarchy one level at a time", async ({
    page,
  }) => {
    await gotoMenu(page);
    await page.locator(".hp-nav-link", { hasText: "Games" }).click();
    await expect(page).toHaveURL(/\/games$/);
    await page.locator(".hp-category-card", { hasText: "Kids" }).click();
    await expect(page).toHaveURL(/\/games\/kids$/);
    await page.locator(".catpage-section-link", { hasText: "מוכנים" }).click();
    await expect(page).toHaveURL(/\/games\/kids\/ready-for-school$/);
    // href-based so rewording a strand's blurb can't make this ambiguous
    await page.locator('a.catpage-section-link[href$="/ready-for-school/math"]').click();
    await expect(page).toHaveURL(/\/games\/kids\/ready-for-school\/math$/);
    await page.locator(".game-card", { hasText: "חשבון ראשון" }).click();
    await expect(page).toHaveURL(
      /\/games\/kids\/ready-for-school\/math\/first-math$/,
    );

    await page.goBack();
    await expect(page).toHaveURL(/\/games\/kids\/ready-for-school\/math$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/games\/kids\/ready-for-school$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/games\/kids\/ready-for-school\/math$/);
  });

  test("in-game back follows the hierarchy, not history", async ({ page }) => {
    // Reached the game by a direct link — "back" still goes to its parent.
    await page.goto("/games/kids/ready-for-school/math/first-math");
    await page.locator(".back-btn").click();
    await expect(page).toHaveURL(/\/games\/kids\/ready-for-school\/math$/);
  });

  test("the breadcrumb trail reflects the current location", async ({ page }) => {
    await page.goto("/games/arcade/snake");
    // in-game we skip the crumb bar; check it on the category instead
    await page.goto("/games/kids/ready-for-school");
    const crumbs = page.locator(".hp-crumbs li");
    await expect(crumbs).toContainText(["משחקים", "ילדים", "מוכנים לכיתה א׳"]);
    await page.locator(".hp-crumbs a", { hasText: "ילדים" }).click();
    await expect(page).toHaveURL(/\/games\/kids$/);
  });
});
