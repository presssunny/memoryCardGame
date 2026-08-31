import { test, expect } from "@playwright/test";
import { gotoMenu, openCategory, openGameCard } from "./helpers.js";

const CATEGORY_TITLES = ["Kids", "Brain Training", "Arcade", "For Developers"];

test.describe("Browse Categories", () => {
  test("the home page shows all four category cards with game counts", async ({
    page,
  }) => {
    await gotoMenu(page);
    const cards = page.locator(".hp-category-card");
    await expect(cards).toHaveCount(4);
    for (const title of CATEGORY_TITLES) {
      const card = cards.filter({ hasText: title });
      await expect(card).toHaveCount(1);
      await expect(card).toContainText(/\d+ games?/);
    }
  });

  test("each category opens to its own page and returns home", async ({
    page,
  }) => {
    for (const title of CATEGORY_TITLES) {
      await gotoMenu(page);
      await openCategory(page, title);
      await expect(page.locator(".catpage-title")).toHaveText(title);

      // Either a grid of games or the "coming soon" empty state — never blank.
      const hasGames = (await page.locator(".catpage-grid .game-card").count()) > 0;
      const hasEmpty = (await page.locator(".catpage-empty").count()) > 0;
      expect(hasGames || hasEmpty).toBe(true);

      await page.locator(".catpage-back").click();
      await expect(page.getByText("Game Arcade", { exact: true })).toBeVisible();
      await expect(page.locator(".hp-category-grid")).toBeVisible();
    }
  });

  test("home → category → game → back → category → back → home", async ({
    page,
  }) => {
    await gotoMenu(page);
    await openCategory(page, "Brain Training");

    const firstGame = page.locator(".catpage-grid .game-card").first();
    const gameLabel = await firstGame.locator(".game-card-label").textContent();
    await firstGame.click();
    await page.locator(".game-header").waitFor();

    // Back from the game returns to the category we came from, not home.
    await page.locator(".back-btn").click();
    await expect(page.locator(".catpage-title")).toHaveText("Brain Training");
    await expect(
      page.locator(".catpage-grid .game-card", { hasText: gameLabel }),
    ).toBeVisible();

    // Back from the category returns home.
    await page.locator(".catpage-back").click();
    await expect(page.locator(".hp-category-grid")).toBeVisible();
  });

  test("browsing categories produces no console errors", async ({ page }) => {
    const errors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await gotoMenu(page);
    for (const title of CATEGORY_TITLES) {
      await openCategory(page, title);
      await page.locator(".catpage-back").click();
      await page.locator(".hp-category-grid").waitFor();
    }

    // Open one game through a category and come back.
    await openCategory(page, "Arcade");
    await openGameCard(page, "Time Attack");
    await page.locator(".back-btn").click();
    await expect(page.locator(".catpage-title")).toHaveText("Arcade");

    expect(errors).toEqual([]);
  });
});
