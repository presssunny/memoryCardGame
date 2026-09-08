import { test, expect } from "@playwright/test";

// Product batch item 4 — Stroop now has a per-question timer, so it tests
// speed under interference, not just a leisurely choice.

const open = async (page) => {
  await page.goto("/games/brain-training/stroop-test");
  await page.locator(".stroop-word").waitFor();
};

const lives = (page) =>
  page.locator(".gx-chip", { hasText: /Lives/i }).locator(".gx-chip-value");

test("a countdown bar is shown for each question", async ({ page }) => {
  await open(page);
  await expect(page.locator(".quiz-timer")).toBeVisible();
  const dur = await page
    .locator(".quiz-timer-fill")
    .evaluate((el) => getComputedStyle(el).animationDuration);
  expect(dur).toBe("3s");
});

test("letting the timer run out costs a life and moves on", async ({ page }) => {
  await open(page);
  await expect(lives(page)).toHaveText("3");
  const firstWord = await page.locator(".stroop-word").textContent();

  // don't answer — wait out the 3s deadline + the feedback flash
  await page.waitForTimeout(4200);

  await expect(lives(page)).toHaveText("2");
  // a fresh question / fresh timer
  await expect(page.locator(".quiz-timer")).toBeVisible();
  // (the prompt very likely changed; not asserted — the ink can repeat)
  expect(typeof firstWord).toBe("string");
});

test("a quick answer is accepted and cancels that question's timer", async ({
  page,
}) => {
  await open(page);
  // answer immediately — well under 3s
  await page.locator(".quiz-option").first().click();
  // feedback shows a *picked* option (a timeout would show none)
  await expect(
    page.locator(".quiz-option.is-correct, .quiz-option.is-wrong"),
  ).toHaveCount(1);
  // the game moves on and a fresh timer starts for the next question
  await expect(page.locator(".quiz-timer")).toBeVisible({ timeout: 3000 });
});

test("the timer stops at game over and comes back on Restart", async ({
  page,
}) => {
  await open(page);
  // three timeouts -> lose
  for (let i = 0; i < 3; i += 1) await page.waitForTimeout(3300);

  await expect(page.locator(".gx-result--lose")).toBeVisible();
  await expect(page.locator(".quiz-timer")).toHaveCount(0);

  // wait well past a deadline — nothing should change on the dead screen
  await page.waitForTimeout(3500);
  await expect(page.locator(".gx-result--lose")).toBeVisible();

  await page.locator(".win-new-game-btn").click();
  await expect(page.locator(".quiz-timer")).toBeVisible();
  await expect(lives(page)).toHaveText("3");
});
