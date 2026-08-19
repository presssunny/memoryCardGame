import { test, expect } from "@playwright/test";
import {
  gotoMenu,
  openGame,
  readRevealedValues,
} from "./helpers.js";

test("Speed Match: reveals, counts down, hides, then can be won from memory", async ({
  page,
}) => {
  await gotoMenu(page);
  await openGame(page, "Speed Match");

  // memorize phase: board starts fully revealed
  await expect(page.locator(".phase-overlay")).toBeVisible();
  await expect(page.locator(".card.flipped")).toHaveCount(
    await page.locator(".card").count(),
  );

  const values = await readRevealedValues(page);

  // countdown, then the board hides itself automatically
  await expect(page.locator(".phase-overlay")).toBeHidden({ timeout: 8000 });
  await expect(page.locator(".card.flipped")).toHaveCount(0);

  // win using the values captured during the reveal -- proves the hide was
  // real (the DOM no longer exposes them) and the phase machine handed off
  // correctly into a playable board
  const byValue = {};
  values.forEach((v, i) => {
    (byValue[v] ??= []).push(i);
  });

  const cards = await page.locator(".card").elementHandles();
  for (const [a, b] of Object.values(byValue)) {
    if (a === undefined || b === undefined) continue;
    await cards[a].click();
    await page.waitForTimeout(60);
    await cards[b].click();
    await page.waitForTimeout(650);
  }

  await expect(page.getByText("Congratulations!")).toBeVisible();
});
