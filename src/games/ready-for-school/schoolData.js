// Shared content for the "Ready for School" games (prep for first grade).
// Hebrew is used only as short single tokens (a letter, a word) — always
// rendered inside dir="rtl" wrappers.
//
// Pictures are ids into the shared Kids asset library (src/assets/kids) —
// rendered with <Pic id=… />, never as raw emoji. See that folder's README
// for the art source and license.
import { LETTER_PICTURES } from "../../assets/kids/manifest";

// The Hebrew alphabet, final forms folded into their base letter.
export const HEBREW_LETTERS = [
  "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "כ", "ל",
  "מ", "נ", "ס", "ע", "פ", "צ", "ק", "ר", "ש", "ת",
];

// Letter → a familiar word starting with it → a picture. Derived from the
// asset library's `letter` rows so the word and the image can never drift
// apart. `pic` is the asset id; `word` is the Hebrew word.
export const LETTER_WORDS = LETTER_PICTURES.map((a) => ({
  letter: a.letter,
  word: a.he,
  pic: a.id,
}));

// The five Hebrew letters with a distinct final (sofit) form. Only these are
// ever used in Find the Letter's final-form rounds — a letter without a
// sofit is never shown there, so the question always has a real answer.
export const FINAL_FORMS = [
  { base: "כ", final: "ך" },
  { base: "מ", final: "ם" },
  { base: "נ", final: "ן" },
  { base: "פ", final: "ף" },
  { base: "צ", final: "ץ" },
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

// `name` is the child-facing Hebrew label (rendered inside dir="rtl");
// `pic` is the asset id for the shape's picture.
export const SHAPES = [
  { id: "circle", name: "עיגול", pic: "circle" },
  { id: "square", name: "ריבוע", pic: "square" },
  { id: "triangle", name: "משולש", pic: "triangle" },
  { id: "star", name: "כוכב", pic: "star" },
  { id: "heart", name: "לב", pic: "heart" },
  { id: "diamond", name: "מעוין", pic: "diamond" },
];

// Countable things — asset ids. A row of the same picture is shown to count.
export const COUNT_ITEMS = [
  "apple", "star", "fish", "balloon", "strawberry",
  "car", "chick", "blossom", "cookie", "butterfly",
];

// Hand-built bank for "Which Doesn't Belong". Each row: asset ids with one
// odd one, `group` (the plural noun the other three share) and `why` (why
// the odd one is out) for the after-a-wrong-answer review. `tier` drives
// the difficulty curve — 1 is a wildly different odd one, 3 needs a real
// distinction. The odd-one categories are spread out on purpose (no single
// "the answer is always the food" shortcut).
export const ODD_SETS = [
  // ---- tier 1: the odd one is a completely different kind of thing ----
  { tier: 1, items: ["dog", "cat", "rabbit", "car"], odd: "car", group: "בעלי חיים", why: "מכונית זו לא בעל חיים" },
  { tier: 1, items: ["apple", "banana", "grapes", "guitar"], odd: "guitar", group: "פירות", why: "גיטרה זה כלי נגינה" },
  { tier: 1, items: ["car", "bus", "train", "pizza"], odd: "pizza", group: "כלי תחבורה", why: "פיצה זה אוכל" },
  { tier: 1, items: ["shirt", "jeans", "coat", "apple"], odd: "apple", group: "בגדים", why: "תפוח זה אוכל" },
  { tier: 1, items: ["guitar", "piano", "drum", "fish"], odd: "fish", group: "כלי נגינה", why: "דג הוא בעל חיים" },
  { tier: 1, items: ["sun", "moon", "star", "bicycle"], odd: "bicycle", group: "דברים בשמיים", why: "אופניים נוסעים על הקרקע" },
  // ---- tier 2: same big group, one clear difference ----
  { tier: 2, items: ["strawberry", "cherries", "grapes", "broccoli"], odd: "broccoli", group: "פירות", why: "ברוקולי זה ירק" },
  { tier: 2, items: ["soccer-ball", "basketball", "baseball", "orange"], odd: "orange", group: "כדורים למשחק", why: "תפוז זה פרי, לא כדור" },
  { tier: 2, items: ["bee", "butterfly", "ladybug", "bird"], odd: "bird", group: "חרקים", why: "ציפור היא לא חרק" },
  { tier: 2, items: ["fish", "shark", "octopus", "frog"], odd: "frog", group: "חיות הים", why: "צפרדע חיה גם ביבשה" },
  { tier: 2, items: ["car", "bus", "taxi", "tractor"], odd: "tractor", group: "מכוניות לכביש", why: "טרקטור עובד בשדה" },
  { tier: 2, items: ["rose", "tulip", "sunflower", "tree"], odd: "tree", group: "פרחים", why: "עץ גדול, השאר פרחים" },
  // ---- tier 3: needs a real distinction ----
  { tier: 3, items: ["car", "bus", "bicycle", "airplane"], odd: "airplane", group: "כלי תחבורה בכביש", why: "מטוס טס באוויר" },
  { tier: 3, items: ["dog", "cat", "cow", "lion"], odd: "lion", group: "חיות שגרות ליד אנשים", why: "אריה הוא חיית בר" },
  { tier: 3, items: ["bird", "bee", "butterfly", "penguin"], odd: "penguin", group: "בעלי חיים שעפים", why: "פינגווין לא יכול לעוף" },
  { tier: 3, items: ["rose", "tulip", "hibiscus", "cactus"], odd: "cactus", group: "פרחים רכים", why: "לקקטוס יש קוצים" },
];

// Re-exported so schoolQuestions.js and followInstructions.data.js keep
// importing shuffle/sample from here — this file is their shared "content +
// helpers" module.
export { shuffle, sample } from "../../utils/random";
