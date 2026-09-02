import { test, expect } from "@playwright/test";
import { gotoMenu, openGame } from "./helpers.js";

// Round 1 is always a single flashed card. Wait for it to flip, then read
// its index directly rather than guessing which one it was.
async function watchRound1Card(page) {
  await expect(page.locator(".phase-overlay")).toBeVisible();
  await page.waitForFunction(
    () => document.querySelector(".cards-grid .card.flipped") !== null,
    { timeout: 3000 },
  );
  return page.evaluate(() =>
    Array.from(document.querySelectorAll(".cards-grid .card")).findIndex(
      (el) => el.classList.contains("flipped"),
    ),
  );
}

test("Sequence Recall: correctly repeating round 1 advances to round 2", async ({
  page,
}) => {
  await gotoMenu(page);
  await openGame(page, "Sequence Recall");

  const index = await watchRound1Card(page);
  await expect(page.locator(".phase-overlay")).toBeHidden({ timeout: 3000 });

  await page.locator(".card").nth(index).click();

  await expect(page.locator(".stat-value").first()).toHaveText("2");
  await expect(page.locator(".phase-overlay")).toBeVisible();
});

test("Sequence Recall: a wrong click ends the round and Try Again restarts it", async ({
  page,
}) => {
  await gotoMenu(page);
  await openGame(page, "Sequence Recall");

  const index = await watchRound1Card(page);
  await expect(page.locator(".phase-overlay")).toBeHidden({ timeout: 3000 });

  const wrongIndex = index === 0 ? 1 : 0;
  await page.locator(".card").nth(wrongIndex).click();

  await expect(page.getByText("Sequence broken!")).toBeVisible();
  await expect(page.getByText("You correctly repeated 0 rounds.")).toBeVisible();

  await page.locator(".win-new-game-btn").click();
  await expect(page.locator(".phase-overlay")).toBeVisible();
  await expect(page.locator(".stat-value").first()).toHaveText("1");
});
