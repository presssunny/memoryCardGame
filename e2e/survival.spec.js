import { test, expect } from "@playwright/test";
import { gotoMenu, openGame, clickOnePairAttempt } from "./helpers.js";

test("Survival: shows a move budget that counts down, and Restart resets it", async ({
  page,
}) => {
  await gotoMenu(page);
  await openGame(page, "Survival");

  const initialLeft = await page.locator(".stat-value").last().textContent();
  expect(Number(initialLeft)).toBeGreaterThan(0);

  await clickOnePairAttempt(page);
  const afterOneMove = await page.locator(".stat-value").last().textContent();
  expect(Number(afterOneMove)).toBe(Number(initialLeft) - 1);

  await page.locator(".reset-btn").click();
  await expect(page.locator(".stat-value").last()).toHaveText(initialLeft);
});
