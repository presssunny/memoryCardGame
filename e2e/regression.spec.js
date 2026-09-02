import { test, expect } from "@playwright/test";
import { gotoMenu, openGame } from "./helpers.js";

test.describe("Regression: board-corruption bug (restart/theme-switch mid-resolution)", () => {
  test("restarting during a pending match/mismatch resolution leaves a clean board", async ({
    page,
  }) => {
    await gotoMenu(page);
    await openGame(page, "Memory Match");

    const cards = await page.locator(".card").elementHandles();
    await cards[0].click();
    await page.waitForTimeout(60);
    await cards[1].click();
    // still mid-resolution: mismatch flip-back is 1000ms, match confirm 500ms
    await page.waitForTimeout(150);
    await page.locator(".reset-btn").click();

    // give any stale timeout the time it would need to fire
    await page.waitForTimeout(1500);

    await expect(page.locator(".card.flipped")).toHaveCount(0);
    await expect(page.locator(".card.matched")).toHaveCount(0);
    await expect(page.locator(".stat-value").first()).toHaveText("0");
    await expect(page.locator(".stat-value").nth(1)).toHaveText("0");
  });

  test("switching theme during a pending resolution leaves the new board clean", async ({
    page,
  }) => {
    await gotoMenu(page);
    await openGame(page, "Memory Match");

    const cards = await page.locator(".card").elementHandles();
    await cards[2].click();
    await page.waitForTimeout(60);
    await cards[3].click();
    await page.waitForTimeout(150);

    await page.getByRole("button", { name: "Gabby's Dollhouse" }).click();
    await page.waitForTimeout(1500);

    await expect(page.locator(".cards-grid .card")).toHaveCount(14);
    await expect(page.locator(".card.matched")).toHaveCount(0);
  });

  test("leaving the game and returning starts a genuinely fresh board", async ({
    page,
  }) => {
    await gotoMenu(page);
    await openGame(page, "Memory Match");

    const cards = await page.locator(".card").elementHandles();
    await cards[0].click();
    await page.waitForTimeout(60);
    await cards[1].click();
    await page.waitForTimeout(150);

    await page.locator(".back-btn").click();
    await page.getByText("Game Arcade", { exact: true }).waitFor();
    await page.waitForTimeout(1500); // let any stale timeout try to fire

    await openGame(page, "Memory Match");
    await expect(page.locator(".card.flipped")).toHaveCount(0);
    await expect(page.locator(".stat-value").first()).toHaveText("0");
  });
});

test.describe("Regression: keyboard accessibility", () => {
  test("a card can be reached by Tab and flipped with Enter", async ({
    page,
  }) => {
    await gotoMenu(page);
    await openGame(page, "Memory Match");

    // Tab past the HUD controls onto the first card, however many there are.
    const firstCard = page.locator(".card").first();
    for (
      let i = 0;
      i < 15 &&
      !(await firstCard.evaluate((el) => el === document.activeElement));
      i++
    ) {
      await page.keyboard.press("Tab");
    }
    await expect(firstCard).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page.locator(".card.flipped")).toHaveCount(1);
  });

  test("Space also flips the focused card", async ({ page }) => {
    await gotoMenu(page);
    await openGame(page, "Memory Match");

    const firstCard = page.locator(".card").first();
    for (
      let i = 0;
      i < 15 &&
      !(await firstCard.evaluate((el) => el === document.activeElement));
      i++
    ) {
      await page.keyboard.press("Tab");
    }
    await page.keyboard.press(" ");
    await expect(page.locator(".card.flipped")).toHaveCount(1);
  });

  test("the menu itself is fully keyboard-navigable", async ({ page }) => {
    await gotoMenu(page);
    // The home page leads with a header and hero; Tab through them until the
    // first featured game card is focused, then activate it with Enter.
    const firstGame = page.locator(".game-card").first();
    for (
      let i = 0;
      i < 30 &&
      !(await firstGame.evaluate((el) => el === document.activeElement));
      i++
    ) {
      await page.keyboard.press("Tab");
    }
    await expect(firstGame).toBeFocused();
    await page.keyboard.press("Enter");
    await page.locator(".cards-grid").waitFor();
  });
});

test.describe("Regression: persistence edge cases", () => {
  test("corrupted best-scores JSON doesn't crash the app", async ({
    page,
  }) => {
    await gotoMenu(page);
    await page.evaluate(() =>
      localStorage.setItem("memory-game-best-scores", "{not valid json"),
    );
    await page.reload();
    await expect(page.getByText("Game Arcade", { exact: true })).toBeVisible();
    const stored = await page.evaluate(() =>
      localStorage.getItem("memory-game-best-scores"),
    );
    expect(() => JSON.parse(stored)).not.toThrow();
  });

  test("an invalid stored theme id falls back to the default theme", async ({
    page,
  }) => {
    await gotoMenu(page);
    await page.evaluate(() =>
      localStorage.setItem("memory-game-theme", '"not-a-real-theme"'),
    );
    await page.reload();
    await expect(page.getByText("Game Arcade", { exact: true })).toBeVisible();
  });

  test("a full page refresh mid-game returns to the menu, not a broken state", async ({
    page,
  }) => {
    await gotoMenu(page);
    await openGame(page, "Memory Match");
    const cards = await page.locator(".card").elementHandles();
    await cards[0].click();

    await page.reload();
    await expect(page.getByText("Game Arcade", { exact: true })).toBeVisible();
  });
});
