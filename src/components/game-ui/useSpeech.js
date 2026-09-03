import { useCallback, useEffect, useRef, useState } from "react";

// Wrapper over the Web Speech API's SpeechSynthesis — reads a short Hebrew
// instruction aloud for the pre-reader games. No dependency, no audio files.
// Completely independent of `useSound` (the synth sound-effects): the sound
// toggle never blocks the spoken instruction.
//
// What it returns:
//   supported     — the browser exposes speechSynthesis at all
//   hebrewVoice   — a real he / he-IL voice object, or null
//   voiceLabel    — human string for the UI ("קוֹל: Carmit" / "אין קול עברי")
//   speaking      — reactive, for a live "speaking…" affordance
//   lastError     — the last SpeechSynthesisErrorEvent.error, or null
//   speak(text)   — ALWAYS attempts to speak (even with no Hebrew voice —
//                   the OS may still have a fallback). Returns true if it
//                   handed the utterance to the engine.
//   cancel()      — stop immediately (also runs on unmount)
export function useSpeech(lang = "he-IL") {
  const synth =
    typeof window !== "undefined" && "speechSynthesis" in window
      ? window.speechSynthesis
      : null;
  const supported = !!synth;

  const [voices, setVoices] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const [lastError, setLastError] = useState(null);

  // Voices load asynchronously and inconsistently: some browsers populate
  // getVoices() straight away, some only after `voiceschanged`, some never
  // fire the event but fill the list a beat later. Cover all three.
  useEffect(() => {
    if (!synth) return undefined;
    let alive = true;
    const pull = () => {
      const list = synth.getVoices() || [];
      if (alive && list.length) setVoices(list);
      return list.length;
    };
    if (!pull()) {
      const timers = [120, 350, 800, 1600, 3000].map((ms) =>
        setTimeout(pull, ms),
      );
      synth.addEventListener?.("voiceschanged", pull);
      return () => {
        alive = false;
        timers.forEach(clearTimeout);
        synth.removeEventListener?.("voiceschanged", pull);
      };
    }
    synth.addEventListener?.("voiceschanged", pull);
    return () => {
      alive = false;
      synth.removeEventListener?.("voiceschanged", pull);
    };
  }, [synth]);

  const base = lang.split("-")[0].toLowerCase();
  const hebrewVoice =
    voices.find((v) => v.lang?.toLowerCase() === lang.toLowerCase()) ||
    voices.find((v) => v.lang?.toLowerCase().startsWith(base)) ||
    null;

  const voiceLabel = !supported
    ? "המכשיר לא תומך בהקראה"
    : hebrewVoice
      ? `קול: ${hebrewVoice.name}`
      : voices.length
        ? "אין קול עברי — מנסה קול ברירת מחדל"
        : "טוען קולות…";

  const cancel = useCallback(() => {
    if (!synth) return;
    synth.cancel();
    setSpeaking(false);
  }, [synth]);

  useEffect(() => cancel, [cancel]);

  const utterRef = useRef(null);
  const speak = useCallback(
    (text) => {
      if (!synth || !text) return false;
      setLastError(null);
      synth.cancel();
      // Chrome parks the engine in a "paused" state after a cancel — a plain
      // speak() then does nothing. Nudge it.
      if (synth.paused) synth.resume();

      const u = new SpeechSynthesisUtterance(String(text));
      u.lang = lang;
      if (hebrewVoice) u.voice = hebrewVoice; // otherwise let the OS choose
      u.rate = 0.92; // a touch slower — these are pre-readers
      u.pitch = 1.05;
      u.volume = 1;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = (e) => {
        setSpeaking(false);
        setLastError(e?.error || "speech-failed");
      };
      utterRef.current = u;
      setSpeaking(true);
      synth.speak(u);
      // Safari/Chrome sometimes need a resume kick right after speak().
      if (synth.paused) synth.resume();
      return true;
    },
    [synth, lang, hebrewVoice],
  );

  return {
    supported,
    hebrewVoice,
    voiceLabel,
    speaking,
    lastError,
    speak,
    cancel,
  };
}
