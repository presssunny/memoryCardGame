// Ad-hoc screenshot capture for the Game Experience Pass review.
//   node e2e/screenshots.mjs
// Expects the dev server on :5199 (npm run dev).
import { chromium, devices } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE || "http://localhost:5199";
const OUT = process.env.OUT || "screenshots";

const DESKTOP = [
  ["home", "/"],
  ["games-index", "/games"],
  ["category-arcade", "/games/arcade"],
  ["subcategory-ready-for-school", "/games/kids/ready-for-school"],
  ["not-found", "/games/arcade/not-a-real-game"],
  ["memory-match", "/games/brain-training/memory-match"],
  ["snake", "/games/arcade/snake"],
  ["bug-hunt", "/games/for-developers/bug-hunt"],
  ["first-math", "/games/kids/ready-for-school/first-math"],
  ["find-the-letter", "/games/kids/ready-for-school/find-the-letter"],
  ["follow-instructions", "/games/kids/ready-for-school/follow-instructions"],
  ["which-doesnt-belong", "/games/kids/ready-for-school/which-doesnt-belong"],
  ["letter-and-picture", "/games/kids/ready-for-school/letter-and-picture"],
  ["animal-match", "/games/kids/fun/animal-match"],
  ["odd-one-out", "/games/kids/fun/odd-one-out"],
  ["shapes-and-colors", "/games/kids/ready-for-school/shapes-and-colors"],
  ["count-and-choose", "/games/kids/ready-for-school/count-and-choose"],
  ["2048", "/games/arcade/2048"],
  ["pong", "/games/arcade/pong"],
  ["breakout", "/games/arcade/breakout"],
  ["whack-a-mole", "/games/arcade/whack-a-mole"],
];

const MOBILE = [
  ["m-home", "/"],
  ["m-games-index", "/games"],
  ["m-snake", "/games/arcade/snake"],
  ["m-first-math", "/games/kids/ready-for-school/first-math"],
];

async function shoot(page, name, path, { settle = 700 } = {}) {
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(settle);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
  console.log("  ✓", name);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();

  const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const dp = await desktop.newPage();
  console.log("desktop:");
  for (const [name, path] of DESKTOP) await shoot(dp, name, path);

  // Bug Hunt — answer once so the review panel is on screen.
  await dp.goto(BASE + "/games/for-developers/bug-hunt", { waitUntil: "networkidle" });
  await dp.locator(".quiz-option").first().click();
  await dp.waitForTimeout(400);
  await dp.screenshot({ path: `${OUT}/bug-hunt-review.png` });
  console.log("  ✓ bug-hunt-review");

  // Find the Letter — play to the final-form round (round 7).
  await dp.goto(BASE + "/games/kids/ready-for-school/find-the-letter", { waitUntil: "networkidle" });
  for (let r = 0; r < 6; r++) {
    for (let i = 0; i < 6; i++) {
      const opt = dp.locator(".quiz-option").nth(i);
      if (!(await opt.count())) break;
      await opt.click();
      await dp.waitForTimeout(120);
      if (await dp.locator(".quiz-option.is-correct").count()) break;
    }
    await dp.waitForTimeout(800);
  }
  await dp.waitForTimeout(400);
  await dp.screenshot({ path: `${OUT}/find-the-letter-final-form.png` });
  console.log("  ✓ find-the-letter-final-form");

  await desktop.close();

  const mobile = await browser.newContext({ ...devices["iPhone 13"] });
  const mp = await mobile.newPage();
  console.log("mobile:");
  for (const [name, path] of MOBILE) await shoot(mp, name, path);
  await mobile.close();

  await browser.close();
  console.log("done →", OUT + "/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
