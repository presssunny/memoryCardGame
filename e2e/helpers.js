// Shared helpers for the E2E suite. Kept here instead of duplicated per
// spec file, the same reuse principle the app itself follows.

export async function gotoMenu(page) {
  await page.goto("/");
  await page.getByText("Game Arcade", { exact: true }).waitFor();
}

// Navigate straight to any screen by its real URL (routing is hierarchical
// now — see src/routing/paths.js). `path` is e.g. "/games/arcade/snake".
export async function gotoPath(page, path) {
  await page.goto(path);
  await page.getByText("Game Arcade", { exact: true }).waitFor();
}

// The category page each of the original card games now lives on (they used
// to all sit on one menu). Used so openGame can reach one that isn't on the
// Featured shelf.
const CATEGORY_OF = {
  "Memory Match": "Brain Training",
  "Speed Match": "Brain Training",
  "Sequence Recall": "Brain Training",
  "Time Attack": "Arcade",
  "Survival": "Arcade",
};

// Home → a card game → its `.cards-grid`. Always starts from home so it's
// safe to call from anywhere. Clicks the Featured card if the game is on the
// shelf, otherwise routes through its category page.
export async function openGame(page, label) {
  if (!(await page.locator(".hp-featured-grid").count())) {
    await gotoMenu(page);
  }
  const featured = page.locator(".hp-featured-grid .game-card", { hasText: label });
  if (await featured.count()) {
    await featured.click();
  } else {
    await openCategory(page, CATEGORY_OF[label]);
    await page.locator(".catpage-grid .game-card", { hasText: label }).click();
  }
  await page.locator(".cards-grid").waitFor();
}

// Opens a game from whatever list is already on screen and waits for its
// header — works for card and non-card games alike.
export async function openGameCard(page, label) {
  await page.locator(".game-card", { hasText: label }).click();
  await page.locator(".game-header").waitFor();
}

// Leave the current game and land back on the home page. In-game "back" now
// walks one real level up the URL hierarchy (game → sub-section/category);
// this helper exercises that button once, then uses the logo to finish the
// trip home so callers get a deterministic "at home" state.
export async function backToMenu(page) {
  await page.locator(".back-btn").click();
  await page.locator(".catpage-head").waitFor();
  await page.locator(".hp-logo").click();
  await page.getByText("Game Arcade", { exact: true }).waitFor();
  await page.locator(".hp-category-grid").waitFor();
}

// Home → a category page. `title` is the category card's visible title.
export async function openCategory(page, title) {
  await page.locator(".hp-category-card", { hasText: title }).click();
  await page.locator(".catpage-head").waitFor();
}

// Reads every card's back-face image src while it's face-up (before any
// hide/resolution happens), letting a test know the board's pairing without
// guessing. Only meaningful for games that reveal the full board (Speed
// Match's memorize phase, Sequence Recall isn't pair-based).
export async function readRevealedValues(page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll(".cards-grid .card")).map((el) =>
      el.querySelector(".card-back img")?.getAttribute("src"),
    ),
  );
}

// Drives a face-down matching-pairs board (Memory Match, Time Attack,
// Survival) to a full win by exhaustive pairing -- no knowledge of the
// shuffle required. Stops early if a win/lose overlay appears.
export async function winByBruteForce(page) {
  return page.evaluate(async () => {
    function sleep(ms) {
      return new Promise((r) => setTimeout(r, ms));
    }
    const getCards = () => Array.from(document.querySelectorAll(".card"));
    const overlayVisible = () => !!document.querySelector(".win-overlay");

    let remaining = Array.from({ length: getCards().length }, (_, i) => i);
    let guard = 0;
    while (remaining.length > 0 && guard < 300) {
      if (overlayVisible()) break;
      guard += 1;
      const a = remaining[0];
      let matched = false;
      for (let bi = 1; bi < remaining.length; bi++) {
        if (overlayVisible()) break;
        const b = remaining[bi];
        let cards = getCards();
        cards[a].click();
        await sleep(50);
        cards = getCards();
        cards[b].click();
        await sleep(600);
        cards = getCards();
        if (
          cards[a]?.classList.contains("matched") &&
          cards[b]?.classList.contains("matched")
        ) {
          remaining = remaining.filter((x) => x !== a && x !== b);
          matched = true;
          break;
        }
        await sleep(450);
      }
      if (!matched) break;
    }
    return { remaining: remaining.length, wonOrLost: overlayVisible() };
  });
}

// Clicks the first two cards on the board and waits out whatever
// resolution follows (match or mismatch) -- for tests that only need to
// exercise "a move happened" (counters update, board stays consistent),
// not a full game.
export async function clickOnePairAttempt(page) {
  const cards = await page.locator(".card").elementHandles();
  await cards[0].click();
  await page.waitForTimeout(30);
  await cards[1].click();
  await page.waitForTimeout(1100);
}
