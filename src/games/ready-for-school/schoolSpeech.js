// Spoken-instruction text for the Ready for School games. A pre-reader can't
// read the on-screen line, so every game hands <SpokenInstruction> a full,
// self-contained Hebrew sentence describing the task — richer than the short
// visible label ("מצאו: עיגול אדום" on screen, "מצאו את העיגול האדום, ולחצו
// עליו" aloud).
import { pic } from "../../assets/kids/registry";

// Letter names, no niqqud — the TTS engine reads them cleanly.
const LETTER_NAMES = {
  א: "אלף", ב: "בית", ג: "גימל", ד: "דלת", ה: "הא", ו: "וו", ז: "זין",
  ח: "חית", ט: "טית", י: "יוד", כ: "כף", ל: "למד", מ: "מם", נ: "נון",
  ס: "סמך", ע: "עין", פ: "פא", צ: "צדי", ק: "קוף", ר: "ריש", ש: "שין", ת: "תו",
  ך: "כף סופית", ם: "מם סופית", ן: "נון סופית", ף: "פא סופית", ץ: "צדי סופית",
};

export const letterName = (l) => LETTER_NAMES[l] || l;

// Plural forms for the countable items (schoolData COUNT_ITEMS ids).
const COUNT_PLURAL = {
  apple: "תפוחים", star: "כוכבים", fish: "דגים", balloon: "בלונים",
  strawberry: "תותים", car: "מכוניות", chick: "אפרוחים", blossom: "פרחים",
  cookie: "עוגיות", butterfly: "פרפרים",
};

export const countPlural = (id) => COUNT_PLURAL[id] || (pic(id)?.he ?? "דברים");

// ---- one builder per game (takes the generated question) ----

export function speakFindLetter(q) {
  const l = q.prompt.letter;
  if (q.prompt.mode === "to-final") {
    return `לכל אות יש צורה מיוחדת בסוף מילה. מצאו את הצורה הסופית של האות ${letterName(l)}.`;
  }
  if (q.prompt.mode === "to-base") {
    return `זו צורה סופית. מצאו את האות הרגילה שהיא באה ממנה.`;
  }
  return `מצאו את האות ${letterName(l)}, ולחצו עליה.`;
}

export function speakLetterPicture(q) {
  return `באיזו תמונה המילה מתחילה באות ${letterName(q.prompt.letter)}? לחצו על התמונה.`;
}

export function speakCount(q) {
  return `כמה ${countPlural(q.prompt.item)} יש כאן? ספרו, ואז לחצו על המספר הנכון.`;
}

export function speakWhatComesNext(q) {
  const items = q.prompt.items || [];
  const numeric = items.length && items[0].num != null;
  return numeric
    ? `הסתכלו על המספרים לפי הסדר. איזה מספר בא אחר כך?`
    : `הסתכלו על הסדרה. מה בא אחר כך? לחצו על התמונה הנכונה.`;
}

export function speakFirstMath(q) {
  const p = q.prompt;
  // op is "+" or "−" (U+2212). Read the operator as a Hebrew word.
  const word = p.op === "+" ? "ועוד" : "פחות";
  if (p.missing === "result") {
    return `כמה זה ${p.a} ${word} ${p.b}? לחצו על התשובה.`;
  }
  // One operand is hidden ("? + 3 = 5" or "2 + ? = 5"): read the whole
  // equation with "כמה" spoken in the blank's place.
  const left = p.missing === "a" ? "כמה" : p.a;
  const right = p.missing === "b" ? "כמה" : p.b;
  return `${left} ${word} ${right} זה ${p.result}? לחצו על המספר החסר.`;
}

export function speakShapesColors(q) {
  return `מצאו את ${q.prompt.name}, ולחצו עליו.`;
}

export function speakWhichDoesntBelong() {
  return `כאן יש ארבע תמונות. שלוש מהן דומות ואחת שונה. לחצו על זו שלא שייכת.`;
}
