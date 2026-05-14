---
name: Memory Card Game Tech Stack and Architecture
description: Core tech stack, file structure, and critical mechanics of the existing memory card game
type: project
---

React 19, Vite, plain CSS (no Tailwind, no state management library). All styles live in a single `src/index.css`.

**Why:** This constrains all feature additions — no utility classes, no CSS-in-JS, no global store. Everything additive goes into index.css or co-located component files.

**How to apply:** When suggesting code changes, always use plain CSS class additions and React useState/useCallback hooks only. Never recommend Tailwind, styled-components, Zustand, Redux, or Context API unless the user explicitly asks.

**Critical match-detection mechanic:** `useGameLogic.js` line 70 compares `firstCard.value === card.value` using referential equality of the SVG import string. Both cards in a pair share the same import reference, so this works. Any new theme must follow the same pattern — each pair must use the exact same value (same import reference or same string primitive). If theme images are loaded differently (e.g., dynamic import, fetch URL), match detection will silently break.

**Card data shape:** `{ id: number, value: any, isFlipped: boolean, isMatched: boolean }`. The `id` is the array index after shuffle (0–15), NOT a stable identifier per card pair.

**cardValues construction:** In App.jsx, an 8-item `icons` array is spread twice to make 16 cards: `[...icons, ...icons]`. `useGameLogic` receives this flat 16-item array and shuffles it. The hook is stateless about what the values mean — it just compares them.

**No theme-switching exists today.** Theme is fully hardcoded in App.jsx via top-level SVG imports.

**Existing assets in src/assets/:** docker.svg, figma.svg, git.svg, javascript.svg, linux.svg, mysql.svg, react.svg, tailwindcss.svg.

**Win state:** `matchedCards.length === cardValues.length` (line 111 of useGameLogic.js). cardValues.length must stay 16 (8 pairs) for the win condition to work correctly with the current grid layout.
