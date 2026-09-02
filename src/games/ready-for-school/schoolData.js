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

// Small hand-built bank for "Which Doesn't Belong" — each row is a set of
// asset ids where one is the odd one, with `group` (what the others share)
// and `why` (the odd one's category) shown to the child after a wrong answer.
export const ODD_SETS = [
  { items: ["apple", "banana", "orange", "car"], odd: "car", group: "פירות", why: "מכונית זו לא פרי" },
  { items: ["dog", "cat", "rabbit", "tree"], odd: "tree", group: "בעלי חיים", why: "עץ הוא צמח" },
  { items: ["car", "bus", "bicycle", "pizza"], odd: "pizza", group: "כלי תחבורה", why: "פיצה זה אוכל" },
  { items: ["shirt", "jeans", "coat", "apple"], odd: "apple", group: "בגדים", why: "תפוח זה אוכל" },
  { items: ["sun", "moon", "star", "fish"], odd: "fish", group: "דברים בשמיים", why: "דג חי במים" },
  { items: ["pencil", "book", "scissors", "banana"], odd: "banana", group: "דברים לבית הספר", why: "בננה זה אוכל" },
  { items: ["bee", "butterfly", "ladybug", "elephant"], odd: "elephant", group: "חרקים קטנים", why: "פיל הוא חיה גדולה" },
  { items: ["strawberry", "cherries", "apple", "broccoli"], odd: "broccoli", group: "פירות", why: "ברוקולי זה ירק" },
  { items: ["soccer-ball", "basketball", "tennis-ball", "cake"], odd: "cake", group: "כדורים למשחק", why: "עוגה זה אוכל" },
  { items: ["rain-cloud", "snowflake", "sun", "rocket"], odd: "rocket", group: "מזג אוויר", why: "חללית זו לא מזג אוויר" },
  { items: ["fish", "dolphin", "octopus", "bird"], odd: "bird", group: "חיות שחיות במים", why: "ציפור עפה באוויר" },
  { items: ["piano", "drum", "guitar", "grapes"], odd: "grapes", group: "כלי נגינה", why: "ענבים זה אוכל" },
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
