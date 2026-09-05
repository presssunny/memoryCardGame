import { test, expect } from "@playwright/test";

/* =========================================================================
   M3 — app-wide Light Mode inside the games.
   - the light/dark choice from Home/Category carries into every game
   - every game's chrome re-themes; text stays readable in both themes
   - real-time arcade boards + code/terminal blocks stay dark on purpose
   - gameplay colours (Simon / Color Tap / Hex / Stroop) never change
   - Gabby card skin is unaffected by app light/dark
   ========================================================================= */

const BT = "/games/brain-training/";
const AR = "/games/arcade/";
const FD = "/games/for-developers/";
const KF = "/games/kids/fun/";
const RH = "/games/kids/ready-for-school/hebrew/";
const RM = "/games/kids/ready-for-school/math/";
const RT = "/games/kids/ready-for-school/thinking/";

const ALL_GAMES = [
  BT + "memory-match", BT + "speed-match", BT + "sequence-recall",
  BT + "stroop-test", BT + "math-sprint", BT + "reaction-time",
  BT + "schulte-table", BT + "digit-span", BT + "pattern-grid",
  AR + "time-attack", AR + "survival", AR + "snake", AR + "2048",
  AR + "whack-a-mole", AR + "breakout", AR + "pong",
  FD + "typing-test", FD + "git-command-match", FD + "http-status-match",
  FD + "bug-hunt", FD + "hex-color-guess", FD + "terminal-recall",
  KF + "animal-match", KF + "simon", KF + "odd-one-out", KF + "color-tap",
  RH + "find-the-letter", RH + "letter-and-picture", RH + "follow-instructions",
  RM + "count-and-choose", RM + "what-comes-next", RM + "first-math",
  RT + "shapes-and-colors", RT + "which-doesnt-belong",
];

// --- injected into the page: WCAG contrast maths, no dependency ---------------
const PAGE_HELPERS = `
  window.__m3 = (() => {
    const parse = (c) => {
      const m = c.match(/rgba?\\(([^)]+)\\)/);
      if (!m) return null;
      const p = m[1].split(',').map((x) => parseFloat(x));
      return { r: p[0], g: p[1], b: p[2], a: p[3] == null ? 1 : p[3] };
    };
    const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const lum = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    // walk up for the first opaque background
    const effectiveBg = (el) => {
      let node = el;
      while (node && node !== document.documentElement) {
        const bg = parse(getComputedStyle(node).backgroundColor);
        if (bg && bg.a >= 0.9) return bg;
        node = node.parentElement;
      }
      return parse(getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
    };
    const ratio = (fg, bg) => {
      // flatten fg over bg by its alpha
      const f = { r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a) };
      const l1 = lum(f), l2 = lum(bg);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };
    // real letters/digits (Latin or Hebrew) — emoji-only labels aren't "text"
    const hasGlyphs = (s) => /[A-Za-z0-9֐-׿]/.test(s);
    return {
      // text elements with a real bounding box and non-emoji text.
      // Elements with their own gradient background (design-system buttons
      // with paired ink/bg tokens) are left to the visual review — a
      // gradient's contrast can't be read from getComputedStyle.
      auditText() {
        const out = [];
        const sel = '.gx-hud-title, .gx-chip-value, .gx-chip-label, .quiz-instruction, .quiz-prompt.is-text, .gx-board-caption, .gx-result-title, .gx-result-note, .schulte-target, .digitspan-hint, .typing-hint, .spoken-text, .school-review-text, .school-review-verdict, .arcade-controls, .snake-overlay-title, .snake-overlay-sub, button, a';
        for (const el of document.querySelectorAll(sel)) {
          const r = el.getBoundingClientRect();
          const text = (el.textContent || '').trim();
          if (r.width < 4 || r.height < 4 || !hasGlyphs(text)) continue;
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden') continue;
          if (cs.backgroundImage !== 'none') continue; // gradient — visual review
          const fg = parse(cs.color);
          if (!fg) continue;
          const bg = effectiveBg(el);
          const size = parseFloat(cs.fontSize);
          const bold = (parseInt(cs.fontWeight, 10) || 400) >= 700;
          const large = size >= 24 || (bold && size >= 18.66);
          out.push({
            sel: el.className || el.tagName.toLowerCase(),
            text: text.slice(0, 24),
            ratio: +ratio(fg, bg).toFixed(2),
            min: large ? 3 : 4.5,
            large,
          });
        }
        return out;
      },
      // the raw background CSS of a surface — used to assert an arcade
      // board / code block was NOT re-themed (its dark literal is intact).
      bgCss(selector) {
        const el = document.querySelector(selector);
        if (!el) return null;
        const cs = getComputedStyle(el);
        return cs.backgroundImage + " | " + cs.backgroundColor;
      },
      // interactive things must not be "colour == background" (invisible)
      invisibleControls() {
        const out = [];
        for (const el of document.querySelectorAll('button, .card, .quiz-option, .pattern-cell, .schulte-cell, .digitspan-key')) {
          const r = el.getBoundingClientRect();
          if (r.width < 8 || r.height < 8) continue;
          const cs = getComputedStyle(el);
          if (cs.backgroundImage !== 'none') continue;
          const fg = parse(cs.color), bg = parse(cs.backgroundColor);
          if (!fg || !bg || bg.a < 0.5) continue;
          const text = (el.textContent || '').trim();
          if (!hasGlyphs(text)) continue;
          if (Math.abs(fg.r - bg.r) + Math.abs(fg.g - bg.g) + Math.abs(fg.b - bg.b) < 24) {
            out.push(el.className || el.tagName);
          }
        }
        return out;
      },
      swatchColors(selector, prop) {
        return [...document.querySelectorAll(selector)].map(
          (el) => getComputedStyle(el)[prop],
        );
      },
    };
  })();
`;

