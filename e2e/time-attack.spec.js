import { test, expect } from "@playwright/test";
import { gotoMenu, openGame, clickOnePairAttempt } from "./helpers.js";

test("Time Attack: shows a 60s clock, ticks down, and Restart resets it", async ({
  page,
}) => {
  await gotoMenu(page);
  await openGame(page, "Time Attack");

  await expect(page.locator(".stat-value").last()).toHaveText("60s");

  await page.waitForTimeout(2100);
  const midValue = await page.locator(".stat-value").last().textContent();
  expect(midValue).not.toBe("60s");

  await page.locator(".reset-btn").click();
  await expect(page.locator(".stat-value").last()).toHaveText("60s");
});

test("Time Attack: a pair attempt updates moves without breaking the clock", async ({
  page,
}) => {
  await gotoMenu(page);
  await openGame(page, "Time Attack");

  await clickOnePairAttempt(page);

  await expect(page.locator(".stat-value").nth(1)).toHaveText("1");
  const clock = await page.locator(".stat-value").last().textContent();
  expect(clock).toMatch(/^\d+s$/);
});
