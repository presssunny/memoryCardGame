// Shared content for the "Ready for School" games (prep for first grade).
// Hebrew is used only as short single tokens (a letter, a word) — always
// rendered inside dir="rtl" wrappers.

// The Hebrew alphabet, final forms folded into their base letter.
export const HEBREW_LETTERS = [
  "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "כ", "ל",
  "מ", "נ", "ס", "ע", "פ", "צ", "ק", "ר", "ש", "ת",
];

// Letter → a familiar word starting with it → a picture. One entry per
// letter that has a clean, child-friendly emoji.
export const LETTER_WORDS = [
  { letter: "א", word: "אריה", emoji: "🦁" },
  { letter: "ב", word: "בית", emoji: "🏠" },
  { letter: "ג", word: "גזר", emoji: "🥕" },
  { letter: "ד", word: "דג", emoji: "🐟" },
  { letter: "ה", word: "הר", emoji: "⛰️" },
  { letter: "ו", word: "ורד", emoji: "🌹" },
  { letter: "ז", word: "זברה", emoji: "🦓" },
  { letter: "ח", word: "חתול", emoji: "🐱" },
  { letter: "ט", word: "טרקטור", emoji: "🚜" },
  { letter: "י", word: "יד", emoji: "✋" },
  { letter: "כ", word: "כלב", emoji: "🐶" },
  { letter: "ל", word: "לימון", emoji: "🍋" },
  { letter: "מ", word: "מטרייה", emoji: "☂️" },
  { letter: "נ", word: "נר", emoji: "🕯️" },
  { letter: "ס", word: "סוס", emoji: "🐴" },
  { letter: "ע", word: "עץ", emoji: "🌳" },
  { letter: "פ", word: "פרח", emoji: "🌸" },
  { letter: "צ", word: "צב", emoji: "🐢" },
  { letter: "ק", word: "קוף", emoji: "🐵" },
  { letter: "ר", word: "רכבת", emoji: "🚂" },
  { letter: "ש", word: "שמש", emoji: "☀️" },
  { letter: "ת", word: "תפוח", emoji: "🍎" },
];

// Visually confusable Hebrew letters — used to make Find the Letter harder
// at higher rounds.
export const LOOKALIKES = [
  ["ב", "כ"],
  ["ה", "ח"],
  ["ד", "ר"],
  ["ו", "ז"],
  ["ג", "נ"],
  ["ס", "ם"],
  ["ן", "ו"],
];

// `name` is the child-facing Hebrew label (rendered inside dir="rtl").
export const SHAPES = [
  { id: "circle", name: "עיגול", emoji: "⭕" },
  { id: "square", name: "ריבוע", emoji: "🟥" },
  { id: "triangle", name: "משולש", emoji: "🔺" },
  { id: "star", name: "כוכב", emoji: "⭐" },
  { id: "heart", name: "לב", emoji: "❤️" },
  { id: "diamond", name: "מעוין", emoji: "🔷" },
];

export const COUNT_ITEMS = ["🍎", "⭐", "🐟", "🎈", "🍓", "🚗", "🐤", "🌸", "🍪", "🦋"];

// Small hand-built bank for "Which Doesn't Belong" — each row is a set where
// one item (last, before shuffling) is the odd one, plus a why for parents.
export const ODD_SETS = [
  { items: ["🍎", "🍌", "🍊", "🚗"], odd: "🚗" },
  { items: ["🐶", "🐱", "🐰", "🌳"], odd: "🌳" },
  { items: ["🚗", "🚌", "🚲", "🍕"], odd: "🍕" },
  { items: ["👕", "👖", "🧥", "🍎"], odd: "🍎" },
  { items: ["☀️", "🌙", "⭐", "🐟"], odd: "🐟" },
  { items: ["✏️", "📕", "✂️", "🍌"], odd: "🍌" },
  { items: ["🐝", "🦋", "🐞", "🐘"], odd: "🐘" },
  { items: ["🍓", "🍒", "🍎", "🥦"], odd: "🥦" },
  { items: ["⚽", "🏀", "🎾", "🍰"], odd: "🍰" },
  { items: ["🌧️", "❄️", "☀️", "🚀"], odd: "🚀" },
  { items: ["🐟", "🐬", "🐙", "🐦"], odd: "🐦" },
  { items: ["🎹", "🥁", "🎸", "🍇"], odd: "🍇" },
];

export function shuffle(array, rng = Math.random) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample(array, n, rng = Math.random) {
  return shuffle(array, rng).slice(0, n);
}
