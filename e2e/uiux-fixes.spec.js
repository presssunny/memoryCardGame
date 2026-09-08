import { test, expect } from "@playwright/test";
import { gotoMenu } from "./helpers.js";

// Coverage for the UI/UX round — findings #3, #5, #7, #9. #2 and #10 are
// unit-tested next to their components; #6 has its own spec (hud-mobile-
// title) because it landed as its own commit; #1/#4/#8 are unchanged.

const RFS = "/games/kids/ready-for-school";

// ---------------------------------------------------------------------------
// #3 — the read-aloud button gets a first-use nudge that clears on first tap
// ---------------------------------------------------------------------------
test.describe("#3 — RFS read-aloud affordance", () => {
  for (const [name, path] of [
    ["First Math", `${RFS}/math/first-math`],
    ["Follow Instructions", `${RFS}/hebrew/follow-instructions`],
  ]) {
    test(`${name}: a tap hint points at 🔊 and disappears after the first tap`, async ({
      page,
    }) => {
      await page.goto(path);
      await page.locator(".spoken").waitFor();

      const hint = page.locator(".spoken-hint");
      await expect(hint).toBeVisible();
      // RTL, Hebrew, and it references the speaker
      await expect(page.locator(".spoken")).toHaveAttribute("dir", "rtl");
      await expect(hint).toHaveText(/הרמקול/);
      // the button is flagged as prompting before first use
      await expect(page.locator(".spoken-btn.is-prompting")).toBeVisible();

      await page.locator(".spoken-btn").click();
      await expect(hint).toHaveCount(0);
      await expect(page.locator(".spoken-btn.is-prompting")).toHaveCount(0);
    });
  }

  test("prefers-reduced-motion: the button still isn't animated, hint still shows", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${RFS}/math/first-math`);
    await page.locator(".spoken").waitFor();
    await expect(page.locator(".spoken-hint")).toBeVisible();
    const anim = await page
      .locator(".spoken-btn")
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(anim).toBe("none");
  });
});

// ---------------------------------------------------------------------------
// #5 — category / sub-category header is tighter on mobile
// ---------------------------------------------------------------------------
test.describe("#5 — category header on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const [name, path] of [
    ["Arcade", "/games/arcade"],
    ["Kids", "/games/kids"],
    ["Ready for School (RTL)", RFS],
  ]) {
    test(`${name}: the first game sits high in the viewport`, async ({ page }) => {
      await page.goto(path);
      await page.locator(".catpage-head").waitFor();
      const firstCardTop = await page
        .locator(".catpage-grid .game-card")
        .first()
        .evaluate((el) => el.getBoundingClientRect().top);
      // a game must be reachable within the first ~viewport-and-a-bit, not
      // pushed a full screen down by the header block
      expect(firstCardTop).toBeLessThan(560);
      const headH = await page
        .locator(".catpage-head")
        .evaluate((el) => el.getBoundingClientRect().height);
      expect(headH).toBeLessThan(220);
    });
  }

  test("the mobile tightening does not leak onto desktop", async ({ page }) => {
    const read = () =>
      page
        .locator(".catpage-head")
        .evaluate((el) => parseFloat(getComputedStyle(el).paddingTop));

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/games/arcade");
    await page.locator(".catpage-head").waitFor();
    const mobilePad = await read();

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/games/arcade");
    await page.locator(".catpage-head").waitFor();
    const desktopPad = await read();

    // desktop keeps the roomier spacing — whatever the exact values are,
    // desktop must be strictly more generous than the mobile override
    expect(desktopPad).toBeGreaterThan(mobilePad);
  });
});

// ---------------------------------------------------------------------------
// #7 — the hero has one primary CTA
// ---------------------------------------------------------------------------
test.describe("#7 — hero CTA", () => {
  test("exactly one CTA, and it reveals the games content", async ({ page }) => {
    await gotoMenu(page);
    const ctas = page.locator(".hp-hero-actions .hp-btn");
    await expect(ctas).toHaveCount(1);
    await expect(ctas).toHaveText(/Explore Games/);

    await ctas.click();
    // smooth-scrolls down to the category grid
    await page.waitForFunction(() => window.scrollY > 200);
    await expect(page.locator("#categories")).toBeInViewport();
  });
});

// ---------------------------------------------------------------------------
// #9 — Snake shows an empty board during the count-in
// ---------------------------------------------------------------------------
test.describe("#9 — Snake count-in", () => {
  test("no snake or food while counting; both appear once running", async ({
    page,
  }) => {
    await page.goto("/games/arcade/snake");
    await page.locator(".snake-board").waitFor();

    // during the count-in
    await expect(page.locator(".snake-overlay")).toBeVisible();
    await expect(page.locator(".snake-count")).toHaveText(/^(3|2|1|Go!)$/);
    expect(
      await page
        .locator(".snake-cell.is-head, .snake-cell.is-body, .snake-cell.is-food")
        .count(),
    ).toBe(0);

    // after it clears
    await expect(page.locator(".snake-overlay")).toBeHidden({ timeout: 6000 });
    expect(
      await page.locator(".snake-cell.is-head").count(),
      "the snake head is back once play starts",
    ).toBe(1);
    expect(
      await page.locator(".snake-cell.is-food").count(),
      "the food is back once play starts",
    ).toBe(1);
  });
});
