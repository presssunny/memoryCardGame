import { test, expect } from "@playwright/test";

// Product batch items 2 & 3 — a direction-aware near-miss line on the
// result screen, and a semantic "Best" chip in the HUD.

const BEST_KEY = "memory-game-best-scores";

const seedBest = (page, gameId, moves, themeKey = "default") =>
  page.addInitScript(
    ([key, id, m, tk]) => {
      localStorage.setItem(
        key,
        JSON.stringify({ [id]: { [tk]: { moves: m, score: 0 } } }),
      );
    },
    [BEST_KEY, gameId, moves, themeKey],
  );

// ---- #3: the HUD "Best" chip reads semantically -------------------------
const LABEL_CASES = [
  ["schulte-table", "/games/brain-training/schulte-table", 8000, "default", /Best time/i, "8000 ms"],
  ["digit-span", "/games/brain-training/digit-span", 5, "default", /Best rounds/i, "5"],
  // Memory Match keys its best by "<themeId>:<difficulty>"
  ["memory-match", "/games/brain-training/memory-match", 20, "devtools:classic", /Fewest moves/i, "20"],
];

for (const [gameId, path, best, themeKey, labelRe, valueText] of LABEL_CASES) {
  test(`#3 — ${gameId}: the Best chip label signals the metric & direction`, async ({
    page,
  }) => {
    await seedBest(page, gameId, best, themeKey);
    await page.goto(path);
    await page.locator(".game-header").waitFor();

    const chip = page.locator(".gx-chip", { hasText: labelRe });
    await expect(chip).toBeVisible();
    await expect(chip.locator(".gx-chip-value")).toHaveText(valueText);
  });
}

// ---- #2: the near-miss line, via a controllable game -------------------

const pressDigit = (page, d) =>
  page.locator(".digitspan-key", { hasText: new RegExp(`^${d}$`) }).click();

test("#2 — Digit Span: a close loss shows a direction-aware near-miss", async ({
  page,
}) => {
  // Previous best: 4 rounds cleared. Pin Math.random so every flashed digit
  // is 0 — then clear rounds 1-3 by tapping 0s, and miss round 4 with a 1.
  // Result: 3 rounds cleared, a gap of 1 under the best.
  await seedBest(page, "digit-span", 4);
  await page.addInitScript(() => {
    Math.random = () => 0.05; // Math.floor(0.05 * 10) === 0
  });
  await page.goto("/games/brain-training/digit-span");
  await page.locator(".game-header").waitFor();
  await page.locator(".phase-start-btn").click();

  for (let round = 0; round < 3; round += 1) {
    await page.locator(".digitspan-keys").waitFor({ timeout: 10000 });
    for (let i = 0; i < 3 + round; i += 1) await pressDigit(page, "0");
  }

  await page.locator(".digitspan-keys").waitFor({ timeout: 10000 });
  await pressDigit(page, "1"); // wrong — expected 0

  const nearMiss = page.locator(".gx-result-nearmiss");
  await expect(nearMiss).toBeVisible();
  await expect(nearMiss).toHaveText(/1 away from your best \(4\)/);
});
