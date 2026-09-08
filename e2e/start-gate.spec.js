import { test, expect } from "@playwright/test";

const open = async (page, path) => {
  await page.goto(path);
  await page.locator(".game-header").waitFor();
};

// Product batch item 1 — the memory games open on a "▶ Start" gate so the
// first flashed token is never missed while the player is still orienting.
// Nothing plays, and no board shows, until the button is pressed. The
// gate is in-flow, so the header's Back / Restart stay reachable.

const CASES = [
  {
    name: "Digit Span",
    path: "/games/brain-training/digit-span",
    idleGone: ".digitspan-keys, .digitspan-typed",
    started: async (page) =>
      expect(page.locator(".digitspan-keys")).toBeVisible({ timeout: 6000 }),
  },
  {
    name: "Pattern Grid",
    path: "/games/brain-training/pattern-grid",
    idleGone: ".pattern-cell",
    started: async (page) =>
      expect(page.locator(".pattern-cell")).toHaveCount(16, { timeout: 4000 }),
  },
  {
    name: "Sequence Recall",
    path: "/games/brain-training/sequence-recall",
    idleGone: ".cards-grid",
    started: async (page) =>
      page.waitForFunction(
        () => document.querySelector(".cards-grid .card.flipped") !== null,
        { timeout: 3000 },
      ),
  },
  {
    name: "Terminal Recall",
    path: "/games/for-developers/terminal-recall",
    idleGone: ".terminal-keys",
    started: async (page) =>
      page.waitForFunction(
        () => document.querySelector(".terminal-key.is-lit") !== null,
        { timeout: 3000 },
      ),
  },
];

for (const c of CASES) {
  test(`${c.name}: nothing plays until "▶ Start" is pressed`, async ({ page }) => {
    await open(page, c.path);

    // On the gate: Start button up, no board, and after a generous wait the
    // game still hasn't begun.
    await expect(page.locator(".phase-start-btn")).toBeVisible();
    await expect(page.locator(c.idleGone)).toHaveCount(0);
    await page.waitForTimeout(1800);
    await expect(page.locator(c.idleGone)).toHaveCount(0);
    await expect(page.locator(".phase-start-btn")).toBeVisible();
    // the header stays reachable behind/around the in-flow gate
    await expect(page.locator(".back-btn")).toBeVisible();

    // Press Start → the game begins.
    await page.locator(".phase-start-btn").click();
    await expect(page.locator(".phase-start-btn")).toHaveCount(0);
    await c.started(page);
  });

  test(`${c.name}: Restart returns to the Start gate`, async ({ page }) => {
    await open(page, c.path);
    await page.locator(".phase-start-btn").click();
    await expect(page.locator(".phase-start-btn")).toHaveCount(0);
    await page.locator(".reset-btn").click();
    await expect(page.locator(".phase-start-btn")).toBeVisible();
  });
}