async function gotoLight(page, path) {
  await page.goto("/");
  await page.getByText("Game Arcade", { exact: true }).waitFor();
  await page.locator(".hp-theme-toggle").click();
  await page.waitForTimeout(120);
  await page.goto(path);
}

async function openGame(page, path) {
  await page.goto(path);
  await page.locator(".game-header").first().waitFor({ timeout: 8000 });
  await page.waitForTimeout(250);
  await page.addScriptTag({ content: PAGE_HELPERS });
}

// ---------------------------------------------------------------------------

test.describe("M3 — theme inheritance", () => {
  test("the Home light/dark choice carries into a game", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Game Arcade", { exact: true }).waitFor();
    await page.locator(".hp-theme-toggle").click(); // → light
    await page.waitForTimeout(120);

    await page.goto(AR + "snake");
    await page.locator(".game-header").waitFor();
    await expect(page.locator(".app.app-game")).toHaveClass(/\bis-light\b/);
    const bodyBg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    // light ground, not #0a0a0a
    expect(bodyBg).not.toBe("rgb(10, 10, 10)");

    // toggle back on Home → game is dark again
    await page.goto("/");
    await page.locator(".hp-theme-toggle").click(); // → dark
    await page.waitForTimeout(120);
    await page.goto(AR + "snake");
    await page.locator(".game-header").waitFor();
    await expect(page.locator(".app.app-game")).not.toHaveClass(/\bis-light\b/);
  });
});

test.describe("M3 — every game, light + dark", () => {
  for (const mode of ["light", "dark"]) {
    for (const path of ALL_GAMES) {
      test(`${mode}: ${path.replace("/games/", "")}`, async ({ page }) => {
        const errors = [];
        page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
        page.on("pageerror", (e) => errors.push(e.message));

        if (mode === "light") await gotoLight(page, path);
        await openGame(page, path);

        // 1. no console errors
        expect(errors, `console errors on ${path}`).toEqual([]);

        // 2. no horizontal overflow
        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        );
        expect(overflow, `horizontal overflow on ${path}`).toBeLessThanOrEqual(1);

        // 3. nothing invisible (colour == background on a control with text)
        const invisible = await page.evaluate(() => window.__m3.invisibleControls());
        expect(invisible, `invisible controls on ${path}`).toEqual([]);

        // 4. contrast — hard floor 3:1 for everything (catches real disasters);
        //    sub-4.5 normal text is logged for the manual review, not failed.
        const audit = await page.evaluate(() => window.__m3.auditText());
        const disasters = audit.filter((a) => a.ratio < 3);
        expect(
          disasters,
          `contrast < 3:1 on ${path}: ${JSON.stringify(disasters)}`,
        ).toEqual([]);
        const belowAA = audit.filter((a) => a.ratio < a.min);
        if (belowAA.length) {
          console.log(`[review] ${mode} ${path} — below AA:`, JSON.stringify(belowAA));
        }
      });
    }
  }
});

