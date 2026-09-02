import { test, expect } from "@playwright/test";
import { gotoMenu, openCategory, openGameCard } from "./helpers.js";

const GAMES = [
  "Typing Test",
  "Git Command Match",
  "HTTP Status Match",
  "Bug Hunt",
  "Hex Color Guess",
  "Terminal Recall",
];

test.describe("For Developers category", () => {
  test("lists all six games", async ({ page }) => {
    await gotoMenu(page);
    await openCategory(page, "For Developers");
    for (const name of GAMES) {
      await expect(
        page.locator(".catpage-grid .game-card", { hasText: name }),
      ).toBeVisible();
    }
  });

  test("Git Command Match: a full board of text cards, flips on click", async ({
    page,
  }) => {
    await gotoMenu(page);
    await openCategory(page, "For Developers");
    await openGameCard(page, "Git Command Match");

    await expect(page.locator(".cards-grid--text .card")).toHaveCount(12);
    await page.locator(".card").first().click();
    await expect(page.locator(".card.flipped")).toHaveCount(1);
    await expect(page.locator(".card-text").first()).toBeVisible();
  });

  test("HTTP Status Match: renders a 12-card board", async ({ page }) => {
    await gotoMenu(page);
    await openCategory(page, "For Developers");
    await openGameCard(page, "HTTP Status Match");
    await expect(page.locator(".cards-grid--text .card")).toHaveCount(12);
  });

  test("Bug Hunt: shows code and one option per line", async ({ page }) => {
    await gotoMenu(page);
    await openCategory(page, "For Developers");
    await openGameCard(page, "Bug Hunt");

    await expect(page.locator(".bughunt-code")).toBeVisible();
    const lines = await page.locator(".bughunt-line").count();
    const options = await page.locator(".quiz-option").count();
    expect(options).toBe(lines);
    await page.locator(".quiz-option").first().click();
    await expect(
      page.locator(".quiz-option.is-correct, .quiz-option.is-wrong"),
    ).toHaveCount(1);
  });

  test("Bug Hunt: an answer opens the review panel and waits for Next Bug", async ({
    page,
  }) => {
    await page.goto("/games/for-developers/bug-hunt");
    await expect(page.locator(".bughunt-code")).toBeVisible();

    // Answer, then confirm the game does NOT auto-advance.
    await page.locator(".quiz-option").first().click();
    await expect(page.locator(".bughunt-review")).toBeVisible();
    await expect(page.locator(".bughunt-line.is-bug")).toHaveCount(1);
    await expect(page.getByText("🐛 The bug")).toBeVisible();
    await expect(page.getByText("✓ The fix")).toBeVisible();

    const firstSrc = await page.locator(".bughunt-src").first().textContent();
    await page.waitForTimeout(1200); // longer than the old auto-advance
    await expect(page.locator(".bughunt-review")).toBeVisible();
    expect(await page.locator(".bughunt-src").first().textContent()).toBe(firstSrc);

    // The player controls the advance.
    await page.locator(".quiz-review-next").click();
    await expect(page.locator(".bughunt-review")).toBeHidden();
  });

  test("Hex Color Guess: swatch prompt with hex options", async ({ page }) => {
    await gotoMenu(page);
    await openCategory(page, "For Developers");
    await openGameCard(page, "Hex Color Guess");

    await expect(page.locator(".quiz-prompt .color-swatch--prompt")).toBeVisible();
    await expect(page.locator(".quiz-option code").first()).toHaveText(/^#[0-9A-F]{6}$/);
    await page.locator(".quiz-option").first().click();
    await expect(
      page.locator(".quiz-option.is-correct, .quiz-option.is-wrong"),
    ).toHaveCount(1);
  });

  test("Terminal Recall: shows the watch phase then command buttons", async ({
    page,
  }) => {
    await gotoMenu(page);
    await openCategory(page, "For Developers");
    await openGameCard(page, "Terminal Recall");

    await expect(page.locator(".terminal-key")).toHaveCount(8);
    await expect(page.locator(".phase-overlay")).toBeHidden({ timeout: 4000 });
  });

  test("Typing Test: typing the target finishes with a WPM result", async ({
    page,
  }) => {
    await gotoMenu(page);
    await openCategory(page, "For Developers");
    await openGameCard(page, "Typing Test");

    const target = await page.locator(".typing-target").textContent();
    await page.locator(".typing-input").fill(target);
    await expect(page.getByText(/WPM/)).toBeVisible();
  });

  test("no console errors across the For Developers games", async ({ page }) => {
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    await gotoMenu(page);
    for (const name of GAMES) {
      await openCategory(page, "For Developers");
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
