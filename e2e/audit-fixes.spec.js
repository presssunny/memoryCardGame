import { test, expect } from "@playwright/test";

// Focused coverage for the audit fixes:
//   C1 — the watch/memorize overlay must not hide the board being studied
//   H2 — keyboard users can leave Snake / Reaction Time via the Back button
//   L6 — the phase overlay respects prefers-reduced-motion

// True when rect A does not overlap rect B (a small tolerance for borders).
function noOverlap(a, b, pad = 6) {
  return (
    a.x + a.width - pad <= b.x ||
    b.x + b.width - pad <= a.x ||
    a.y + a.height - pad <= b.y ||
    b.y + b.height - pad <= a.y
  );
}

test.describe("C1 — the memorize overlay no longer covers the board", () => {
  test("Pattern Grid: lit cells stay visible and un-covered while memorising", async ({
    page,
  }) => {
    await page.goto("/games/brain-training/pattern-grid");
    await expect(page.locator(".phase-overlay")).toBeVisible();

    // At least one lit cell is on screen during the "showing" phase...
    const lit = page.locator(".pattern-cell.is-lit").first();
    await expect(lit).toBeVisible();

    // ...the overlay does not dim/blur the page (non-blocking banner)...
    const pe = await page
      .locator(".phase-overlay")
      .evaluate((el) => getComputedStyle(el).pointerEvents);
    expect(pe).toBe("none");

    // ...and the message box is clear of the grid it sits over.
    const msg = await page.locator(".phase-message").boundingBox();
    const grid = await page.locator(".pattern-grid").boundingBox();
    const litBox = await lit.boundingBox();
    expect(noOverlap(msg, litBox)).toBe(true);
    // banner is pinned to the bottom edge, below the grid's centre
    expect(msg.y).toBeGreaterThan(grid.y + grid.height / 2);
  });

  test("Speed Match: the revealed board is not behind a blur while memorising", async ({
    page,
  }) => {
    await page.goto("/games/brain-training/speed-match");
    await expect(page.locator(".phase-overlay")).toBeVisible();
    await expect(page.locator(".card.flipped").first()).toBeVisible();

    const overlay = page.locator(".phase-overlay");
    const [pe, bd] = await overlay.evaluate((el) => {
      const s = getComputedStyle(el);
      return [s.pointerEvents, s.backdropFilter];
    });
    expect(pe).toBe("none");
    expect(bd === "none" || bd === "").toBe(true);

    const msg = await page.locator(".phase-message").boundingBox();
    const board = await page.locator(".cards-grid").boundingBox();
    // the message clears the centre of the board
    const centre = { x: board.x + board.width / 2, y: board.y + board.height / 2, width: 1, height: 1 };
    expect(noOverlap(msg, centre)).toBe(true);
  });
});

test.describe("L6 — the phase overlay honours prefers-reduced-motion", () => {
  test("Digit Span: the overlay and message don't animate", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/games/brain-training/digit-span");
    await expect(page.locator(".phase-overlay")).toBeVisible();

    const [overlayAnim, messageAnim] = await Promise.all([
      page.locator(".phase-overlay").evaluate((el) => getComputedStyle(el).animationName),
      page.locator(".phase-message").evaluate((el) => getComputedStyle(el).animationName),
    ]);
    expect(overlayAnim).toBe("none");
    expect(messageAnim).toBe("none");
  });
});

test.describe("H2 — keyboard users are not trapped", () => {
  test("Snake: the Back button works with Enter and Space", async ({ page }) => {
    await page.goto("/games/arcade/snake");
    // L1 lengthened the countdown by one ~700ms step (3·2·1·0 "Go!" before
    // running) — a wider margin keeps this comfortable under parallel load.
    await expect(page.locator(".snake-overlay")).toBeHidden({ timeout: 6000 });

    await page.locator(".back-btn").focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/games\/arcade$/);

    // ...and again with Space from the game.
    await page.goto("/games/arcade/snake");
    // L1 lengthened the countdown by one ~700ms step (3·2·1·0 "Go!" before
    // running) — a wider margin keeps this comfortable under parallel load.
    await expect(page.locator(".snake-overlay")).toBeHidden({ timeout: 6000 });
    await page.locator(".back-btn").focus();
    await page.keyboard.press(" ");
    await expect(page).toHaveURL(/\/games\/arcade$/);
  });

  test("Snake: Space still pauses when the game (not a button) has focus", async ({
    page,
  }) => {
    await page.goto("/games/arcade/snake");
    // L1 lengthened the countdown by one ~700ms step (3·2·1·0 "Go!" before
    // running) — a wider margin keeps this comfortable under parallel load.
    await expect(page.locator(".snake-overlay")).toBeHidden({ timeout: 6000 });
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press(" ");
    await expect(page.locator(".snake-overlay-title")).toHaveText("Paused");
  });

  test("Reaction Time: the Back button works with Space", async ({ page }) => {
    await page.goto("/games/brain-training/reaction-time");
    await expect(page.locator(".reaction-pad")).toBeVisible();

    await page.locator(".back-btn").focus();
    await page.keyboard.press(" ");
    await expect(page).toHaveURL(/\/games\/brain-training$/);
  });
});
