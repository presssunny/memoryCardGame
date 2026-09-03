# Game Experience Pass — Audit

_All work is committed in feature-scoped commits and pushed to `origin/main`
(run `git log` for the list). Nothing force-pushed._

Three passes, folded into one document:

- **Pass 1** — routing/URL architecture + first game upgrades (Kids/Ready-for-School,
  Memory Match, Bug Hunt, Snake).
- **Pass 2** — closed the open threads: the licensed **picture library** for every
  Kids game, the **review/feedback flow** in *all* the kid quizzes, a
  **game-by-game controls + UI pass** over the standalone Brain Training and
  Arcade games, and the `document.title` fix.
- **Pass 3 (this round)** — **Ready for School**, rebuilt for a child who cannot
  read yet: a three-strand split (**עברית / חשבון / חשיבה**) with its own
  routing, a **read-aloud (🔊)** for every instruction across all eight games,
  and a real fix for the "no sound" report. See [§15](#15--pass-3--ready-for-school-for-pre-readers).

No new games were added (34 → 34).

---

## 1. Game UI audit — what was weak, what changed

| Area | Before | After |
|---|---|---|
| Kids pictures (8 games) | raw platform emoji — inconsistent per-OS, "looks cheap" | one **Twemoji** set (CC-BY 4.0), 141 SVGs in `src/assets/kids`, rendered by a shared `<Pic>` with real `alt` text |
| Card flip (Memory Match & 6 more) | opacity cross-fade fake-flip | real `rotateY(180deg)` 3-D flip on the shared `.card` |
| Match / mismatch feel | silent; cards just flip back | `cardMatched` pop, `cardShake` on a wrong pair, red glow |
| Streak / combo | none | shared `streak` / `bestStreak` in `useMatchingBoard`; `ComboBadge` + HUD chip |
| Quiz "answer → instant jump" | every quiz game snapped to the next question | shared `review` mode in `useQuizGame`; a wrong pick now pauses on a short **explanation + Next** in *every* kid quiz |
| Bug Hunt | pick a line → jump; bug explained only at game over | per-pick: buggy line highlighted, your pick vs answer, **🐛 The bug / ✓ The fix**, then **Next Bug** |
| First Math | `3 + 1` and four numbers every round | 5 levels incl. **missing-number** (`2 + ? = 5`), subtraction, mixed; worked-sum review on a miss |
| Find the Letter | match identical letters only | + **regular ↔ final-form** rounds (כ↔ך …), per-round instruction, review on a miss |
| Follow Instructions | no audio at all | real Hebrew **Web Speech** read-aloud (🔊), opt-in autoplay, text fallback + notice |
| Snake | bare grid, red-dot food, D-pad only | 3·2·1 countdown, pause overlay, Level+Speed HUD, level-up flash, record cue, directional head, swipe, D-pad demoted on desktop |
| 2048 | arrows + a bespoke touch handler | arrows + **WASD** (Caps-safe) + the shared `useSwipe` (with `touch-action: none`) |
| Pong / Breakout | one coarse paddle step per keydown | **hold-to-move** keyboard (`usePaddleKeys`) — smooth, Caps-safe, `preventDefault` so arrows never scroll |
| Whack-a-Mole | mouse only | + number keys **1–9** mapped to the 3×3 grid |
| Digit Span | on-screen keypad only | + physical **number-key** entry |
| Reaction Time | click only | + **Space / Enter** to react |
| `document.title` | only games set it; stale title lingered on category/404 pages | one owner (`GamesArea`), derived from the route via `pageTitle()`, localised for the Hebrew subtree |
| Reduced motion | inconsistent | `prefers-reduced-motion` guards on every animation added this pass |

---

## 2. Routing audit — before / after

**Before:** no router. `App.jsx` held `useState` view flags. Every screen was
`/` or `/#games`. A refresh threw you back to the menu; Back/Forward did nothing;
a game link could not be shared.

**After:** `react-router-dom@7`, `BrowserRouter` in `main.jsx`. One `/games/*`
route resolves the pathname against the **games registry** — there are **no
per-game `<Route>`s**. `src/routing/paths.js` is the single source of truth
(`resolveGamesPath`, `parentPath`, `breadcrumbs`, `gamePath`, `pageTitle`) and is
unit-tested against all 34 games.

- Unique, readable URL for every category, sub-section and game.
- Refresh stays put. Browser Back/Forward walk the hierarchy.
- Direct links open the game (SPA history fallback via the dev/preview server).
- In-game **← back** follows the **hierarchy**, not history: `First Math → Ready
  for School → Kids → Games`, `Snake → Arcade`, `Bug Hunt → For Developers`.
- Unknown URL → styled **Not Found** with a route back to `/games` (no crash).
- Non-intrusive **breadcrumb** on category / sub-section pages, Hebrew & RTL for
  the Ready-for-School subtree. Deliberately **not** shown inside a game (would
  fight the GameHUD) — the URL + back button carry the hierarchy there.
- The browser tab title now names the current screen
  (`Snake · Game Arcade`, `מוכנים לכיתה א׳ · Game Arcade`) and reverts cleanly
  when you leave.

### Decisions worth knowing
- **Kids "fun" games get `/games/kids/fun/<id>`.** The brief's examples omitted
  the `fun` segment; deriving the path from the registry is the consistent rule.
- **Category "back" goes to `/games`** (the new index), not home.
- **Refresh mid-game stays in the game.** The one regression test that asserted
  the old "falls back to the menu" behaviour was rewritten to the new, correct
  behaviour — not muted.
- The nav "Categories" link was dropped — it duplicated "Games".

---

## 3. Route table

### Categories & sections
| Path | Screen |
|---|---|
| `/` | Home |
| `/games` | Games index (4 category cards) |
| `/games/kids` | Kids category |
| `/games/kids/fun` | Kids · Fun Games |
| `/games/kids/ready-for-school` | Kids · מוכנים לכיתה א׳ (Hebrew/RTL) |
| `/games/brain-training` | Brain Training |
| `/games/arcade` | Arcade |
| `/games/for-developers` | For Developers |

### All 34 games
| Path | Game |
|---|---|
| `/games/brain-training/memory-match` | Memory Match |
| `/games/brain-training/speed-match` | Speed Match |
| `/games/brain-training/sequence-recall` | Sequence Recall |
| `/games/brain-training/stroop-test` | Stroop Test |
| `/games/brain-training/math-sprint` | Math Sprint |
| `/games/brain-training/reaction-time` | Reaction Time |
| `/games/brain-training/schulte-table` | Schulte Table |
| `/games/brain-training/digit-span` | Digit Span |
| `/games/brain-training/pattern-grid` | Pattern Grid |
| `/games/arcade/time-attack` | Time Attack |
| `/games/arcade/survival` | Survival |
| `/games/arcade/snake` | Snake |
| `/games/arcade/2048` | 2048 |
| `/games/arcade/whack-a-mole` | Whack-a-Mole |
| `/games/arcade/breakout` | Breakout |
| `/games/arcade/pong` | Pong |
| `/games/kids/fun/animal-match` | Animal Match |
| `/games/kids/fun/simon` | Simon |
| `/games/kids/fun/odd-one-out` | Odd One Out |
| `/games/kids/fun/color-tap` | Color Tap |
| `/games/kids/ready-for-school/find-the-letter` | מצאו את האות |
| `/games/kids/ready-for-school/letter-and-picture` | אות ותמונה |
| `/games/kids/ready-for-school/count-and-choose` | סופרים ובוחרים |
| `/games/kids/ready-for-school/what-comes-next` | מה בא אחר כך? |
| `/games/kids/ready-for-school/first-math` | חשבון ראשון |
| `/games/kids/ready-for-school/shapes-and-colors` | צורות וצבעים |
| `/games/kids/ready-for-school/which-doesnt-belong` | מה לא שייך? |
| `/games/kids/ready-for-school/follow-instructions` | מבצעים הוראות |
| `/games/for-developers/typing-test` | Typing Test |
| `/games/for-developers/git-command-match` | Git Command Match |
| `/games/for-developers/http-status-match` | HTTP Status Match |
| `/games/for-developers/bug-hunt` | Bug Hunt |
| `/games/for-developers/hex-color-guess` | Hex Color Guess |
| `/games/for-developers/terminal-recall` | Terminal Recall |

_(Coverage is enforced by `src/routing/paths.test.js` — it round-trips every
registry entry through `gamePath` → `resolveGamesPath`.)_

---

## 4. Shared components built / changed

**New**
- `src/routing/paths.js` — URL model + `pageTitle()` (+ `paths.test.js`, 13 tests)
- `src/routing/useDocumentTitle.js` — set-and-restore tab title hook
- `src/routing/GameHost.jsx` — mounts a routed game, `onExit` → `navigate(parent)`
- `src/components/home/GamesChrome.jsx` / `Breadcrumbs.jsx` / `GamesIndexPage.jsx`
  / `SubCategoryPage.jsx` / `NotFoundPage.jsx`
- `src/components/game-ui/useSpeech.js` — SpeechSynthesis wrapper (he-IL)
- `src/components/game-ui/Pic.jsx` — the one Kids picture component
- `src/assets/kids/` — `manifest.js`, `registry.js`, `pics/*.svg` (141), `README.md`
- `scripts/fetch-kids-assets.mjs` — re-downloads the pack from the manifest
- `src/games/shared/useSwipe.js` — pointer-swipe for grid games
- `src/games/arcade/usePaddleKeys.js` — hold-to-move keyboard for Pong/Breakout

**Changed**
- `useQuizGame` — `review` mode + `phase` / `next()` (backward compatible)
- `QuizGameScreen` — `renderReview` / `nextLabel`, `renderPrompt(question, quiz)`
- `useMatchingBoard` — `streak` / `bestStreak` / `mismatchedCards`, `face="pic"`
- `Card.jsx` — `mismatch` prop, `card.pic` face renders `<Pic>`
- `App.jsx` — central title ownership in `GamesArea`
- `SiteHeader` / `HomePage` / `CategoryPage` / `CategorySection` / `GameCard` /
  `FeaturedGames` — `onClick` callbacks → real `<Link>`s

---

## 5–6. Per-game changes / which got a real gameplay upgrade

| Game | Change |
|---|---|
| **Routing (all 34)** | URL + hierarchy back + shareable links + tab title |
| Memory Match | real 3-D flip, streak/combo, mismatch shake, completion pulse |
| Speed Match / Time Attack / Survival / Git Command / HTTP Status | inherit real flip + streak from `useMatchingBoard` |
| **Animal Match** | emoji → Twemoji pictures (`face="pic"`), each card image has an `alt` |
| **Letter & Picture** | emoji → pictures; review shows the picture whose word starts with the letter |
| **Which Doesn't Belong** | emoji → pictures; review names the shared group + why the odd one is odd |
| **Count & Choose** | emoji → pictures; review states the real count to recount |
| **Shapes & Colors** | emoji → pictures; review shows the shape/colour asked for |
| **What Comes Next** | pattern emoji → pictures; review replays the right next token |
| **Find the Letter** | final-form rounds (r7–12); review shows the target letter big |
| **Odd One Out** (Fun) | emoji → pictures; review names both groups (EN) |
| **Follow Instructions** | emoji targets → pictures; Hebrew TTS with fallback |
| **First Math** | 5 levels, missing-number & subtraction kinds, worked-sum review |
| Bug Hunt | player-controlled advance, in-editor highlight, bug/why/fix panel, 8→12 snippets |
| Snake | countdown, pause, Level/Speed HUD, level-up & record cues, swipe, directional head |
| **2048** | WASD + Caps-safe keys, shared `useSwipe` (no page scroll on drag) |
| **Pong** | smooth hold-to-move `↑↓` / `W S`, Caps-safe, no scroll |
| **Breakout** | smooth hold-to-move `← →` / `A D`, Caps-safe, no scroll |
| **Whack-a-Mole** | number keys 1–9 → grid holes |
| **Digit Span** | physical number-key entry |
| **Reaction Time** | Space / Enter to react |
| Schulte Table | reviewed — click-to-scan is the exercise; no controls gap, UI meets bar |
| Pattern Grid | reviewed — grid memory game, tap is correct; UI meets bar |
| Simon / Color Tap | Color Tap gains a review on a miss; Simon unchanged (already solid) |

---

## 7. Assets added — the Kids picture library

**Source:** **Twemoji** — <https://github.com/jdecked/twemoji>, pinned to **v17.0.3**
(commit `b6b55fef1e8636b540a6d016a4729ca8cdf2e60b`).
**License:** **CC-BY 4.0** (graphics) — © Twitter, Inc and other contributors.
Full text + the attribution string live in **`src/assets/kids/README.md`**;
`LICENSE-GRAPHICS` was read directly from the repo, not paraphrased.

### Why Twemoji, not Kenney
The brief *preferred* Kenney (CC0) but the rule was "proper, checked license;
consistent; no image-search grabs." Kenney's catalogue is platformer tiles, UI
kits and isometric props — there is no "clean picture of a lion / an apple / a
bus" set that fits a literacy game. Twemoji is a single coherently-drawn set that
covers every concept these games need and carries an **attribution-only** licence
(no share-alike obligation, unlike OpenMoji's CC-BY-SA). It is a real step up from
raw platform emoji, which render differently on every OS.

### What's in it
```
src/assets/kids/
  manifest.js    141 rows: id, source emoji, en/he label, Hebrew letter, category
  pics/*.svg     141 SVGs, named by Twemoji codepoint (fetched, never hand-edited)
  registry.js    import.meta.glob → pic(id) / picSrc(id) / picsInCategory(cat)
  README.md      source, version, licence, attribution, update steps
```
- Covers all **22 Hebrew letters** (letter → word → picture), plus animals, sea
  life, fruit, food, nature, transport, clothes, school objects, instruments,
  sports, sky, and shape / colour swatches.
- Every content image carries `alt` text — Hebrew for the pre-reader games,
  English elsewhere; decorative repeats (the "count 5 apples" row) are `alt=""`.
- `scripts/fetch-kids-assets.mjs` re-downloads the whole set from the manifest,
  so a pack bump is one command.
- `src/assets/kids/manifest.test.js` asserts every row has a file on disk, ids
  are unique, and all 22 letters are covered.

`.gitignore` was **not** changed — the 141 SVGs (~520 KB total) are real working-
tree files for you to review.

---

## 8. Before / after screenshots

`BASE=http://localhost:4188 node e2e/screenshots.mjs` against a `vite preview`
build (or plain `node e2e/screenshots.mjs` with the dev server on :5199) — writes
PNGs to `screenshots/` (git-ignored): home, `/games`, category,
`ready-for-school`, Not Found, Memory Match, Snake, Bug Hunt (+ review), First
Math (missing-number), Find the Letter (+ final-form round), Follow Instructions,
Which Doesn't Belong, Letter & Picture, and mobile variants.

_(Generated locally, not embedded. Regenerated against the production build after
the picture-library swap.)_

---

## 9. Desktop QA (visual, 1280×900)

Checked via `e2e/screenshots.mjs` + spot review: home, `/games`, category, RTL
sub-section, Not Found, Memory Match, Snake, Bug Hunt review, First Math, Find the
Letter final-form, Follow Instructions, Which Doesn't Belong, Letter & Picture,
Animal Match, Odd One Out.

- **Fixed in pass 1 QA:** `<Link>` cards needed `text-decoration: none`.
- **Fixed in pass 1 QA (pre-existing bug):** the Snake board collapsed to one
  column — `grid-template-columns: repeat(var(--grid), 1fr)` can't consume a
  numeric inline custom property. Verified via `git show HEAD:…` that the line
  predated this work. Now the template is built in the element `style` with a
  static CSS fallback; the board is a proper 17×17 grid.
- **Pass 2:** the picture swap — every kid game now renders SVGs at consistent
  sizes (`.kid-pic--lg` in option buttons, small in count rows / sequence
  tokens). RTL, spacing, overlays clean.

## 10. Mobile QA (390×844, iPhone 13 profile)

- `e2e/mobile.spec.js` (every game: no horizontal overflow, no clipped chrome,
  ≥ touch-target size, clean console) — run in the full E2E pass below.
- The pictures are SVG with `loading="lazy"` / `decoding="async"`; only the
  on-screen ones load.

## 11. Keyboard / touch QA

| Game | Keyboard | Touch |
|---|---|---|
| Snake | Arrows / WASD / Space (pause) / Enter (restart), `preventDefault` | swipe (`useSwipe`), D-pad |
| 2048 | Arrows / WASD, Caps-safe, `preventDefault` | swipe (`useSwipe`) |
| Pong | `↑ ↓` / `W S` hold-to-move (`usePaddleKeys`), no scroll | mouse / drag |
| Breakout | `← →` / `A D` hold-to-move, no scroll | mouse / drag |
| Whack-a-Mole | number keys **1–9** → holes | tap |
| Digit Span | number keys **0–9** | on-screen keypad |
| Reaction Time | **Space / Enter** | tap the pad |
| Memory Match & card games | Tab + Enter/Space to flip | tap |
| All quizzes | Tab to the options; review **Next** button is `autoFocus` | tap |

D-pads / big touch controls only show where they earn their place (Snake keeps a
dimmed D-pad on `hover:hover` desktop; Pong/Breakout show none on desktop).

## 12. lint / build / unit / E2E

| | Result |
|---|---|
| `eslint .` | ✅ clean (exit 0) |
| `vite build` | ✅ (CSS ~61 kB gzip 13 kB, JS ~605 kB gzip 195 kB; 141 SVG assets emitted) |
| `vitest run` | ✅ **28 files / 208 tests passed** (exit 0, full clean run) — adds the strand-routing (`paths.test.js`), `buildSubgroupSections` (`homeData.test.js`) and legacy-redirect assertions |
| `playwright test` | ✅ **122 passed, 0 failed** (clean run) — adds the strand URL / legacy-redirect routing tests; `.follow-instruction` → `.spoken-text` selector updated in `kids` + `mobile` |

_WSL note: the jsdom env setup is slow and flakes under contention — run `vitest`
alone (not next to a Playwright run). Every clean run this session was 28/200._

⚠️ WSL note: `vitest` env setup is slow (~800 s) and `pkill -f vite` also matches
`vitest`; an undisturbed run is clean.

**Tests added / updated this pass:** `src/assets/kids/manifest.test.js` (new),
`src/routing/paths.test.js` (+pageTitle), `schoolData.test.js` /
`schoolQuestions.test.js` / `oddOneOut.data.test.js` (assert on picture ids, not
emoji chars), `e2e/kids.spec.js` (Odd One Out review flow),
`e2e/brain-training.spec.js` (Digit Span + Reaction Time keyboard),
`e2e/arcade.spec.js` (Pong / Breakout / Whack / 2048-swipe keyboard + pointer).

---

## 13. Files changed

Across the 14 commits (`git log --stat de41194..HEAD`). Grouped:

**New — routing / chrome**
`src/routing/{paths.js,paths.test.js,GameHost.jsx,useDocumentTitle.js}`,
`src/components/home/{GamesChrome,Breadcrumbs,GamesIndexPage,SubCategoryPage,NotFoundPage}.jsx`

**New — Kids picture library**
`src/assets/kids/{manifest.js,manifest.test.js,registry.js,README.md}`,
`src/assets/kids/pics/*.svg` (141), `src/components/game-ui/Pic.jsx`,
`scripts/fetch-kids-assets.mjs`

**New — game-ui / arcade helpers**
`src/components/game-ui/useSpeech.js`, `src/games/shared/useSwipe.js`,
`src/games/arcade/usePaddleKeys.js`, `src/games/for-developers/BugHuntGame.test.jsx`

**New — infra**
`e2e/routing.spec.js`, `e2e/screenshots.mjs`, `GAME_EXPERIENCE_PASS_AUDIT.md`

**Modified — routing rework**
`src/App.jsx`, `src/main.jsx`, `index.html`,
`src/components/home/{HomePage,CategoryPage,CategorySection,GameCard,FeaturedGames,SiteHeader,homeData,home.css}`

**Modified — shared engines & Card**
`src/games/shared/{useQuizGame,QuizGameScreen,useMatchingBoard}` + their tests,
`src/components/Card.jsx`, `src/index.css`

**Modified — Kids games**
`src/games/ready-for-school/{FindLetterGame,LetterPictureGame,CountChooseGame,
WhatComesNextGame,ShapesColorsGame,WhichDoesntBelongGame,FirstMathGame,
FollowInstructionsGame,SchoolPieces,schoolData,schoolQuestions,followInstructions.data}`
+ tests, `src/games/odd-one-out/{OddOneOutGame,oddOneOut.data}` + test,
`src/games/animal-match/{AnimalMatchGame,animalMatch.data}`,
`src/games/color-tap/ColorTapGame`, `src/games/memory-match/{MemoryMatchGame,useGameLogic}`

**Modified — Brain Training / Arcade**
`src/games/brain-training/{ReactionTimeGame,DigitSpanGame}`,
`src/games/arcade/{Game2048,use2048,PongGame,BreakoutGame,WhackAMoleGame,SnakeGame,useSnake,snake,arcade.logic.test}`

**Modified — tests / infra**
`e2e/{helpers,arcade,brain-training,categories,for-developers,kids,regression}.spec.js`,
`package.json`, `package-lock.json`, `.gitignore`

`screenshots/` is git-ignored (generated).

---

## 14. Remaining TODOs — is anything from the original prompt left?

**Closed this pass:** §0 routing · §1 Memory Match feel · §2 final-letter mode ·
§3 licensed artwork · §4 First Math variety · §5 Hebrew TTS · §6 Which Doesn't
Belong artwork + review · §7 shared Kids asset library + license README · §9
review flow in **every** kid quiz · §10 Bug Hunt · §11 Snake · §12 game-by-game
sweep of the standalone Brain Training + Arcade games · §16 controls (2048 swipe,
Pong/Breakout keyboard, Whack, Digit Span, Reaction Time) · the `document.title`
nit.

**Also closed (second working pass, committed + pushed):**

- **§1 — Memory Match board size.** A DifficultyPills row (Easy 4 / Classic 8 /
  Hard 12), clamped to the theme's icon count, keyed by theme + size so a
  change deals a fresh board with no reset-in-effect; best score tracked per
  size. Adds an **Emoji** card theme (16 Twemoji icons from the shared Kids
  library) so a real 12-pair Hard board exists.
- **§14 — sound.** `useSound` gains the four classic Simon pad tones;
  `useSequenceLogic` fires an `onFlash(id)` callback so Simon, Sequence Recall
  and Terminal Recall play a pitched tone per position (and chime on a loss);
  `QuizGameScreen` plays a correct / wrong chime on every answer. All routed
  through the existing toggle, still off by default.

**Genuinely open — needs a human, not code:**

- **§8 — a scroll-through of the 141-icon pack on a retina display.** Twemoji is
  internally consistent by construction and the set was spot-checked, but a
  human eye on the full grid is worth five minutes.
- **TTS on a device with a real `he-IL` voice.** Headless Chromium has none, so
  the *speak* path (voice picked, audio produced, right rate/pitch for a small
  child) is exercised only by the graceful-degradation branch. Everything around
  it — button always present, voice-status line, error capture, independence
  from the effects toggle, auto-continue after first tap — is covered. Worth one
  listen on your own machine.
- **Content call: number rounds for the very youngest.** `חשבון ראשון`,
  `סופרים ובוחרים` and the number mode of `מה בא אחר כך?` assume digit
  recognition. That's deliberate (see §15.3) but if you want a "pictures only"
  setting for pre-number children, that's a design decision for you.

No other item from the brief is outstanding.

---

## 15 · Pass 3 — Ready for School for pre-readers

The child this is for is at the start of first grade and **cannot read**. Three
things had to change: the eight games needed to be sorted by what they actually
teach, every instruction needed to be **heard**, not read, and the "I opened it
and heard nothing" report had to be tracked down for real.

### 15.1 The three strands (עברית / חשבון / חשיבה)

Classified by **content**, not name:

| Strand | Games | Why |
|---|---|---|
| **עברית** (Hebrew) | מצאו את האות · אות ותמונה · מבצעים הוראות | letters, letter↔picture sound match, and following a spoken Hebrew instruction — all language |
| **חשבון** (Math) | סופרים ובוחרים · חשבון ראשון · מה בא אחר כך? | counting, sums / missing-number, and number sequences (`מה בא אחר כך?` is ~⅔ number runs; the ABAB-picture mode is the minority and is the one reason this game is borderline) |
| **חשיבה** (Thinking) | צורות וצבעים · מה לא שייך? | shape/colour discrimination and odd-one-out sorting — neither is language or arithmetic |

**Routing** now has a strand segment:

```
/games/kids/ready-for-school                     → the three strands, each its own linked section
/games/kids/ready-for-school/hebrew              → just the 3 Hebrew games
/games/kids/ready-for-school/math                → just the 3 Math games
/games/kids/ready-for-school/thinking            → just the 2 Thinking games
/games/kids/ready-for-school/hebrew/find-the-letter   → a game
/games/kids/ready-for-school/math/first-math          → a game
```

`src/routing/paths.js` stays the single source of truth: a game entry declares
its `subgroup`, and `gamePath`, `resolveGamesPath`, `parentPath`, `breadcrumbs`,
`pageTitle` and `allPaths` all derive the strand segment from that. Back / breadcrumb
trail / refresh / direct URLs / document title all follow (`First Math → חשבון →
מוכנים לכיתה א׳ → ילדים → משחקים`). **Legacy links** from before the split
(`…/ready-for-school/first-math`) get a **client-side redirect** (React Router
history-replace, after the SPA boots — not an HTTP 301) to the deep path rather
than a 404. The Kids category page still shows one "מוכנים לכיתה א׳" section
(unchanged); the split is shown on the group page and in the URL.

New/updated: `SubCategoryPage` renders both the strand-index and a focused strand;
`buildSubgroupSections` in `homeData.js`; `paths.test.js` + `homeData.test.js` +
`e2e/routing.spec.js` cover the new shapes.

### 15.2 Why there was no sound — and what was fixed

Root cause was in `useSpeech.js`: the 🔊 button in Follow Instructions was gated
behind `canSpeak = supported && voiceReady`, and `voiceReady` only became true
if the OS had an **exact `he-IL` voice**. On a machine without one the button
**never rendered** — so there was nothing to press, and nothing to hear. The
seven quiz games had **no 🔊 at all**.

Fixes:

- **The 🔊 button now always shows** when the browser has `speechSynthesis` —
  never gated on a Hebrew voice. A missing `he-IL` voice usually still speaks
  through an OS fallback; the code now sets `utterance.lang = "he-IL"` and only
  attaches a specific `voice` object *if one matched*.
- **Voice loading is robust**: `getVoices()` is polled at 120/350/800/1600/3000 ms
  *and* on `voiceschanged` (Chrome returns `[]` on the first call and sometimes
  never fires the event).
- **Chrome's "paused engine" bug** is handled — `resume()` before and after
  `speak()`.
- **A visible voice-status line** appears under the instruction when speech can't
  work cleanly ("אין קול עברי מותקן — נשמע קול ברירת מחדל של המכשיר",
  "הדפדפן חסם את ההקראה — נסו ללחוץ שוב", "המכשיר לא תומך בהקראה — אפשר לקרוא
  את ההוראה למעלה"). `SpeechSynthesisErrorEvent.error` is captured into state to
  choose the message — so a "still no sound" report now comes with a diagnosis.
- **Spoken instructions are fully independent of Sound Effects.** `useSpeech` has
  no link to `useSound`; turning effects off does not touch the 🔊.
- After the child taps 🔊 once, each new instruction is spoken **automatically**
  (no re-tap) — but never before that first gesture (browsers block it, and a
  surprise voice isn't wanted).

New shared component: `src/components/game-ui/SpokenInstruction.jsx` — 🔊 + the
visible line + the status line. Wired once into `QuizGameScreen` (a new `speak`
prop), so **all seven quiz games** get it at once, plus Follow Instructions.

### 15.3 What each game speaks — and can a non-reader play it?

Each game hands a **full spoken sentence** (`src/games/ready-for-school/schoolSpeech.js`),
richer than the short on-screen label. The on-screen line stays too.

| Game | Spoken instruction (example) | Non-reader playable? |
|---|---|---|
| מצאו את האות | "מצאו את האות בית, ולחצו עליה." (letter *name*, not shape) | **Yes** — big letter shown, tap the matching big letter. Now voiced. |
| אות ותמונה | "באיזו תמונה המילה מתחילה באות כף? לחצו על התמונה." | **Acceptable as designed** — matching a letter to a starting sound *is* the skill; the picture options are clear and the task is now voiced. Not a reading task. |
| מבצעים הוראות | reads the instruction itself ("הקישו על עיגול אדום, ואז על כוכב") | **Yes** — pure listen-and-tap; the 🔊 fix is the whole game here. |
| סופרים ובוחרים | "כמה תפוחים יש כאן? ספרו, ואז לחצו על המספר הנכון." (item name pluralised) | **Yes** — a row of N identical pictures, tap a big number. Voiced. |
| חשבון ראשון | "כמה זה שתיים ועוד שלוש? לחצו על התשובה." / "איזה מספר חסר?" | **Acceptable as designed** — recognising digits and small sums *is* the skill; dots under the sum for the young levels give a count-the-dots path; now voiced with a real spoken sum. |
| מה בא אחר כך? | "הסתכלו על המספרים לפי הסדר. איזה מספר בא אחר כך?" | **Acceptable as designed** — the sequence + "?" is fully visual; the picture-pattern rounds need no numbers at all, the number rounds are number-sense practice. Voiced. |
| צורות וצבעים | "מצאו את עיגול אדום, ולחצו עליו." | **Yes, improved** — the game now **shows the target shape/colour as the prompt** (`prompt.pic`), so it's a picture-match, not a read-the-colour-word task. Voiced. |
| מה לא שייך? | "כאן יש ארבע תמונות. שלוש דומות ואחת שונה. לחצו על זו שלא שייכת." | **Yes** — four pictures, tap the odd one; was already visual, now voiced. |

**On the three "acceptable as designed" rows:** the brief said *fix any game a
non-reader can't play*. These three teach a skill that is itself pre-reading —
letter-sound correspondence, digit recognition, number sequences — so requiring
the child to engage with letters or digits *is* the game, not a barrier to it.
What was actually broken (a silent, unreadable instruction) is fixed for all
three. If you'd rather one of them dropped the number rounds entirely for the
youngest players, that's a content call worth your input — flagged in §14.

Other visual-first touches this pass: the 🔊 button **pulses gently until first
used** (idle-attention animation, `prefers-reduced-motion`-guarded) so a parent
knows to tap it; prompts and option targets were already large (5 rem prompt,
2.5 rem / 124 px option buttons).

**Deferred (was "אפשר", not required):** a dedicated per-game entry screen
(🔊 + demo animation + Start). The always-visible pulsing 🔊 above every question,
which auto-continues after the first tap, covers the same need without an
8-game rework.

---

## Definition of Done

✅ Navigation is a real app: every screen has a URL, refresh holds, Back/Forward
work, links are shareable, the tab title tracks the screen.

✅ Every Kids game now draws from one consistent, properly-licensed picture set —
the "this looks cheap" problem is resolved, with the source and licence recorded
in the repo.

✅ Every kid quiz paces a wrong answer with a short explanation instead of
snapping to the next question.

✅ Every arcade / brain game the brief named has been played through and has
proper per-platform controls.

✅ Memory Match has a board-size selector; the recall games and quizzes have
sound.

✅ Ready for School is split into עברית / חשבון / חשיבה — in the UI and the URL —
and every instruction in all eight games can be **heard**, with the TTS gate that
caused "no sound" removed and a visible fallback when a device has no Hebrew voice.

The work is committed in feature-scoped commits and pushed to `origin/main`.
Open items are all human calls (a retina eyeball, a listen on a real device, one
content decision) — see §14.
