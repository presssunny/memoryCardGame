import { useEffect, useRef, useState } from "react";
import { useSpeech } from "./useSpeech";

// A read-aloud instruction for the pre-reader games. Two deliberate choices:
//   • the 🔊 button is ALWAYS shown when the browser has speechSynthesis at
//     all — never gated on "is there a Hebrew voice". A missing he-IL voice
//     still usually speaks through an OS fallback, and a hidden button tells
//     the child nothing.
//   • it is completely independent of the sound-effects toggle (`useSound`).
//     Effects off still lets you hear the instruction.
//
// After the child taps 🔊 once, every following instruction is spoken
// automatically so the listening loop keeps going without another tap. (We
// don't autoplay before that first tap — browsers block speech without a
// user gesture, and a surprise voice isn't wanted anyway.)
//
// Props:
//   text      — the plain string to speak (required for speech to do anything)
//   children  — the visible instruction node; falls back to `text`
//   speakKey  — changes when the instruction changes; drives the auto-repeat
//               (defaults to `text`)
//   dir/lang  — passed to the visible text (default rtl / he)
export function SpokenInstruction({
  text,
  children,
  speakKey,
  dir = "rtl",
  lang = "he",
  className = "",
}) {
  const speech = useSpeech("he-IL");
  const { speak, supported } = speech;
  const [armed, setArmed] = useState(false);
  const spokenFor = useRef(null);
  const key = speakKey ?? text;

  const sayNow = () => {
    setArmed(true);
    spokenFor.current = key;
    speak(text);
  };

  useEffect(() => {
    if (!armed || !supported || !text) return;
    if (spokenFor.current === key) return;
    spokenFor.current = key;
    speak(text);
  }, [armed, supported, text, key, speak]);

  const err = speech.lastError;
  const hint =
    err === "not-allowed"
      ? "הדפדפן חסם את ההקראה — נסו ללחוץ שוב על 🔊"
      : err && err !== "interrupted" && err !== "canceled"
        ? "ההקראה לא הצליחה במכשיר הזה — אפשר לקרוא את ההוראה למעלה"
        : !supported
          ? "המכשיר לא תומך בהקראה — אפשר לקרוא את ההוראה למעלה"
          : armed && !speech.hebrewVoice && speech.voiceLabel.startsWith("אין")
            ? "אין קול עברי מותקן — נשמע קול ברירת מחדל של המכשיר"
            : null;

  return (
    <div className={`spoken ${className}`.trim()} dir={dir}>
      <div className="spoken-row">
        {supported && (
          <button
            type="button"
            className={`spoken-btn${speech.speaking ? " is-speaking" : ""}${
              (!armed || speech.lastError) && !speech.speaking ? " is-idle" : ""
            }`}
            onClick={sayNow}
            aria-label="השמעת ההוראה"
          >
            <span aria-hidden="true">🔊</span>
          </button>
        )}
        <p className="spoken-text" dir={dir} lang={lang} aria-live="polite">
          {children ?? text}
        </p>
      </div>
      {hint && (
        <p className="spoken-status" dir="rtl" lang="he">
          {hint}
        </p>
      )}
    </div>
  );
}
