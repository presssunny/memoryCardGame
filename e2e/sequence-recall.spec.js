import { test, expect } from "@playwright/test";

const openGame = async (page) => {
  await page.goto("/games/brain-training/sequence-recall");
  await page.locator(".game-header").waitFor();
};

// Round 1 is always a single flashed card. Press the "▶ Start" gate, wait
// for the card to flip, then read its index directly rather than guessing.
async function watchRound1Card(page) {
  await page.locator(".phase-start-btn").click(); // dismiss the Start gate
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
  await openGame(page);

  const index = await watchRound1Card(page);
  await expect(page.locator(".phase-overlay")).toBeHidden({ timeout: 3000 });

  await page.locator(".card").nth(index).click();

  await expect(page.locator(".stat-value").first()).toHaveText("2");
  await expect(page.locator(".phase-overlay")).toBeVisible();
});

test("Sequence Recall: a wrong click ends the round and Try Again restarts it", async ({
  page,
}) => {
  await openGame(page);

  const index = await watchRound1Card(page);
  await expect(page.locator(".phase-overlay")).toBeHidden({ timeout: 3000 });

  const wrongIndex = index === 0 ? 1 : 0;
  await page.locator(".card").nth(wrongIndex).click();

  await expect(page.getByText("Sequence broken!")).toBeVisible();
  await expect(page.getByText("You correctly repeated 0 rounds.")).toBeVisible();

  // Play Again returns to a fresh "▶ Start" gate at round 1.
  await page.locator(".win-new-game-btn").click();
  await expect(page.locator(".phase-start-btn")).toBeVisible();
  await expect(page.locator(".stat-value").first()).toHaveText("1");
});
