---
name: Gabby's Dollhouse Theme Switcher Feature Plan
description: Requirements, architecture decisions, and asset strategy for adding a Gabby's Dollhouse card theme with a theme switcher UI
type: project
---

Feature requested 2026-05-14. Goal: add Gabby's Dollhouse as a second card theme alongside existing "Dev Tools" theme.

**Core requirements:**
- 8 Gabby's Dollhouse character images (Gabby, Pandy Paws, CatRat, Cakey, Mercat, Kitty Fairy, Mama Noodle, Dollhouse exterior)
- Theme switcher UI in GameHeader
- Theme persists via localStorage (key: `memory-game-theme`)
- Switching theme triggers game restart
- Modular config: adding theme #3 requires editing one file only
- Kid-friendly styling for Gabby theme (pastel/rainbow, rounded, playful font)
- Zero changes to useGameLogic.js

**Architecture decision:** Theme config lives in `src/themes/index.js`. App.jsx reads active theme from localStorage on mount, passes cardValues to useGameLogic. GameHeader receives activeTheme and onThemeChange props.

**Asset strategy:** Placeholder SVGs in `src/assets/gabby/` during dev (8 files named gabby.svg, pandy.svg, catrat.svg, cakey.svg, mercat.svg, kitty-fairy.svg, mama-noodle.svg, dollhouse.svg). Replace with final licensed assets at same paths before ship.

**localStorage key:** `memory-game-theme`. Default on first load: `devtools`. Values: `devtools` | `gabby`.

**Why theme switch triggers restart:** mid-game theme swap would leave flipped/matched cards with values from the old theme, making match detection compare cross-theme strings — always false. Restart is the safe reset.
