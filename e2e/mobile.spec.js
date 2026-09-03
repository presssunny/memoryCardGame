import { test, expect } from "@playwright/test";
import { gotoMenu, openCategory, openGameCard } from "./helpers.js";

// The rest of the suite runs desktop Chrome. This file is the mobile guard:
// a narrow phone, every game opened, checking that nothing overflows
// sideways, no text is clipped in the chrome, touch targets are big enough,
// and the console stays clean.
test.use({ viewport: { width: 390, height: 844 } });

const GAMES_BY_CATEGORY = {
  Kids: [
    "Animal Match",
    "Simon",
    "Odd One Out",
    "Color Tap",
    // Ready for School — Hebrew-titled
    "מצאו את האות",
    "אות ותמונה",
    "סופרים ובוחרים",
    "מה בא אחר כך?",
    "חשבון ראשון",
    "צורות וצבעים",
    "מה לא שייך?",
    "מבצעים הוראות",
  ],
  "Brain Training": [
    "Memory Match",
    "Speed Match",
    "Sequence Recall",
    "Stroop Test",
    "Math Sprint",
    "Reaction Time",
    "Schulte Table",
    "Digit Span",
    "Pattern Grid",
  ],
  Arcade: [
    "Time Attack",
    "Survival",
    "Snake",
    "2048",
    "Whack-a-Mole",
    "Breakout",
    "Pong",
  ],
  "For Developers": [
    "Typing Test",
    "Git Command Match",
    "HTTP Status Match",
    "Bug Hunt",
    "Hex Color Guess",
    "Terminal Recall",
  ],
};

async function layoutReport(page) {
  return page.evaluate(() => {
    const docOverflow =
      document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const clipped = [];
    for (const sel of [
      ".game-header",
      ".game-card",
      ".quiz-option",
      ".stat-item",
      ".stat-value",
    ]) {
      for (const el of document.querySelectorAll(sel)) {
        if (el.scrollWidth > el.clientWidth + 2) clipped.push(sel);
      }
    }
    const tinyButtons = [...document.querySelectorAll("button")]
      .filter((b) => b.offsetParent !== null)
      .map((b) => b.getBoundingClientRect())
      .filter((r) => r.width > 0 && (r.width < 32 || r.height < 32)).length;
    return { docOverflow, clipped, tinyButtons };
  });
}

test.describe("mobile sweep — every game", () => {
  for (const [category, games] of Object.entries(GAMES_BY_CATEGORY)) {
    for (const game of games) {
      test(`${category} · ${game}`, async ({ page }) => {
        const errors = [];
        page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
        page.on("pageerror", (e) => errors.push(e.message));

        await gotoMenu(page);
        await openCategory(page, category);
        await openGameCard(page, game);
        await page.waitForTimeout(400);

        const r = await layoutReport(page);
        expect(r.docOverflow, "no horizontal page overflow").toBeLessThanOrEqual(1);
        expect(r.clipped, "no clipped text in chrome/cards/options").toEqual([]);
        expect(r.tinyButtons, "no sub-32px touch targets").toBe(0);
        expect(errors).toEqual([]);
      });
    }
  }

  test("a win overlay fits the mobile viewport (Follow Instructions)", async ({
    page,
  }) => {
    await gotoMenu(page);
    await openCategory(page, "Kids");
    await openGameCard(page, "מבצעים הוראות");

    // Play all 8 rounds: each instruction names its targets in order.
    for (let round = 0; round < 8; round += 1) {
      const text = await page.locator(".spoken-text").textContent();
      const labels = await page
        .locator(".follow-target")
        .evaluateAll((els) => els.map((el) => el.getAttribute("aria-label")));
      const ordered = labels
        .filter((l) => text.includes(l))
        .sort((a, b) => text.indexOf(a) - text.indexOf(b));
      for (const l of ordered) {
        await page.locator(`.follow-target[aria-label="${l}"]`).click();
        await page.waitForTimeout(150);
      }
      await page.waitForTimeout(500);
    }

    await expect(page.locator(".win-overlay")).toBeVisible();
    const r = await layoutReport(page);
    expect(r.docOverflow, "win overlay page overflow").toBeLessThanOrEqual(1);
    expect(r.clipped, "win overlay clipped text").toEqual([]);
    expect(r.tinyButtons).toBe(0);
  });

  test("home and every category page fit the viewport", async ({ page }) => {
    await gotoMenu(page);
    let r = await layoutReport(page);
    expect(r.docOverflow).toBeLessThanOrEqual(1);
    for (const category of Object.keys(GAMES_BY_CATEGORY)) {
      await openCategory(page, category);
      r = await layoutReport(page);
      expect(r.docOverflow, `${category} page overflow`).toBeLessThanOrEqual(1);
      expect(r.clipped, `${category} clipped text`).toEqual([]);
      await page.locator(".catpage-back").click();
      await page.locator(".hp-category-grid").waitFor();
    }
  });
});
