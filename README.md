# Game Arcade

A browser game arcade built with React and Vite. Browse by category, pick a
game, play it, and jump back for another.

## Categories

- **🧒 Kids** — big targets, little text, forgiving feedback
  - *Fun Games* — Animal Match, Simon, Odd One Out, Color Tap
  - *Ready for School* — Find the Letter, Letter & Picture, Count & Choose,
    What Comes Next, First Math, Shapes & Colors, Which Doesn't Belong,
    Follow Instructions
- **🧠 Brain Training** — Stroop Test, Math Sprint, Reaction Time,
  Schulte Table, Digit Span, Pattern Grid
- **🏆 Arcade** — Memory games (Time Attack, Survival) plus Snake, 2048,
  Whack-a-Mole, Breakout, Pong
- **⌨️ For Developers** — Typing Test, Git Command Match, HTTP Status Match,
  Bug Hunt, Hex Color Guess, Terminal Recall
- **Brain Training** also holds the original card games: Memory Match,
  Speed Match, Sequence Recall

## Features

- **Home page** (`src/components/home/`) — hero, a Browse Categories grid
  (each card links to a category page listing its games), a curated Featured
  shelf, and a stats bar. Its own light/dark toggle, persisted to
  `localStorage`.
- **Category pages** — games grouped into sub-sections (`CATEGORY_GROUPS`),
  a "← Home" back path, and a per-game "← Games" that returns to the category.
- **Game registry** (`src/games/index.js`) — the single list of every game.
  Adding one is one entry plus a component; categories are a filter over it,
  not a second list.
- **Best-score tracking** — per game (per card theme for the themed card
  games, otherwise a single `"default"`), in `localStorage`, shown on the
  cards and result screens. `higherScoreIsBetter` flips the ranking.
- **Card theme switcher** — the themed matching games swap their icon deck
  (Dev Tools / Gabby's Dollhouse); add a theme in `src/themes/index.js`.

## Shared engines

Games reuse a small set of hooks rather than re-implementing loops:

| Hook / component | Used by |
|---|---|
| `games/shared/useMatchingBoard` | every flip-two-cards game (incl. asymmetric text pairs via `face: "text"` + `{ value, face }`) |
| `games/shared/useQuizGame` + `components/QuizStage` + `games/shared/QuizGameScreen` | the "prompt + options" games (Odd One Out, the Ready-for-School quizzes, Stroop, Bug Hunt, Hex Guess, …) |
| `games/shared/useCountdown` | Time Attack, Math Sprint |
| `games/shared/useGameResult` | records the finished result + returns the best (every game) |
| `games/shared/useGameLoop` | fixed-timestep rAF loop for Breakout, Pong |
| `games/shared/MatchPairsGame` | themeless matching games (Git / HTTP) |
| `sequence-recall/useSequenceLogic` | Sequence Recall, Simon, Terminal Recall |

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL.

```bash
npm run build      # production build
npm run preview    # preview the production build
npm run lint       # eslint
npm test           # vitest (unit + hook logic)
npm run test:e2e   # playwright (per-category flow coverage)
```

## Project structure

```
src/
├── components/          # Card, GameHeader, QuizStage, ThemeSwitcher,
│   │                     # ToastMessage, PhaseOverlay, Win/LoseMessage
│   └── home/             # HomePage, CategoryPage + sections, homeData,
│                         # GameCard, useArcadeMode
├── games/
│   ├── index.js          # the game registry (id/label/icon/category/component…)
│   ├── shared/            # useMatchingBoard, useQuizGame, QuizGameScreen,
│   │                       # useCountdown, useGameResult, useGameLoop,
│   │                       # MatchPairsGame
│   ├── memory-match/  speed-match/  time-attack/  survival/  sequence-recall/
│   ├── animal-match/  simon/  odd-one-out/  color-tap/
│   ├── ready-for-school/   # the 8 first-grade-prep games + schoolQuestions
│   ├── brain-training/     # Stroop, Math Sprint, Reaction Time, Schulte,
│   │                        # Digit Span, Pattern Grid
│   ├── for-developers/     # Typing, Git/HTTP match, Bug Hunt, Hex, Terminal
│   └── arcade/             # Snake, 2048, Whack-a-Mole, Breakout, Pong
│                            # (pure logic in *.js, React wrapper in use*.js)
├── hooks/               # useTheme, useBestScores
├── themes/              # card-icon theme registry
└── App.jsx              # shell: home → category → game
```

### Adding a new game

1. Create `src/games/<your-game>/` with a component. It receives
   `{ gameId, bestScores, onExit, higherIsBetter, bestUnit }` — plus, for the
   themed card games, `{ cardValues, allThemes, activeThemeId, onThemeChange }`
   (non-card games ignore those and don't pass them to `GameHeader`).
2. Append one entry to `GAMES` in `src/games/index.js`: a unique `id`,
   `label`, `description`, `icon`, `category` (`"kids" | "brain-training" |
   "arcade" | "for-developers"`), the `component`, and optionally `group`,
   `usesCards`, `higherScoreIsBetter`, `bestUnit`.
3. Add game-specific CSS to `src/index.css`.

The category page, best-score tracking, and back navigation come from the
registry and `App.jsx` automatically. Reuse a shared engine where one fits.
