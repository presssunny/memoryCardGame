import { useEffect, useRef, useState } from "react";
import "./gameUI.css";
import { GameButton } from "./GameButton";
import { useSound } from "./useSound";

// One stat chip. `tone` drives the accent colour ("score" default, plus
// best / timer / lives / streak / good). `value` briefly bumps when it
// changes so a score tick is felt, not just read.
function StatChip({ label, value, tone = "score" }) {
  const [bump, setBump] = useState(false);
  const prev = useRef(value);
  useEffect(() => {
    if (prev.current !== value) {
      prev.current = value;
      setBump(true);
      const id = setTimeout(() => setBump(false), 320);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [value]);

  return (
    <div className="gx-chip stat-item" data-tone={tone}>
      <span className="gx-chip-label stat-label">{label}</span>
      <span className={`gx-chip-value stat-value${bump ? " is-bumped" : ""}`}>
        {value}
      </span>
    </div>
  );
}

// The modern in-game HUD: title, a row of stat chips (only the ones the game
// passes), a sound toggle, and the reset / back actions. `chips` is
// [{ id, label, value, tone }]. `children` is an extra controls slot
// (difficulty pills, theme switcher…).
export function GameHUD({
  title,
  chips = [],
  onReset,
  onExit,
  resetLabel,
  backLabel,
  hebrew = false,
  children,
}) {
  const { soundOn, toggleSound } = useSound();
  const t = hebrew
    ? { back: backLabel ?? "→ למשחקים", reset: resetLabel ?? "מהתחלה", sound: "צליל" }
    : { back: backLabel ?? "← Games", reset: resetLabel ?? "Restart", sound: "Sound" };

  return (
    <div className="gx-hud game-header" dir={hebrew ? "rtl" : undefined}>
      <div className="gx-hud-top">
        {onExit && (
          <GameButton
            variant="ghost"
            size="sm"
            className="back-btn"
            onClick={onExit}
          >
            {t.back}
          </GameButton>
        )}
        <h1 className="gx-hud-title">{title}</h1>
        <GameButton
          variant="icon"
          onClick={toggleSound}
          aria-pressed={soundOn}
          aria-label={`${t.sound}: ${soundOn ? "on" : "off"}`}
          title={t.sound}
        >
          {soundOn ? "🔊" : "🔇"}
        </GameButton>
      </div>

      {chips.length > 0 && (
        <div className="gx-hud-chips">
          {chips.map((c) => (
            <StatChip key={c.id} label={c.label} value={c.value} tone={c.tone} />
          ))}
        </div>
      )}

      {children}

      {onReset && (
        <div className="gx-hud-actions">
          <GameButton
            variant="secondary"
            size="sm"
            className="reset-btn"
            icon={hebrew ? undefined : "↻"}
            onClick={onReset}
          >
            {t.reset}
          </GameButton>
        </div>
      )}
    </div>
  );
}
