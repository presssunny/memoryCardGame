import { useSpeech } from "./useSpeech";

// Just the 🔊 button from <SpokenInstruction>, for read-aloud affordances
// that live inside their own layout — the Ready for School review panel and
// the Hebrew win screen — so a pre-reader isn't left dependent on text there
// either. Independent of the sound-effects toggle; renders nothing when the
// browser has no speech synthesis or there's no text to speak.
export function SpeakButton({ text, label = "השמעה", className = "" }) {
  const { speak, speaking, supported } = useSpeech("he-IL");
  if (!supported || !text) return null;
  return (
    <button
      type="button"
      className={`spoken-btn spoken-btn--sm${speaking ? " is-speaking" : ""}${
        className ? ` ${className}` : ""
      }`}
      onClick={() => speak(text)}
      aria-label={label}
    >
      <span aria-hidden="true">🔊</span>
    </button>
  );
}
