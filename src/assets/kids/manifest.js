// The catalogue of every picture used by the Kids games. One row per concept:
//
//   id     — stable slug the game data refers to ("lion", "red-circle")
//   emoji  — the source glyph; the SVG filename is derived from its codepoint
//   en/he  — the label, used as the image alt text (he for the Hebrew,
//            pre-reader "Ready for School" games; en everywhere else)
//   letter — Hebrew starting letter, only for the "letter → picture" set
//   cat    — grouping ("animals", "food", "transport", …) so a game can ask
//            for "a picture from this category"
//
// Art: Twemoji (jdecked/twemoji), CC-BY 4.0. See ./README.md for attribution.
// Files are fetched by scripts/fetch-kids-assets.mjs into ./pics/<codepoint>.svg
// and wired up in ./registry.js.

/** Twemoji SVG basename for an emoji: hex codepoints, no VS16, joined by "-". */
export function codepointOf(emoji) {
  return [...emoji]
    .map((c) => c.codePointAt(0).toString(16))
    .filter((h) => h !== "fe0f")
    .join("-");
}

export const KID_ASSETS = [
  // ---- letter → picture (one per Hebrew letter that has a clean image) ----
  { id: "lion", emoji: "🦁", en: "lion", he: "אריה", letter: "א", cat: "animals" },
  { id: "house", emoji: "🏠", en: "house", he: "בית", letter: "ב", cat: "objects" },
  { id: "carrot", emoji: "🥕", en: "carrot", he: "גזר", letter: "ג", cat: "food" },
  { id: "fish", emoji: "🐟", en: "fish", he: "דג", letter: "ד", cat: "sea" },
  { id: "mountain", emoji: "⛰️", en: "mountain", he: "הר", letter: "ה", cat: "nature" },
  { id: "rose", emoji: "🌹", en: "rose", he: "ורד", letter: "ו", cat: "nature" },
  { id: "zebra", emoji: "🦓", en: "zebra", he: "זברה", letter: "ז", cat: "animals" },
  { id: "cat", emoji: "🐱", en: "cat", he: "חתול", letter: "ח", cat: "animals" },
  { id: "tractor", emoji: "🚜", en: "tractor", he: "טרקטור", letter: "ט", cat: "transport" },
  { id: "hand", emoji: "✋", en: "hand", he: "יד", letter: "י", cat: "objects" },
  { id: "dog", emoji: "🐶", en: "dog", he: "כלב", letter: "כ", cat: "animals" },
  { id: "lemon", emoji: "🍋", en: "lemon", he: "לימון", letter: "ל", cat: "fruit" },
  { id: "umbrella", emoji: "☂️", en: "umbrella", he: "מטרייה", letter: "מ", cat: "objects" },
  { id: "candle", emoji: "🕯️", en: "candle", he: "נר", letter: "נ", cat: "objects" },
  { id: "horse", emoji: "🐴", en: "horse", he: "סוס", letter: "ס", cat: "animals" },
  { id: "tree", emoji: "🌳", en: "tree", he: "עץ", letter: "ע", cat: "nature" },
  { id: "blossom", emoji: "🌸", en: "flower", he: "פרח", letter: "פ", cat: "nature" },
  { id: "turtle", emoji: "🐢", en: "turtle", he: "צב", letter: "צ", cat: "animals" },
  { id: "monkey", emoji: "🐵", en: "monkey", he: "קוף", letter: "ק", cat: "animals" },
  { id: "train", emoji: "🚂", en: "train", he: "רכבת", letter: "ר", cat: "transport" },
  { id: "sun", emoji: "☀️", en: "sun", he: "שמש", letter: "ש", cat: "sky" },
  { id: "apple", emoji: "🍎", en: "apple", he: "תפוח", letter: "ת", cat: "fruit" },

  // ---- animals ----
  { id: "mouse", emoji: "🐭", en: "mouse", he: "עכבר", cat: "animals" },
  { id: "rabbit", emoji: "🐰", en: "rabbit", he: "ארנב", cat: "animals" },
  { id: "fox", emoji: "🦊", en: "fox", he: "שועל", cat: "animals" },
  { id: "bear", emoji: "🐻", en: "bear", he: "דוב", cat: "animals" },
  { id: "panda", emoji: "🐼", en: "panda", he: "פנדה", cat: "animals" },
  { id: "koala", emoji: "🐨", en: "koala", he: "קואלה", cat: "animals" },
  { id: "tiger", emoji: "🐯", en: "tiger", he: "נמר", cat: "animals" },
  { id: "frog", emoji: "🐸", en: "frog", he: "צפרדע", cat: "animals" },
  { id: "pig", emoji: "🐷", en: "pig", he: "חזיר", cat: "animals" },
  { id: "cow", emoji: "🐮", en: "cow", he: "פרה", cat: "animals" },
  { id: "chicken", emoji: "🐔", en: "chicken", he: "תרנגולת", cat: "animals" },
  { id: "chick", emoji: "🐤", en: "chick", he: "אפרוח", cat: "animals" },
  { id: "penguin", emoji: "🐧", en: "penguin", he: "פינגווין", cat: "animals" },
  { id: "owl", emoji: "🦉", en: "owl", he: "ינשוף", cat: "animals" },
  { id: "unicorn", emoji: "🦄", en: "unicorn", he: "חד־קרן", cat: "animals" },
  { id: "bird", emoji: "🐦", en: "bird", he: "ציפור", cat: "animals" },
  { id: "bee", emoji: "🐝", en: "bee", he: "דבורה", cat: "animals" },
  { id: "ladybug", emoji: "🐞", en: "ladybug", he: "פרת משה רבנו", cat: "animals" },
  { id: "butterfly", emoji: "🦋", en: "butterfly", he: "פרפר", cat: "animals" },
  { id: "elephant", emoji: "🐘", en: "elephant", he: "פיל", cat: "animals" },

  // ---- sea ----
  { id: "tropical-fish", emoji: "🐠", en: "tropical fish", he: "דג טרופי", cat: "sea" },
  { id: "blowfish", emoji: "🐡", en: "blowfish", he: "דג נפוח", cat: "sea" },
  { id: "shark", emoji: "🦈", en: "shark", he: "כריש", cat: "sea" },
  { id: "dolphin", emoji: "🐬", en: "dolphin", he: "דולפין", cat: "sea" },
  { id: "whale", emoji: "🐳", en: "whale", he: "לווייתן", cat: "sea" },
  { id: "crab", emoji: "🦀", en: "crab", he: "סרטן", cat: "sea" },
  { id: "lobster", emoji: "🦞", en: "lobster", he: "לובסטר", cat: "sea" },
  { id: "octopus", emoji: "🐙", en: "octopus", he: "תמנון", cat: "sea" },
  { id: "shrimp", emoji: "🦐", en: "shrimp", he: "חסילון", cat: "sea" },
  { id: "shell", emoji: "🐚", en: "shell", he: "צדף", cat: "sea" },

  // ---- fruit ----
  { id: "banana", emoji: "🍌", en: "banana", he: "בננה", cat: "fruit" },
  { id: "grapes", emoji: "🍇", en: "grapes", he: "ענבים", cat: "fruit" },
  { id: "strawberry", emoji: "🍓", en: "strawberry", he: "תות", cat: "fruit" },
  { id: "peach", emoji: "🍑", en: "peach", he: "אפרסק", cat: "fruit" },
  { id: "cherries", emoji: "🍒", en: "cherries", he: "דובדבן", cat: "fruit" },
  { id: "pineapple", emoji: "🍍", en: "pineapple", he: "אננס", cat: "fruit" },
  { id: "kiwi", emoji: "🥝", en: "kiwi", he: "קיווי", cat: "fruit" },
  { id: "watermelon", emoji: "🍉", en: "watermelon", he: "אבטיח", cat: "fruit" },
  { id: "orange", emoji: "🍊", en: "orange", he: "תפוז", cat: "fruit" },
  { id: "mango", emoji: "🥭", en: "mango", he: "מנגו", cat: "fruit" },

  // ---- food ----
  { id: "pizza", emoji: "🍕", en: "pizza", he: "פיצה", cat: "food" },
  { id: "burger", emoji: "🍔", en: "burger", he: "המבורגר", cat: "food" },
  { id: "hot-dog", emoji: "🌭", en: "hot dog", he: "נקניקייה", cat: "food" },
  { id: "fries", emoji: "🍟", en: "fries", he: "צ׳יפס", cat: "food" },
  { id: "sandwich", emoji: "🥪", en: "sandwich", he: "כריך", cat: "food" },
  { id: "taco", emoji: "🌮", en: "taco", he: "טאקו", cat: "food" },
  { id: "popcorn", emoji: "🍿", en: "popcorn", he: "פופקורן", cat: "food" },
  { id: "pretzel", emoji: "🥨", en: "pretzel", he: "בייגלה", cat: "food" },
  { id: "cheese", emoji: "🧀", en: "cheese", he: "גבינה", cat: "food" },
  { id: "donut", emoji: "🍩", en: "donut", he: "סופגנייה", cat: "food" },
  { id: "pancakes", emoji: "🥞", en: "pancakes", he: "פנקייק", cat: "food" },
  { id: "cookie", emoji: "🍪", en: "cookie", he: "עוגייה", cat: "food" },
  { id: "cake", emoji: "🍰", en: "cake", he: "עוגה", cat: "food" },
  { id: "broccoli", emoji: "🥦", en: "broccoli", he: "ברוקולי", cat: "food" },

  // ---- nature ----
  { id: "pine-tree", emoji: "🌲", en: "pine tree", he: "אורן", cat: "nature" },
  { id: "palm-tree", emoji: "🌴", en: "palm tree", he: "דקל", cat: "nature" },
  { id: "cactus", emoji: "🌵", en: "cactus", he: "קקטוס", cat: "nature" },
  { id: "tulip", emoji: "🌷", en: "tulip", he: "צבעוני", cat: "nature" },
  { id: "hibiscus", emoji: "🌺", en: "hibiscus", he: "היביסקוס", cat: "nature" },
  { id: "sunflower", emoji: "🌻", en: "sunflower", he: "חמנייה", cat: "nature" },
  { id: "clover", emoji: "🍀", en: "clover", he: "תלתן", cat: "nature" },
  { id: "maple-leaf", emoji: "🍁", en: "maple leaf", he: "עלה שלכת", cat: "nature" },

  // ---- transport ----
  { id: "car", emoji: "🚗", en: "car", he: "מכונית", cat: "transport" },
  { id: "taxi", emoji: "🚕", en: "taxi", he: "מונית", cat: "transport" },
  { id: "suv", emoji: "🚙", en: "SUV", he: "ג׳יפ", cat: "transport" },
  { id: "bus", emoji: "🚌", en: "bus", he: "אוטובוס", cat: "transport" },
  { id: "police-car", emoji: "🚓", en: "police car", he: "ניידת משטרה", cat: "transport" },
  { id: "ambulance", emoji: "🚑", en: "ambulance", he: "אמבולנס", cat: "transport" },
  { id: "fire-truck", emoji: "🚒", en: "fire truck", he: "כבאית", cat: "transport" },
  { id: "airplane", emoji: "✈️", en: "airplane", he: "מטוס", cat: "transport" },
  { id: "rocket", emoji: "🚀", en: "rocket", he: "חללית", cat: "transport" },
  { id: "bicycle", emoji: "🚲", en: "bicycle", he: "אופניים", cat: "transport" },
  { id: "scooter", emoji: "🛵", en: "scooter", he: "קטנוע", cat: "transport" },

  // ---- clothes ----
  { id: "shirt", emoji: "👕", en: "shirt", he: "חולצה", cat: "clothes" },
  { id: "jeans", emoji: "👖", en: "jeans", he: "מכנסיים", cat: "clothes" },
  { id: "coat", emoji: "🧥", en: "coat", he: "מעיל", cat: "clothes" },

  // ---- objects (school + home) ----
  { id: "book", emoji: "📕", en: "book", he: "ספר", cat: "objects" },
  { id: "pencil", emoji: "✏️", en: "pencil", he: "עיפרון", cat: "objects" },
  { id: "scissors", emoji: "✂️", en: "scissors", he: "מספריים", cat: "objects" },
  { id: "balloon", emoji: "🎈", en: "balloon", he: "בלון", cat: "objects" },

  // ---- music ----
  { id: "guitar", emoji: "🎸", en: "guitar", he: "גיטרה", cat: "music" },
  { id: "piano", emoji: "🎹", en: "piano", he: "פסנתר", cat: "music" },
  { id: "drum", emoji: "🥁", en: "drum", he: "תופים", cat: "music" },
  { id: "trumpet", emoji: "🎺", en: "trumpet", he: "חצוצרה", cat: "music" },
  { id: "violin", emoji: "🎻", en: "violin", he: "כינור", cat: "music" },
  { id: "saxophone", emoji: "🎷", en: "saxophone", he: "סקסופון", cat: "music" },
  { id: "microphone", emoji: "🎤", en: "microphone", he: "מיקרופון", cat: "music" },
  { id: "banjo", emoji: "🪕", en: "banjo", he: "בנג׳ו", cat: "music" },
  { id: "headphones", emoji: "🎧", en: "headphones", he: "אוזניות", cat: "music" },
  { id: "radio", emoji: "📻", en: "radio", he: "רדיו", cat: "music" },

  // ---- sports ----
  { id: "soccer-ball", emoji: "⚽", en: "soccer ball", he: "כדורגל", cat: "sports" },
  { id: "basketball", emoji: "🏀", en: "basketball", he: "כדורסל", cat: "sports" },
  { id: "football", emoji: "🏈", en: "football", he: "פוטבול", cat: "sports" },
  { id: "baseball", emoji: "⚾", en: "baseball", he: "בייסבול", cat: "sports" },
  { id: "tennis-ball", emoji: "🎾", en: "tennis ball", he: "כדור טניס", cat: "sports" },
  { id: "volleyball", emoji: "🏐", en: "volleyball", he: "כדורעף", cat: "sports" },
  { id: "rugby", emoji: "🏉", en: "rugby ball", he: "כדור רוגבי", cat: "sports" },
  { id: "billiards", emoji: "🎱", en: "8 ball", he: "כדור ביליארד", cat: "sports" },
  { id: "ping-pong", emoji: "🏓", en: "ping pong", he: "מחבט פינג־פונג", cat: "sports" },
  { id: "badminton", emoji: "🏸", en: "badminton", he: "מחבט נוצה", cat: "sports" },
  { id: "boxing-glove", emoji: "🥊", en: "boxing glove", he: "כפפת איגרוף", cat: "sports" },

  // ---- sky / weather ----
  { id: "moon", emoji: "🌙", en: "moon", he: "ירח", cat: "sky" },
  { id: "rain-cloud", emoji: "🌧️", en: "rain cloud", he: "ענן גשם", cat: "sky" },
  { id: "snowflake", emoji: "❄️", en: "snowflake", he: "פתית שלג", cat: "sky" },

  // ---- shapes & colour swatches ----
  { id: "circle", emoji: "⭕", en: "circle", he: "עיגול", cat: "shapes" },
  { id: "square", emoji: "🟥", en: "square", he: "ריבוע", cat: "shapes" },
  { id: "triangle", emoji: "🔺", en: "triangle", he: "משולש", cat: "shapes" },
  { id: "star", emoji: "⭐", en: "star", he: "כוכב", cat: "shapes" },
  { id: "heart", emoji: "❤️", en: "heart", he: "לב", cat: "shapes" },
  { id: "diamond", emoji: "🔷", en: "diamond", he: "מעוין", cat: "shapes" },
  { id: "circle-red", emoji: "🔴", en: "red circle", he: "עיגול אדום", cat: "shapes" },
  { id: "circle-blue", emoji: "🔵", en: "blue circle", he: "עיגול כחול", cat: "shapes" },
  { id: "circle-green", emoji: "🟢", en: "green circle", he: "עיגול ירוק", cat: "shapes" },
  { id: "circle-yellow", emoji: "🟡", en: "yellow circle", he: "עיגול צהוב", cat: "shapes" },
  { id: "circle-purple", emoji: "🟣", en: "purple circle", he: "עיגול סגול", cat: "shapes" },
  { id: "square-red", emoji: "🟥", en: "red square", he: "ריבוע אדום", cat: "shapes" },
  { id: "square-blue", emoji: "🟦", en: "blue square", he: "ריבוע כחול", cat: "shapes" },
  { id: "square-green", emoji: "🟩", en: "green square", he: "ריבוע ירוק", cat: "shapes" },
  { id: "square-yellow", emoji: "🟨", en: "yellow square", he: "ריבוע צהוב", cat: "shapes" },
  { id: "square-purple", emoji: "🟪", en: "purple square", he: "ריבוע סגול", cat: "shapes" },
];

const BY_ID = new Map(KID_ASSETS.map((a) => [a.id, a]));

/** Look up one asset row by id, or undefined if the id is unknown. */
export function asset(id) {
  return BY_ID.get(id);
}

/** All asset ids in a category, e.g. assetIds("animals"). */
export function assetIds(cat) {
  return KID_ASSETS.filter((a) => a.cat === cat).map((a) => a.id);
}

/** The 22 letter → picture rows, in alphabetical (Hebrew) order. */
export const LETTER_PICTURES = KID_ASSETS.filter((a) => a.letter);
