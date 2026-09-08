import { test, expect } from "@playwright/test";

// Product batch item 7 — Typing Test had no visible "where do I type" cue;
// on mobile the keyboard never came up. A "⌨️ Tap to type" prompt now sits
// over the code until the player taps in or starts typing.

const open = async (page) => {
  await page.goto("/games/for-developers/typing-test");
  await page.locator(".typing-stage").waitFor();
};

test("shows a tap-to-type prompt that clears once you tap in", async ({
  page,
}) => {
  await open(page);
  await expect(page.locator(".typing-cta")).toBeVisible();
  await expect(page.locator(".typing-hint")).toHaveText(/Tap the code/i);

  await page.locator(".typing-cta").click();
  await expect(page.locator(".typing-cta")).toHaveCount(0);
  await expect(page.locator(".typing-hint")).toHaveText(/Type the line below/i);

  // keyboard + focus still work — typing the first char registers
  const target = await page.locator("#typing-target-text").textContent();
  await page.keyboard.type(target.slice(0, 3));
  await expect(page.locator(".typing-ch--ok")).not.toHaveCount(0);
});

test("the prompt also clears if you just start typing (desktop auto-focus)", async ({
  page,
}) => {
  await open(page);
  await expect(page.locator(".typing-cta")).toBeVisible();
  const target = await page.locator("#typing-target-text").textContent();
  await page.keyboard.type(target.slice(0, 2)); // input is auto-focused on mount
  await expect(page.locator(".typing-cta")).toHaveCount(0);
});

test("the prompt comes back on a fresh line", async ({ page }) => {
  await open(page);
  const target = await page.locator("#typing-target-text").textContent();
  await page.locator(".typing-input").fill(target); // finish the line
  await expect(page.locator(".gx-result-score")).toBeVisible();
  await page.locator(".win-new-game-btn").click();
  await expect(page.locator(".typing-cta")).toBeVisible();
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the prompt is a real tap target and typing works after it", async ({
    page,
  }) => {
    await open(page);
    const cta = page.locator(".typing-cta");
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(40);

    await cta.click();
    await expect(cta).toHaveCount(0);
    const target = await page.locator("#typing-target-text").textContent();
    await page.keyboard.type(target.slice(0, 3));
    await expect(page.locator(".typing-ch--ok")).not.toHaveCount(0);
  });
});
