import { test, expect } from "@playwright/test";
import { gotoMenu, openCategory, openGameCard } from "./helpers.js";

const GAMES = [
  "Stroop Test",
  "Math Sprint",
  "Reaction Time",
  "Schulte Table",
  "Digit Span",
  "Pattern Grid",
];

test.describe("Brain Training category", () => {
  test("lists all six games", async ({ page }) => {
    await gotoMenu(page);
    await openCategory(page, "Brain Training");
    for (const name of GAMES) {
      await expect(
        page.locator(".catpage-grid .game-card", { hasText: name }),
      ).toBeVisible();
    }
  });

  test("Stroop Test: pick an ink colour and get feedback", async ({ page }) => {
    await gotoMenu(page);
    await openCategory(page, "Brain Training");
    await openGameCard(page, "Stroop Test");
    await expect(page.locator(".stroop-word")).toBeVisible();
    await page.locator(".quiz-option").first().click();
    await expect(
      page.locator(".quiz-option.is-correct, .quiz-option.is-wrong"),
    ).toHaveCount(1);
  });

  test("Math Sprint: shows a 45s clock that ticks", async ({ page }) => {
    await gotoMenu(page);
    await openCategory(page, "Brain Training");
    await openGameCard(page, "Math Sprint");
    await expect(page.locator(".stat-value").last()).toHaveText("45s");
    // A 3·2·1 count-in holds the clock until it clears.
    await expect(page.locator(".phase-overlay")).toBeHidden({ timeout: 4000 });
    await expect(page.locator(".sprint-sum")).toBeVisible();
    await page.waitForTimeout(2100);
    expect(await page.locator(".stat-value").last().textContent()).not.toBe("45s");
  });

  test("Reaction Time: start → wait → GO → records a time", async ({ page }) => {
    await gotoMenu(page);
    await openCategory(page, "Brain Training");
    await openGameCard(page, "Reaction Time");

    await page.keyboard.press("Space"); // start with the keyboard
    await expect(page.locator(".reaction-pad--wait")).toBeVisible();
    await expect(page.locator(".reaction-pad--go")).toBeVisible({ timeout: 5000 });
    await page.keyboard.press("Space"); // react on green
    await expect(page.locator(".reaction-pad--result")).toBeVisible();
  });

  test("Schulte Table: 25 cells, tapping 1 then 2 advances the target", async ({
    page,
  }) => {
    await gotoMenu(page);
    await openCategory(page, "Brain Training");
    await openGameCard(page, "Schulte Table");

    await expect(page.locator(".schulte-cell")).toHaveCount(25);
    await expect(page.locator(".schulte-target")).toContainText("Find 1");
    await page.locator(".schulte-cell", { hasText: /^1$/ }).click();
    await expect(page.locator(".schulte-target")).toContainText("Find 2");
  });

  test("Digit Span: shows digits then a keypad, and the keyboard types digits", async ({
    page,
  }) => {
    await gotoMenu(page);
    await openCategory(page, "Brain Training");
    await openGameCard(page, "Digit Span");

    await expect(page.locator(".phase-overlay")).toBeVisible();
    await expect(page.locator(".digitspan-keys")).toBeVisible({ timeout: 6000 });
    await expect(page.locator(".digitspan-key")).toHaveCount(10);

    // Type digits on the physical keyboard — the game responds (a slot fills
    // on a right guess, or the round ends on a wrong one). Trying all ten
    // digits guarantees at least one hits.
    for (let d = 0; d <= 9; d++) {
      await page.keyboard.press(String(d));
      if (await page.locator(".digitspan-slot.is-filled, .gx-result--lose").count()) break;
    }
    await expect(
      page.locator(".digitspan-slot.is-filled, .gx-result--lose"),
    ).not.toHaveCount(0);
  });

  test("Pattern Grid: shows a pattern then an input grid", async ({ page }) => {
    await gotoMenu(page);
    await openCategory(page, "Brain Training");
    await openGameCard(page, "Pattern Grid");

    await expect(page.locator(".pattern-cell")).toHaveCount(16);
    await expect(page.locator(".phase-overlay")).toBeVisible();
    await expect(page.locator(".phase-overlay")).toBeHidden({ timeout: 4000 });
  });

  test("no console errors across the Brain Training games", async ({ page }) => {
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    await gotoMenu(page);
    for (const name of GAMES) {
      await openCategory(page, "Brain Training");
      await openGameCard(page, name);
      await page.waitForTimeout(400);
      await page.locator(".back-btn").click();
      await page.locator(".catpage-title").waitFor();
      await page.locator(".catpage-back").click();
      await page.locator(".hp-category-grid").waitFor();
    }
    expect(errors).toEqual([]);
  });
});
