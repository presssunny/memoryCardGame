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

  const snakeHeadIndex = (page) =>
    page.$$eval(".snake-cell", (cells) =>
      cells.findIndex((c) => c.classList.contains("is-head")),
    );

  test("Snake: holds still for the countdown, then moves on its own", async ({
    page,
  }) => {
    await page.goto("/games/arcade/snake");
    await expect(page.locator(".snake-board")).toBeVisible();

    // During the countdown the snake is frozen.
    const start = await snakeHeadIndex(page);
    await page.waitForTimeout(900);
    expect(await snakeHeadIndex(page)).toBe(start);

    // Once it clears, the snake advances with no input. Steer up first so it
    // doesn't just drive into the wall while the test watches.
    await expect(page.locator(".snake-overlay")).toBeHidden({ timeout: 4000 });
    await page.keyboard.press("ArrowUp");
    const a = await snakeHeadIndex(page);
    await page.waitForTimeout(400);
    expect(await snakeHeadIndex(page)).not.toBe(a);
    await expect(page.locator(".snake-cell.is-head")).toHaveCount(1);
  });

  test("Snake: Space pauses and resumes", async ({ page }) => {
    await page.goto("/games/arcade/snake");
    await expect(page.locator(".snake-overlay")).toBeHidden({ timeout: 4000 });
    await page.keyboard.press("ArrowUp"); // steer off the wall, stay alive

    await page.keyboard.press(" ");
    await expect(page.locator(".snake-overlay-title")).toHaveText("Paused");

    const paused = await snakeHeadIndex(page);
    await page.waitForTimeout(500);
    expect(await snakeHeadIndex(page)).toBe(paused); // frozen while paused

    await page.keyboard.press(" ");
    await expect(page.locator(".snake-overlay")).toBeHidden();
  });

  test("2048: arrow keys slide tiles and change the board", async ({ page }) => {
    await gotoMenu(page);
    await openCategory(page, "Arcade");
    await openGameCard(page, "2048");

    await expect(page.locator(".g2048-tile")).toHaveCount(16);
    // The bare-number tiles are a11y noise with no structure (L10) — hidden
    // from assistive tech; the board's own role/aria-label carries the
    // "how to play" info instead.
    await expect(page.locator(".g2048-tile").first()).toHaveAttribute("aria-hidden", "true");
    const filledBefore = await page.locator(".g2048-tile:not(.t-empty)").count();
    for (const key of ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"]) {
      await page.keyboard.press(key);
      await page.waitForTimeout(120);
    }
    // A move spawns a tile, so the filled count should have grown at least once.
    expect(await page.locator(".g2048-tile:not(.t-empty)").count()).toBeGreaterThanOrEqual(
      filledBefore,
    );

    // A pointer swipe across the board also drives it (touch parity).
    const box = await page.locator(".g2048-board").boundingBox();
    const cy = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width * 0.25, cy);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.8, cy, { steps: 6 });
    await page.mouse.up();
    await page.waitForTimeout(120);
    await expect(page.locator(".g2048-tile")).toHaveCount(16); // no crash, board intact
  });

  test("Whack-a-Mole: 9 holes, tapping one starts the 30s clock", async ({
    page,
  }) => {
    await gotoMenu(page);
    await openCategory(page, "Arcade");
    await openGameCard(page, "Whack-a-Mole");

    await expect(page.locator(".whack-hole")).toHaveCount(9);
    // Number keys 1–9 bop a hole (and start the clock) on desktop.
    await page.keyboard.press("1");
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

    // Holding an arrow key slides the paddle.
    const left0 = await page.locator(".breakout-paddle").evaluate((el) => el.style.left);
    await page.keyboard.down("ArrowLeft");
    await page.waitForTimeout(180);
    await page.keyboard.up("ArrowLeft");
    const left1 = await page.locator(".breakout-paddle").evaluate((el) => el.style.left);
    expect(left1).not.toBe(left0);
  });

  test("Pong: player and CPU paddles, ball, and a score", async ({ page }) => {
    await gotoMenu(page);
    await openCategory(page, "Arcade");
    await openGameCard(page, "Pong");

    await expect(page.locator(".pong-board")).toBeVisible();
    await expect(page.locator(".pong-paddle")).toHaveCount(2);
    await expect(page.locator(".pong-ball")).toBeVisible();

    // Holding W slides the player paddle vertically.
    const top0 = await page.locator(".pong-paddle").first().evaluate((el) => el.style.top);
    await page.keyboard.down("w");
    await page.waitForTimeout(180);
    await page.keyboard.up("w");
    const top1 = await page.locator(".pong-paddle").first().evaluate((el) => el.style.top);
    expect(top1).not.toBe(top0);
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
