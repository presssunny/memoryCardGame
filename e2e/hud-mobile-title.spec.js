import { test, expect } from "@playwright/test";
import { gotoMenu, openCategory, openGameCard } from "./helpers.js";

// UI/UX #6 — on a phone the in-game HUD title was squeezed between the back
// and sound buttons (~170px), so any multi-word name wrapped mid-phrase and
// the leading emoji could be orphaned. On mobile the title now takes its
// own full-width row; desktop is untouched.

test.describe("#6 — mobile HUD title", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  const LONG_TITLES = [
    ["Schulte Table (en)", "Brain Training", "Schulte Table"],
    ["First Math (he)", "Kids", "חשבון ראשון"],
    ["Which Doesn't Belong (he)", "Kids", "מה לא שייך?"],
    ["Follow Instructions (he)", "Kids", "מבצעים הוראות"],
    ["Memory Match (short)", "Brain Training", "Memory Match"],
  ];

  for (const [name, category, card] of LONG_TITLES) {
    test(`${name}: the title stays on one line, nothing overflows`, async ({
      page,
    }) => {
      await gotoMenu(page);
      await openCategory(page, category);
      await openGameCard(page, card);

      const title = page.locator(".gx-hud-title");
      const lines = await title.evaluate((el) => el.getClientRects().length);
      expect(lines, `${card} title line count`).toBe(1);

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
});

test.describe("#6 — desktop HUD title is unchanged", () => {
  test("the title still shares the row (not the mobile full-width override)", async ({
    page,
  }) => {
    await page.goto("/games/brain-training/schulte-table");
    await page.locator(".gx-hud-title").waitFor();
    const basis = await page
      .locator(".gx-hud-title")
      .evaluate((el) => getComputedStyle(el).flexBasis);
    expect(basis).not.toBe("100%");
  });
});
