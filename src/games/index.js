import { MemoryMatchGame } from "./memory-match/MemoryMatchGame";
import { SpeedMatchGame } from "./speed-match/SpeedMatchGame";
import { TimeAttackGame } from "./time-attack/TimeAttackGame";
import { SurvivalGame } from "./survival/SurvivalGame";
import { SequenceRecallGame } from "./sequence-recall/SequenceRecallGame";
import { AnimalMatchGame } from "./animal-match/AnimalMatchGame";
import { SimonGame } from "./simon/SimonGame";
import { OddOneOutGame } from "./odd-one-out/OddOneOutGame";
import { ColorTapGame } from "./color-tap/ColorTapGame";
import { FindLetterGame } from "./ready-for-school/FindLetterGame";
import { LetterPictureGame } from "./ready-for-school/LetterPictureGame";
import { CountChooseGame } from "./ready-for-school/CountChooseGame";
import { WhatComesNextGame } from "./ready-for-school/WhatComesNextGame";
import { FirstMathGame } from "./ready-for-school/FirstMathGame";
import { ShapesColorsGame } from "./ready-for-school/ShapesColorsGame";
import { WhichDoesntBelongGame } from "./ready-for-school/WhichDoesntBelongGame";
import { FollowInstructionsGame } from "./ready-for-school/FollowInstructionsGame";
import { StroopGame } from "./brain-training/StroopGame";
import { MathSprintGame } from "./brain-training/MathSprintGame";
import { ReactionTimeGame } from "./brain-training/ReactionTimeGame";
import { SchulteTableGame } from "./brain-training/SchulteTableGame";
import { DigitSpanGame } from "./brain-training/DigitSpanGame";
import { PatternGridGame } from "./brain-training/PatternGridGame";
import { GitCommandMatchGame } from "./for-developers/GitCommandMatchGame";
import { HttpStatusMatchGame } from "./for-developers/HttpStatusMatchGame";
import { HexColorGuessGame } from "./for-developers/HexColorGuessGame";
import { BugHuntGame } from "./for-developers/BugHuntGame";
import { TerminalRecallGame } from "./for-developers/TerminalRecallGame";
import { TypingTestGame } from "./for-developers/TypingTestGame";
import { SnakeGame } from "./arcade/SnakeGame";
import { Game2048 } from "./arcade/Game2048";
import { WhackAMoleGame } from "./arcade/WhackAMoleGame";
import { BreakoutGame } from "./arcade/BreakoutGame";
import { PongGame } from "./arcade/PongGame";

