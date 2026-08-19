# Game Arcade

A small browser game arcade built with React and Vite. Pick a game from the
menu, play it, and jump back to try another.

## Games

- **Memory Match** — flip two cards at a time and find every matching pair
- **Speed Match** — memorize the board, then find every pair from memory
  alone
- **Time Attack** — race a 60-second clock to match every pair
- **Survival** — match every pair before you run out of moves
- **Sequence Recall** — watch a growing sequence flash, then repeat it back

## Features

- **Game selection menu** — a home screen listing every game in the arcade;
  picking one hands off to that game's own screen, with a "← Games" button
  to come back
- **Game registry** (`src/games/index.js`) — adding a new game only requires
  one new entry here plus a component, mirroring the existing theme registry
  pattern below
- Live score/moves tracking, and a win or lose screen with a retry button
- **Best-score tracking** — each game's best result is kept per theme in
  `localStorage` and shown in the menu and on the win screen. Most games
  rank fewer moves as better; games like Sequence Recall rank a higher
  score as better instead
- **Theme switcher** — swap the card deck between themes (e.g. Dev Tools
  icons), persisted to `localStorage` so it survives a refresh
- Adding a new theme only requires one new entry in `src/themes/index.js`

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

Other scripts:

```bash
npm run build    # production build
npm run preview  # preview the production build locally
npm run lint     # eslint
```

## Tech stack

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- Plain CSS (no UI framework)
- Custom hooks for state: `useTheme` (active theme + persistence),
  `useBestScores` (per-game, per-theme best results + persistence)

## Project structure

```
src/
├── components/        # GameMenu, Card, GameHeader, ThemeSwitcher, ToastMessage,
│                       # PhaseOverlay, WinMessage, LoseMessage
├── games/
│   ├── index.js        # game registry — id, label, description, icon, component
│   ├── shared/          # useMatchingBoard — the flip/match/score engine shared
│   │                     # by every pairs-based game
│   ├── memory-match/    # useGameLogic wraps useMatchingBoard as-is
│   ├── speed-match/      # wraps useMatchingBoard with a reveal/countdown/hide phase
│   ├── time-attack/      # wraps useMatchingBoard with a countdown timer
│   ├── survival/         # wraps useMatchingBoard with a move budget
│   └── sequence-recall/  # its own engine — not a pairs game
├── hooks/              # useTheme, useBestScores
├── themes/             # theme registry (icon sets, colors)
└── App.jsx             # shell: renders GameMenu or the active game
```

### Adding a new game

1. Create `src/games/<your-game>/` with a component that accepts
   `{ gameId, cardValues, allThemes, activeThemeId, onThemeChange, bestScores, onExit }`
   (see `MemoryMatchGame.jsx` for the reference shape — not every field has
   to be used, e.g. a non-theme-based game can ignore the theme props).
2. Append one entry to `GAMES` in `src/games/index.js` with a unique `id`,
   `label`, `description`, `icon`, and the `component`.
3. Add any game-specific CSS to `src/index.css`.

That's it — the menu, best-score tracking, and back-to-menu navigation are
handled by the registry and `App.jsx` automatically.
