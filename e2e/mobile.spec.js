import { test, expect } from "@playwright/test";
import { gotoMenu, openCategory, openGameCard } from "./helpers.js";

// A narrow phone. The rest of the suite runs desktop Chrome, so this file is
// the only guard that the new layouts don't overflow sideways on mobile.
test.use({ viewport: { width: 390, height: 844 } });

// document scrollWidth creeping past the viewport is the classic "a grid or
// board has a fixed px width" bug. Assert it nowhere on the riskiest screens.
async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => {
    const el = document.documentElement;
    return el.scrollWidth - el.clientWidth;
  });
  expect(overflow).toBeLessThanOrEqual(1);
}

test.describe("mobile layout — no horizontal overflow", () => {
  test("home and a category page fit the viewport", async ({ page }) => {
    await gotoMenu(page);
    await expectNoHorizontalOverflow(page);
    await openCategory(page, "Arcade");
    await expectNoHorizontalOverflow(page);
  });

  // The four widest boards: a 5×5 grid, a 10-key pad, a physics board and a
  // 4×4 tile grid.
  for (const [category, game] of [
    ["Brain Training", "Schulte Table"],
    ["Brain Training", "Digit Span"],
    ["Arcade", "Breakout"],
    ["Arcade", "2048"],
  ]) {
    test(`${game} board fits the viewport`, async ({ page }) => {
      await gotoMenu(page);
      await openCategory(page, category);
      await openGameCard(page, game);
      await page.locator(".game-header").waitFor();
      await expectNoHorizontalOverflow(page);
    });
  }
});
