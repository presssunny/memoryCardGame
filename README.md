# Memory Card Game

A browser memory-matching game built with React and Vite. Flip two cards at a
time, find all the matching pairs, and try to do it in as few moves as
possible.

## Features

- Classic flip-and-match gameplay with live score and move tracking
- Win screen with a "New Game" reset
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
- Custom hooks for state: `useGameLogic` (game rules/board state),
  `useTheme` (active theme + persistence)

## Project structure

```
src/
├── components/   # Card, GameHeader, ThemeSwitcher, ToastMessage, WinMessage
├── hooks/        # useGameLogic, useTheme
├── themes/       # theme registry (icon sets, colors)
└── App.jsx
```
