import { test, expect } from "@playwright/test";
import { gotoMenu, openGame, backToMenu } from "./helpers.js";

test.describe("Game menu", () => {
  test("lists all five games", async ({ page }) => {
    await gotoMenu(page);
    const labels = await page.locator(".game-card-label").allTextContents();
    expect(labels).toEqual([
      "Memory Match",
      "Speed Match",
      "Time Attack",
      "Survival",
      "Sequence Recall",
    ]);
  });

  test("entering and returning from every game works, with no console errors", async ({
    page,
  }) => {
    const errors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await gotoMenu(page);
    for (const label of [
      "Memory Match",
      "Speed Match",
      "Time Attack",
      "Survival",
      "Sequence Recall",
    ]) {
      await openGame(page, label);
      await expect(page.getByText(label)).toBeVisible();
      await backToMenu(page);
    }

    expect(errors).toEqual([]);
  });

  test("theme switcher changes the board's card count", async ({ page }) => {
    await gotoMenu(page);
    await openGame(page, "Memory Match");

    await expect(page.locator(".cards-grid .card")).toHaveCount(16); // 8 dev-tools icons, doubled

    await page.getByRole("button", { name: "Gabby's Dollhouse" }).click();
    await expect(page.locator(".cards-grid .card")).toHaveCount(14); // 7 gabby icons, doubled
  });
});
