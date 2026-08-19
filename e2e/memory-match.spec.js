import { test, expect } from "@playwright/test";
import { gotoMenu, openGame, backToMenu, winByBruteForce } from "./helpers.js";

test("Memory Match: full play-through to a win, with a best score recorded", async ({
  page,
}) => {
  // Winning by exhaustive brute force (no shuffle knowledge) can take a
  // while on a 16-card board in the worst case -- this is a real, if slow,
  // full regression path, not a flaky one, so it gets a longer budget
  // rather than a smaller board.
  test.setTimeout(120_000);

  await gotoMenu(page);
  await openGame(page, "Memory Match");

  const outcome = await winByBruteForce(page);
  expect(outcome.remaining).toBe(0);

  await expect(page.getByText("Congratulations!")).toBeVisible();
  await expect(page.getByText(/You completed the game with/)).toBeVisible();

  await page.locator(".win-new-game-btn").click();
  await backToMenu(page);

  await expect(
    page.locator(".game-card", { hasText: "Memory Match" }).locator(".game-card-best"),
  ).toContainText("moves");
});

test("Memory Match: restart mid-game deals a fresh, uncorrupted board", async ({
  page,
}) => {
  await gotoMenu(page);
  await openGame(page, "Memory Match");

  const cards = await page.locator(".card").elementHandles();
  await cards[0].click();
  await page.waitForTimeout(100);
  await page.locator(".reset-btn").click();

  await expect(page.locator(".card.flipped")).toHaveCount(0);
  await expect(page.locator(".card.matched")).toHaveCount(0);
  await expect(page.locator(".stat-value").first()).toHaveText("0");
});