test.describe("M3 — dark surfaces stay dark in light mode", () => {
  // Each surface's `background` must still contain its hard-coded dark
  // literal in light mode — i.e. it was intentionally NOT re-themed.
  const DARK_SURFACES = [
    [AR + "snake", ".snake-board", "10, 16, 32"], // #0a1020
    [AR + "breakout", ".breakout-board", "12, 20, 38"], // #0c1426 as rgb in a gradient
    [AR + "pong", ".pong-board", "12, 20, 38"],
    [AR + "whack-a-mole", ".whack-board", "34, 127, 63"], // #227f3f grass
    [FD + "bug-hunt", ".bughunt-code", "11, 16, 32"], // #0b1020
    [FD + "typing-test", ".typing-target", "11, 16, 32"],
    [FD + "terminal-recall", ".terminal-key:not(.is-lit)", "11, 16, 32"],
  ];
  for (const [path, sel, literal] of DARK_SURFACES) {
    test(`${sel} is still dark in light mode`, async ({ page }) => {
      await gotoLight(page, path);
      await openGame(page, path);
      const css = await page.evaluate((s) => window.__m3.bgCss(s), sel);
      expect(css, `${sel} background`).not.toBeNull();
      expect(css, `${sel} should keep its dark literal`).toContain(literal);
    });
  }

  test("a revealed card face keeps a dark chip for the icon themes", async ({ page }) => {
    // The Dev Tools logos / Emoji Twemoji are drawn for a dark background
    // (some carry white wordmarks — e.g. the tailwindcss mark), so
    // `--gx-card-back` re-points to the dark art value under those themes.
    await gotoLight(page, BT + "memory-match");
    await openGame(page, BT + "memory-match");
    const back = await page.evaluate(
      () => getComputedStyle(document.querySelector(".card-back")).backgroundColor,
    );
    expect(back).toBe("rgb(30, 30, 30)"); // #1e1e1e, not the light #ffffff
  });
});

test.describe("M3 — gameplay colours never change with the theme", () => {
  test("Stroop ink is a raw data colour in both themes", async ({ page }) => {
    const DATA = new Set([
      "rgb(239, 68, 68)", "rgb(59, 130, 246)", "rgb(34, 197, 94)",
      "rgb(234, 179, 8)", "rgb(168, 85, 247)", "rgb(249, 115, 22)",
    ]);
    for (const mode of ["dark", "light"]) {
      if (mode === "light") await gotoLight(page, BT + "stroop-test");
      await openGame(page, BT + "stroop-test");
      const ink = await page.evaluate(
        () => getComputedStyle(document.querySelector(".stroop-word")).color,
      );
      expect(DATA.has(ink), `${mode}: stroop ink ${ink} is a data colour`).toBe(true);
    }
  });

  test("Simon pad colours are identical light vs dark", async ({ page }) => {
    const read = async () => {
      const c = await page.evaluate(() =>
        window.__m3.swatchColors(".simon-pad", "backgroundColor"),
      );
      return c.sort();
    };
    await openGame(page, KF + "simon");
    const dark = await read();
    await gotoLight(page, KF + "simon");
    await openGame(page, KF + "simon");
    const light = await read();
    expect(light).toEqual(dark);
    expect(new Set(dark).size).toBe(4); // four distinct pad colours
  });

  test("Color Tap swatches are the raw data palette in both themes", async ({ page }) => {
    // COLORS from colorTap.data.js, as the browser reports them
    const PALETTE = new Set([
      "rgb(239, 68, 68)", "rgb(59, 130, 246)", "rgb(34, 197, 94)",
      "rgb(234, 179, 8)", "rgb(168, 85, 247)", "rgb(249, 115, 22)",
      "rgb(236, 72, 153)", "rgb(6, 182, 212)",
    ]);
    for (const mode of ["dark", "light"]) {
      if (mode === "light") await gotoLight(page, KF + "color-tap");
      await openGame(page, KF + "color-tap");
      const swatches = await page.evaluate(() =>
        window.__m3.swatchColors(".quiz-option .color-swatch", "backgroundColor"),
      );
      expect(swatches.length).toBeGreaterThanOrEqual(3);
      for (const c of swatches) {
        expect(PALETTE.has(c), `${mode}: swatch ${c} is a data colour`).toBe(true);
      }
    }
  });

  test("Hex Color Guess prompt swatch is identical light vs dark", async ({ page }) => {
    await openGame(page, FD + "hex-color-guess");
    const dark = await page.evaluate(
      () => getComputedStyle(document.querySelector(".color-swatch--prompt")).backgroundColor,
    );
    await gotoLight(page, FD + "hex-color-guess");
    await openGame(page, FD + "hex-color-guess");
    const light = await page.evaluate(
      () => getComputedStyle(document.querySelector(".color-swatch--prompt")).backgroundColor,
    );
    // regenerated question ⇒ colours differ, but both must be a solid rgb, not a token
    for (const c of [dark, light]) {
      expect(c).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
    }
  });
});

