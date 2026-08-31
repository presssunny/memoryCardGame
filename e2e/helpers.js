// Shared helpers for the E2E suite. Kept here instead of duplicated per
// spec file, the same reuse principle the app itself follows.

export async function gotoMenu(page) {
  await page.goto("/");
  await page.getByText("Game Arcade", { exact: true }).waitFor();
}

export async function openGame(page, label) {
  await page.locator(".game-card", { hasText: label }).click();
  await page.locator(".cards-grid").waitFor();
}

export async function backToMenu(page) {
  await page.locator(".back-btn").click();
  await page.getByText("Game Arcade", { exact: true }).waitFor();
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
