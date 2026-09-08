import { test, expect } from "@playwright/test";

// Product batch item 8 — Terminal Recall and the arcade boards showed only
// controls ("Arrow keys / WASD") with no word about the goal. Each now
// leads with what you're trying to do.

const CAPTION_CASES = [
  ["Snake", "/games/arcade/snake", ".gx-board-caption", /grow|wall|tail/i],
  ["2048", "/games/arcade/2048", ".gx-board-caption", /2048/],
  ["Breakout", "/games/arcade/breakout", ".gx-board-caption", /brick/i],
  ["Whack-a-Mole", "/games/arcade/whack-a-mole", ".gx-board-caption", /mole/i],
];

for (const [name, path, sel, re] of CAPTION_CASES) {
  test(`${name}: the board caption states the goal`, async ({ page }) => {
    await page.goto(path);
    await page.locator(".game-header").waitFor();
    await expect(page.locator(sel)).toHaveText(re);

    // and it doesn't push the page sideways
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("Whack-a-Mole: the ready caption names the 30-second goal", async ({
  page,
}) => {
  await page.goto("/games/arcade/whack-a-mole");
  await page.locator(".game-header").waitFor();
  await expect(page.locator(".gx-board-caption")).toHaveText(/30 second/i);
});

test("Terminal Recall: a play-time caption explains what to do", async ({
  page,
}) => {
  await page.goto("/games/for-developers/terminal-recall");
  await page.locator(".game-header").waitFor();
  await page.locator(".phase-start-btn").click();
  // during input the caption tells you to click them back in order
  await expect(page.locator(".arcade-controls")).toHaveText(
    /order/i,
    { timeout: 4000 },
  );
});

test.describe("mobile — captions don't break the layout", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const [name, path] of CAPTION_CASES.map((c) => [c[0], c[1]])) {
    test(`${name}: no horizontal overflow with the longer caption`, async ({
      page,
    }) => {
      await page.goto(path);
      await page.locator(".game-header").waitFor();
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
});
