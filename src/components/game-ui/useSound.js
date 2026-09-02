import { useCallback, useEffect, useState } from "react";

// Tiny synthesised sound effects — no audio files, no dependency. The
// AudioContext is created lazily on the first play (browsers block it before
// a user gesture). Off by default; the choice is persisted per browser.
const STORAGE_KEY = "game-arcade-sound";

let ctx = null;
function audio() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = new AC();
  } catch {
    ctx = null;
  }
  return ctx;
}

// A short shaped tone. `type` picks a small preset.
function blip(preset) {
  const ac = audio();
  if (!ac) return;
  if (ac.state === "suspended") ac.resume().catch(() => {});
  const now = ac.currentTime;
  const presets = {
    click: { f: 220, to: 180, dur: 0.06, gain: 0.12, wave: "triangle" },
    correct: { f: 660, to: 990, dur: 0.16, gain: 0.14, wave: "sine" },
    wrong: { f: 180, to: 110, dur: 0.22, gain: 0.16, wave: "sawtooth" },
    match: { f: 520, to: 780, dur: 0.14, gain: 0.13, wave: "sine" },
    score: { f: 880, to: 880, dur: 0.09, gain: 0.1, wave: "square" },
    combo: { f: 740, to: 1180, dur: 0.2, gain: 0.14, wave: "triangle" },
    over: { f: 300, to: 90, dur: 0.5, gain: 0.16, wave: "sawtooth" },
    record: { f: 720, to: 1320, dur: 0.4, gain: 0.16, wave: "sine" },
    // The four classic Simon pad tones (G#4 / D#4 / B3 / G#3), held flat.
    "pad-0": { f: 415, to: 415, dur: 0.32, gain: 0.13, wave: "sine" },
    "pad-1": { f: 311, to: 311, dur: 0.32, gain: 0.13, wave: "sine" },
    "pad-2": { f: 252, to: 252, dur: 0.32, gain: 0.13, wave: "sine" },
    "pad-3": { f: 209, to: 209, dur: 0.32, gain: 0.13, wave: "sine" },
  };
  const p = presets[preset] ?? presets.click;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = p.wave;
  osc.frequency.setValueAtTime(p.f, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(p.to, 1), now + p.dur);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(p.gain, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + p.dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(now);
  osc.stop(now + p.dur + 0.02);
}

function load() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

// Module-level so every hook instance agrees and a game that plays a sound
// reflects the toggle another component flipped.
let enabled = load();
const listeners = new Set();
function setEnabled(next) {
  enabled = next;
  try {
    localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((fn) => fn(next));
}

export function useSound() {
  const [on, setOn] = useState(enabled);

  useEffect(() => {
    listeners.add(setOn);
    return () => listeners.delete(setOn);
  }, []);

  const play = useCallback((preset) => {
    if (!enabled) return;
    blip(preset);
  }, []);

  const toggle = useCallback(() => {
    const next = !enabled;
    setEnabled(next);
    if (next) blip("click"); // confirm it works on the turn-on gesture
  }, []);

  return { soundOn: on, play, toggleSound: toggle };
}