// The single source of truth for every playable game. To add one, append an
// object here plus its component — nothing else in the app enumerates games.
//
// Fields:
//   id, label, description, icon   — identity + how it shows on a card
//   component                      — rendered with the prop shape below
//   category                       — which Browse Categories bucket it lives in
//                                    ("kids" | "brain-training" | "arcade" | "for-developers")
//   group        (optional)        — a sub-section id within a category
//                                    (see CATEGORY_GROUPS in home/homeData.js)
//   usesCards    (optional)        — true for games built on the card grid +
//                                    card-icon themes; gates the ThemeSwitcher
//   higherScoreIsBetter (optional) — a bigger number wins (default: fewer wins)
//   bestUnit            (optional) — the word after the best score ("moves")
//
// Every component receives:
//   { gameId, cardValues, allThemes, activeThemeId, onThemeChange,
//     bestScores, higherIsBetter, bestUnit, onExit }
// Non-card games ignore the theme props and don't forward them to GameHeader —
// see MemoryMatchGame for the card reference shape.
export const GAMES = [
  {
    id: "memory-match",
    label: "Memory Match",
    description: "Flip two cards at a time and find every matching pair.",
    icon: "🧠",
    category: "brain-training",
    usesCards: true,
    component: MemoryMatchGame,
  },
  {
    id: "speed-match",
    label: "Speed Match",
    description: "Memorize the board, then find every pair from memory alone.",
    icon: "⚡",
    category: "brain-training",
    usesCards: true,
    component: SpeedMatchGame,
  },
  {
    id: "time-attack",
    label: "Time Attack",
    description: "Race the clock — match every pair before time runs out.",
    icon: "⏱️",
    category: "arcade",
    usesCards: true,
    component: TimeAttackGame,
  },
  {
    id: "survival",
    label: "Survival",
    description: "Match every pair before you run out of moves.",
    icon: "🎯",
    category: "arcade",
    usesCards: true,
    component: SurvivalGame,
  },
  {
    id: "sequence-recall",
    label: "Sequence Recall",
    description: "Watch the sequence, then repeat it back — one step longer each round.",
    icon: "🔁",
    category: "brain-training",
    usesCards: true,
    higherScoreIsBetter: true,
    bestUnit: "rounds",
    component: SequenceRecallGame,
  },

  // ---------- Kids · Fun Games ----------
  {
    id: "animal-match",
    label: "Animal Match",
    description: "Flip the cards and find every pair of animals.",
    icon: "🐾",
    category: "kids",
    group: "fun",
    component: AnimalMatchGame,
  },
  {
    id: "simon",
    label: "Simon",
    description: "Watch the colours light up, then tap them back in order.",
    icon: "🟢",
    category: "kids",
    group: "fun",
    higherScoreIsBetter: true,
    bestUnit: "rounds",
    component: SimonGame,
  },
  {
    id: "odd-one-out",
    label: "Odd One Out",
    description: "Four things — tap the one that doesn't belong.",
    icon: "🔍",
    category: "kids",
    group: "fun",
    higherScoreIsBetter: true,
    bestUnit: "streak",
    component: OddOneOutGame,
  },
  {
    id: "color-tap",
    label: "Color Tap",
    description: "Tap the colour that matches the one shown.",
    icon: "🎨",
    category: "kids",
    group: "fun",
    higherScoreIsBetter: true,
    bestUnit: "streak",
    component: ColorTapGame,
  },

  // ---------- Kids · Ready for School ----------
  // These are Hebrew-literacy prep games for pre-readers, so their whole
  // presentation — card label, description, and in-game chrome — is in
  // Hebrew (see the `hebrew` prop on QuizGameScreen / GameHeader).
  {
    id: "find-the-letter",
    label: "מצאו את האות",
    description: "רואים אות ומקישים על האות הזהה.",
    icon: "🔤",
    category: "kids",
    group: "ready-for-school",
    hebrew: true,
    higherScoreIsBetter: true,
    bestUnit: "רצף",
    component: FindLetterGame,
  },
  {
    id: "letter-and-picture",
    label: "אות ותמונה",
    description: "מתאימים אות לתמונה שמתחילה בה.",
    icon: "🖼️",
    category: "kids",
    group: "ready-for-school",
    hebrew: true,
    higherScoreIsBetter: true,
    bestUnit: "רצף",
    component: LetterPictureGame,
  },
  {
    id: "count-and-choose",
    label: "סופרים ובוחרים",
    description: "סופרים את הפריטים ובוחרים את המספר הנכון.",
    icon: "🔢",
    category: "kids",
    group: "ready-for-school",
    hebrew: true,
    higherScoreIsBetter: true,
    bestUnit: "רצף",
    component: CountChooseGame,
  },
  {
    id: "what-comes-next",
    label: "מה בא אחר כך?",
    description: "משלימים את הסדרה — מספרים, צבעים וצורות.",
    icon: "➡️",
    category: "kids",
    group: "ready-for-school",
    hebrew: true,
    higherScoreIsBetter: true,
    bestUnit: "רצף",
    component: WhatComesNextGame,
  },
  {
    id: "first-math",
    label: "חשבון ראשון",
    description: "חיבור וחיסור פשוט, עם נקודות לעזרה.",
    icon: "➕",
    category: "kids",
    group: "ready-for-school",
    hebrew: true,
    higherScoreIsBetter: true,
    bestUnit: "רצף",
    component: FirstMathGame,
  },
  {
    id: "shapes-and-colors",
    label: "צורות וצבעים",
    description: "מוצאים את הצורה הנכונה — ואת הצבע הנכון.",
    icon: "🔺",
    category: "kids",
    group: "ready-for-school",
    hebrew: true,
    higherScoreIsBetter: true,
    bestUnit: "רצף",
    component: ShapesColorsGame,
  },
  {
    id: "which-doesnt-belong",
    label: "מה לא שייך?",
    description: "ארבעה דברים — מקישים על זה שלא מתאים לשאר.",
    icon: "🧩",
    category: "kids",
    group: "ready-for-school",
    hebrew: true,
    higherScoreIsBetter: true,
    bestUnit: "רצף",
    component: WhichDoesntBelongGame,
  },
  {
    id: "follow-instructions",
    label: "מבצעים הוראות",
    description: "מקשיבים ומקישים על הדברים בסדר הנכון.",
    icon: "👂",
    category: "kids",
    group: "ready-for-school",
    hebrew: true,
    higherScoreIsBetter: true,
    bestUnit: "רצף",
    component: FollowInstructionsGame,
  },

  // ---------- Brain Training ----------
  {
    id: "stroop-test",
    label: "Stroop Test",
    description: "Name the ink colour, not the word. Harder than it sounds.",
    icon: "🎨",
    category: "brain-training",
    higherScoreIsBetter: true,
    bestUnit: "streak",
    component: StroopGame,
  },
  {
    id: "math-sprint",
    label: "Math Sprint",
    description: "Solve as many as you can in 45 seconds.",
    icon: "⏱️",
    category: "brain-training",
    higherScoreIsBetter: true,
    bestUnit: "solved",
    component: MathSprintGame,
  },
  {
    id: "reaction-time",
    label: "Reaction Time",
    description: "Wait for green, then tap. Measured in milliseconds.",
    icon: "⚡",
    category: "brain-training",
    bestUnit: "ms",
    component: ReactionTimeGame,
  },
  {
    id: "schulte-table",
    label: "Schulte Table",
    description: "Find 1 to 25 in order, against the clock.",
    icon: "🔢",
    category: "brain-training",
    bestUnit: "ms",
    component: SchulteTableGame,
  },
  {
    id: "digit-span",
    label: "Digit Span",
    description: "A row of digits flashes — type it back. Each round adds one.",
    icon: "🧮",
    category: "brain-training",
    higherScoreIsBetter: true,
    bestUnit: "rounds",
    component: DigitSpanGame,
  },
  {
    id: "pattern-grid",
    label: "Pattern Grid",
    description: "Memorise the lit cells, then tap them from memory.",
    icon: "🔲",
    category: "brain-training",
    higherScoreIsBetter: true,
    bestUnit: "rounds",
    component: PatternGridGame,
  },

  // ---------- For Developers ----------
  {
    id: "typing-test",
    label: "Typing Test",
    description: "Type a line of real code — WPM and accuracy.",
    icon: "⌨️",
    category: "for-developers",
    higherScoreIsBetter: true,
    bestUnit: "wpm",
    component: TypingTestGame,
  },
  {
    id: "git-command-match",
    label: "Git Command Match",
    description: "Match each git command to what it does.",
    icon: "🔀",
    category: "for-developers",
    component: GitCommandMatchGame,
  },
  {
    id: "http-status-match",
    label: "HTTP Status Match",
    description: "Pair the status code with its meaning.",
    icon: "🌐",
    category: "for-developers",
    component: HttpStatusMatchGame,
  },
  {
    id: "bug-hunt",
    label: "Bug Hunt",
    description: "One bug per snippet — spot the line.",
    icon: "🐛",
    category: "for-developers",
    higherScoreIsBetter: true,
    bestUnit: "streak",
    component: BugHuntGame,
  },
  {
    id: "hex-color-guess",
    label: "Hex Color Guess",
    description: "See a colour, pick its hex code.",
    icon: "🎨",
    category: "for-developers",
    higherScoreIsBetter: true,
    bestUnit: "streak",
    component: HexColorGuessGame,
  },
  {
    id: "terminal-recall",
    label: "Terminal Recall",
    description: "Watch a growing list of commands, repeat it back.",
    icon: "⌨️",
    category: "for-developers",
    higherScoreIsBetter: true,
    bestUnit: "rounds",
    component: TerminalRecallGame,
  },

  // ---------- Arcade ----------
  {
    id: "snake",
    label: "Snake",
    description: "Eat, grow, don't bite yourself. Speeds up as you go.",
    icon: "🐍",
    category: "arcade",
    higherScoreIsBetter: true,
    bestUnit: "score",
    component: SnakeGame,
  },
  {
    id: "2048",
    label: "2048",
    description: "Slide the tiles, merge the numbers, reach 2048.",
    icon: "🔢",
    category: "arcade",
    higherScoreIsBetter: true,
    bestUnit: "score",
    component: Game2048,
  },
  {
    id: "whack-a-mole",
    label: "Whack-a-Mole",
    description: "Tap the moles as they pop up. 30 seconds.",
    icon: "🔨",
    category: "arcade",
    higherScoreIsBetter: true,
    bestUnit: "hits",
    component: WhackAMoleGame,
  },
  {
    id: "breakout",
    label: "Breakout",
    description: "Bounce the ball, clear every brick, keep it alive.",
    icon: "🧱",
    category: "arcade",
    higherScoreIsBetter: true,
    bestUnit: "score",
    component: BreakoutGame,
  },
  {
    id: "pong",
    label: "Pong",
    description: "First to seven against the computer.",
    icon: "🏓",
    category: "arcade",
    higherScoreIsBetter: true,
    bestUnit: "wins",
    component: PongGame,
  },
];

/** Look up one game by its registry id. */
export function getGame(gameId) {
  return GAMES.find((game) => game.id === gameId) ?? null;
}

/** Every game in a Browse Categories bucket, in registry order. */
export function gamesInCategory(categoryId) {
  return GAMES.filter((game) => game.category === categoryId);
}
