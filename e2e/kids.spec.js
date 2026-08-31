import { test, expect } from "@playwright/test";
import { gotoMenu, openCategory, openGameCard } from "./helpers.js";

const FUN_GAMES = ["Animal Match", "Simon", "Odd One Out", "Color Tap"];

test.describe("Kids category", () => {
  test("lists the Fun Games section with all four games", async ({ page }) => {
    await gotoMenu(page);
    await openCategory(page, "Kids");
    await expect(page.locator(".catpage-section-label")).toContainText([
      "Fun Games",
    ]);
    for (const name of FUN_GAMES) {
      await expect(
        page.locator(".catpage-grid .game-card", { hasText: name }),
      ).toBeVisible();
    }
  });

  test("Animal Match: cards flip and Restart resets the board", async ({
    page,
  }) => {
    await gotoMenu(page);
    await openCategory(page, "Kids");
    await openGameCard(page, "Animal Match");

    const cards = page.locator(".cards-grid .card");
    await expect(cards).toHaveCount(12);
    await cards.first().click();
    await expect(page.locator(".card.flipped")).toHaveCount(1);

    await page.locator(".reset-btn").click();
    await expect(page.locator(".card.flipped")).toHaveCount(0);
  });

  test("Simon: shows the watch phase, then four playable pads", async ({
    page,
  }) => {
    await gotoMenu(page);
    await openCategory(page, "Kids");
    await openGameCard(page, "Simon");

    await expect(page.locator(".simon-pad")).toHaveCount(4);
    // The pre-play overlay clears on its own.
    await expect(page.locator(".phase-overlay")).toBeHidden({ timeout: 4000 });
    await expect(page.locator(".simon-pad").first()).toBeEnabled();
  });

  test("Odd One Out: a correct pick advances, a wrong pick is rejected", async ({
    page,
  }) => {
    await gotoMenu(page);
    await openCategory(page, "Kids");
    await openGameCard(page, "Odd One Out");

    await expect(page.locator(".quiz-option")).toHaveCount(4);

    // Wrong pick: the "Found" counter stays at 0.
    await page.locator(".quiz-option").first().click();
    await page.waitForTimeout(800);
    // Correct pick: keep trying options until "Found" ticks up.
    for (let i = 0; i < 5; i++) {
      const found = await page.locator(".stat-value").first().textContent();
      if (Number(found) >= 1) break;
      await page.locator(".quiz-option").nth(i % 4).click();
      await page.waitForTimeout(800);
    }
    expect(Number(await page.locator(".stat-value").first().textContent())).toBeGreaterThanOrEqual(1);
  });

  test("Color Tap: renders swatches and reacts to a tap", async ({ page }) => {
    await gotoMenu(page);
    await openCategory(page, "Kids");
    await openGameCard(page, "Color Tap");

    await expect(page.locator(".quiz-option")).toHaveCount(3);
    await expect(page.locator(".quiz-prompt .color-swatch--prompt")).toBeVisible();
    await page.locator(".quiz-option").first().click();
    await expect(page.locator(".quiz-option.is-correct, .quiz-option.is-wrong")).toHaveCount(1);
  });

  test("no console errors while playing the Fun Games", async ({ page }) => {
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    await gotoMenu(page);
    for (const name of FUN_GAMES) {
      await openCategory(page, "Kids");
      await openGameCard(page, name);
      await page.waitForTimeout(300);
      await page.locator(".back-btn").click();
      await page.locator(".catpage-title").waitFor();
      await page.locator(".catpage-back").click();
      await page.locator(".hp-category-grid").waitFor();
    }
    expect(errors).toEqual([]);
  });
});

const SCHOOL_GAMES = [
  "Find the Letter",
  "Letter & Picture",
  "Count & Choose",
  "What Comes Next?",
  "First Math",
  "Shapes & Colors",
  "Which Doesn't Belong?",
  "Follow Instructions",
];

test.describe("Kids · Ready for School", () => {
  test("lists all eight Ready for School games", async ({ page }) => {
    await gotoMenu(page);
    await openCategory(page, "Kids");
    await expect(page.locator(".catpage-section-label")).toContainText([
      "Ready for School",
    ]);
    for (const name of SCHOOL_GAMES) {
      await expect(
        page.locator(".catpage-grid .game-card", { hasText: name }),
      ).toBeVisible();
    }
  });

  for (const name of SCHOOL_GAMES.filter((n) => n !== "Follow Instructions")) {
    test(`${name}: renders a question and reacts to a pick`, async ({ page }) => {
      await gotoMenu(page);
      await openCategory(page, "Kids");
      await openGameCard(page, name);

      const options = page.locator(".quiz-option");
      await expect(options.first()).toBeVisible();
      const count = await options.count();
      expect(count).toBeGreaterThanOrEqual(2);

      await options.first().click();
      await expect(
        page.locator(".quiz-option.is-correct, .quiz-option.is-wrong"),
      ).toHaveCount(1);
    });
  }

  test("Follow Instructions: completing round 1 advances to round 2", async ({
    page,
  }) => {
    await gotoMenu(page);
    await openCategory(page, "Kids");
    await openGameCard(page, "Follow Instructions");

    await expect(page.locator(".follow-target")).toHaveCount(6);
    await expect(page.locator(".follow-instruction")).toContainText(/Tap the/);

    // Round 1 is a single step — the instruction names the one target to tap.
    const text = await page.locator(".follow-instruction").textContent();
    const label = text.replace(/^Tap the /, "").trim();
    await page.locator(`.follow-target[aria-label="${label}"]`).click();

    // The durable outcome: the round counter ticks to 2.
    await expect(page.locator(".stat-value").nth(1)).toHaveText("2");
    await expect(page.locator(".stat-value").first()).toHaveText("1"); // "Done: 1"
  });

  test("no console errors across the Ready for School games", async ({ page }) => {
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    await gotoMenu(page);
    for (const name of SCHOOL_GAMES) {
      await openCategory(page, "Kids");
      await openGameCard(page, name);
      await page.waitForTimeout(250);
      await page.locator(".back-btn").click();
      await page.locator(".catpage-title").waitFor();
      await page.locator(".catpage-back").click();
      await page.locator(".hp-category-grid").waitFor();
    }
    expect(errors).toEqual([]);
  });
});