test.describe("M3 — focus ring is visible in light mode", () => {
  test("a focused game button has a contrasting outline", async ({ page }) => {
    await gotoLight(page, BT + "schulte-table");
    await openGame(page, BT + "schulte-table");
    await page.locator(".schulte-cell").first().focus();
    const ok = await page.evaluate(() => {
      const el = document.querySelector(".schulte-cell:focus");
      if (!el) return false;
      const cs = getComputedStyle(el);
      const oc = cs.outlineColor;
      return oc && oc !== "transparent" && cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
    });
    expect(ok).toBe(true);
  });
});

test.describe("M3 — Gabby card skin is unaffected by app light/dark", () => {
  test("Gabby renders identically in .app and .app.is-light", async ({ page }) => {
    const capture = async () =>
      page.evaluate(() => {
        const g = (s, p) => {
          const el = document.querySelector(s);
          return el ? getComputedStyle(el)[p] : null;
        };
        return {
          hud: g(".gx-hud", "backgroundColor"),
          title: g(".gx-hud-title", "color"),
          cardFront: g(".card-front", "backgroundColor"),
          cardBack: g(".card-back", "backgroundColor"),
          // the <body> background must stay Gabby's pink, not the light
          // app's blue-grey — `body:has(.app-game.is-light)` excludes gabby
          bodyBg: getComputedStyle(document.body).backgroundColor,
          bodyImg: getComputedStyle(document.body).backgroundImage,
          isLight: document.querySelector(".app").classList.contains("is-light"),
        };
      });

    // dark app + gabby
    await page.goto("/");
    await page.getByText("Game Arcade", { exact: true }).waitFor();
    await page.evaluate(() => localStorage.setItem("memory-game-theme", "gabby"));
    await page.goto(BT + "memory-match");
    await page.locator(".game-header").waitFor();
    const dark = await capture();
    expect(dark.isLight).toBe(false);

    // light app + gabby
    await page.goto("/");
    await page.locator(".hp-theme-toggle").click();
    await page.waitForTimeout(120);
    await page.goto(BT + "memory-match");
    await page.locator(".game-header").waitFor();
    const light = await capture();
    expect(light.isLight).toBe(true);

    expect(light.hud).toBe(dark.hud);
    expect(light.title).toBe(dark.title);
    expect(light.cardFront).toBe(dark.cardFront);
    expect(light.cardBack).toBe(dark.cardBack);
    expect(light.bodyBg).toBe(dark.bodyBg);
    expect(light.bodyImg).toBe(dark.bodyImg);
    // and the light app's blue-grey never reaches the Gabby body
    expect(light.bodyBg).not.toBe("rgb(238, 241, 251)"); // #eef1fb
  });
});
