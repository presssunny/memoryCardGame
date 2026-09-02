import { useCallback, useEffect, useRef, useState } from "react";

// Thin wrapper over the Web Speech API's SpeechSynthesis — used by the
// listening games (Follow Instructions) to read an instruction aloud. No
// dependency, no audio files.
//
// Contract:
//   - `supported`      — the browser exposes speechSynthesis at all
//   - `voiceReady`     — a voice for `lang` is actually installed; when false
//                        the caller must show the text (never a silent fail)
//   - `speak(text)`    — read it aloud; cancels anything already queued first
//   - `cancel()`       — stop immediately (also runs on unmount)
//   - `speaking`       — reactive, for a live "speaking…" affordance
//
// Voices load asynchronously in most browsers, so we listen for
// `voiceschanged` and re-check.
export function useSpeech(lang = "he-IL") {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  const supported = !!synth;

  const [voiceReady, setVoiceReady] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const voiceRef = useRef(null);

  useEffect(() => {
    if (!synth) return undefined;
    const base = lang.split("-")[0].toLowerCase();

    const pickVoice = () => {
      const voices = synth.getVoices() || [];
      const match =
        voices.find((v) => v.lang?.toLowerCase() === lang.toLowerCase()) ||
        voices.find((v) => v.lang?.toLowerCase().startsWith(base));
      voiceRef.current = match || null;
      setVoiceReady(!!match);
    };

    pickVoice();
    synth.addEventListener?.("voiceschanged", pickVoice);
    return () => synth.removeEventListener?.("voiceschanged", pickVoice);
  }, [synth, lang]);

  const cancel = useCallback(() => {
    if (!synth) return;
    synth.cancel();
    setSpeaking(false);
  }, [synth]);

  useEffect(() => cancel, [cancel]);

  const speak = useCallback(
    (text) => {
      if (!synth || !text) return false;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(String(text));
      u.lang = lang;
      if (voiceRef.current) u.voice = voiceRef.current;
      u.rate = 0.95; // a touch slower — these are pre-readers
      u.pitch = 1.05;
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      setSpeaking(true);
      synth.speak(u);
      return true;
    },
    [synth, lang],
  );

  return { supported, voiceReady, speaking, speak, cancel };
}
