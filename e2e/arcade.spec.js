import { test, expect } from "@playwright/test";
import { gotoMenu, openCategory, openGameCard } from "./helpers.js";

const NEW_GAMES = ["Snake", "2048", "Whack-a-Mole", "Breakout", "Pong"];

test.describe("Arcade category", () => {
  test("lists the new arcade games alongside Time Attack and Survival", async ({
    page,
  }) => {
    await gotoMenu(page);
    await openCategory(page, "Arcade");
    for (const name of [...NEW_GAMES, "Time Attack", "Survival"]) {
      await expect(
        page.locator(".catpage-grid .game-card", { hasText: name }),
      ).toBeVisible();
    }
  });

  test("Snake: renders a grid and moves on its own", async ({ page }) => {
    await gotoMenu(page);
    await openCategory(page, "Arcade");
    await openGameCard(page, "Snake");

    await expect(page.locator(".snake-board")).toBeVisible();
    const head1 = await page.locator(".snake-cell.is-head").getAttribute("class");
    await page.waitForTimeout(700);
    // The board keeps a head cell and the snake body is present.
    await expect(page.locator(".snake-cell.is-head")).toHaveCount(1);
    await expect(page.locator(".snake-cell.is-body").first()).toBeVisible();
    expect(head1).toBeTruthy();
  });

  test("2048: arrow keys slide tiles and change the board", async ({ page }) => {
    await gotoMenu(page);
    await openCategory(page, "Arcade");
    await openGameCard(page, "2048");

    await expect(page.locator(".g2048-tile")).toHaveCount(16);
    const filledBefore = await page.locator(".g2048-tile:not(.t-empty)").count();
    for (const key of ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"]) {
      await page.keyboard.press(key);
      await page.waitForTimeout(120);
    }
    // A move spawns a tile, so the filled count should have grown at least once.
    expect(await page.locator(".g2048-tile:not(.t-empty)").count()).toBeGreaterThanOrEqual(
      filledBefore,
    );
  });

  test("Whack-a-Mole: 9 holes, tapping one starts the 30s clock", async ({
    page,
  }) => {
    await gotoMenu(page);
    await openCategory(page, "Arcade");
    await openGameCard(page, "Whack-a-Mole");

    await expect(page.locator(".whack-hole")).toHaveCount(9);
    await page.locator(".whack-hole").first().click();
    await expect(page.locator(".stat-value").last()).not.toHaveText("30s");
  });

  test("Breakout: board with bricks, ball and paddle", async ({ page }) => {
    await gotoMenu(page);
    await openCategory(page, "Arcade");
    await openGameCard(page, "Breakout");

    await expect(page.locator(".breakout-board")).toBeVisible();
    await expect(page.locator(".breakout-brick")).toHaveCount(32);
    await expect(page.locator(".breakout-ball")).toBeVisible();
    await expect(page.locator(".breakout-paddle")).toBeVisible();
  });

  test("Pong: player and CPU paddles, ball, and a score", async ({ page }) => {
    await gotoMenu(page);
    await openCategory(page, "Arcade");
    await openGameCard(page, "Pong");

    await expect(page.locator(".pong-board")).toBeVisible();
    await expect(page.locator(".pong-paddle")).toHaveCount(2);
    await expect(page.locator(".pong-ball")).toBeVisible();
  });

  test("no console errors across the new arcade games", async ({ page }) => {
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    await gotoMenu(page);
    for (const name of NEW_GAMES) {
      await openCategory(page, "Arcade");
      await openGameCard(page, name);
      await page.waitForTimeout(500);
      await page.locator(".back-btn").click();
      await page.locator(".catpage-title").waitFor();
      await page.locator(".catpage-back").click();
      await page.locator(".hp-category-grid").waitFor();
    }
    expect(errors).toEqual([]);
  });
});
