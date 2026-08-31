import { test, expect } from "@playwright/test";
import { gotoMenu, openGame, backToMenu } from "./helpers.js";

test.describe("Home page", () => {
  test("shows a Featured shelf of playable game cards", async ({ page }) => {
    await gotoMenu(page);
    const cards = page.locator(".hp-featured-grid .game-card");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(5);
    const labels = await page
      .locator(".hp-featured-grid .game-card-label")
      .allTextContents();
    expect(labels.filter(Boolean)).toHaveLength(count);
    await expect(cards.filter({ hasText: "Memory Match" })).toHaveCount(1);
  });

  test("entering and returning from every featured game works, with no console errors", async ({
    page,
  }) => {
    const errors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await gotoMenu(page);
    const labels = (
      await page.locator(".hp-featured-grid .game-card-label").allTextContents()
    ).filter(Boolean);
    for (const label of labels) {
      await page
        .locator(".hp-featured-grid .game-card", { hasText: label })
        .click();
      await page.locator(".game-header").waitFor();
      await backToMenu(page);
    }

    expect(errors).toEqual([]);
  });

  test("the card theme switcher changes Memory Match's board size", async ({
    page,
  }) => {
    await gotoMenu(page);
    await openGame(page, "Memory Match");

    await expect(page.locator(".cards-grid .card")).toHaveCount(16); // 8 dev-tools icons, doubled

    await page.getByRole("button", { name: "Gabby's Dollhouse" }).click();
    await expect(page.locator(".cards-grid .card")).toHaveCount(14); // 7 gabby icons, doubled
  });
});
