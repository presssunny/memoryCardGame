import { useEffect, useRef, useState } from "react";
import "./gameUI.css";
import { GameButton } from "./GameButton";
import { useSound } from "./useSound";

const CONFETTI_COLORS = ["#f5b849", "#818cf8", "#22c55e", "#ec4899", "#22d3ee"];

function Confetti() {
  const pieces = Array.from({ length: 22 }, (_, i) => ({
    left: `${(i * 4.6 + 3) % 100}%`,
    bg: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: `${(i % 6) * 0.08}s`,
    dur: `${1.2 + (i % 5) * 0.18}s`,
  }));
  return (
    <div className="gx-confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <i
          key={i}
          style={{
            left: p.left,
            background: p.bg,
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
        />
      ))}
    </div>
  );
}

// A number that counts up to its target on mount. Falls back to showing the
// value as-is for non-numbers, zero, and reduced-motion.
function CountUp({ value }) {
  const animate =
    typeof value === "number" &&
    value > 0 &&
    !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!animate) return undefined;
    const start = performance.now();
    const dur = 520;
    let raf = 0;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      setShown(Math.round(value * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, animate]);

  return <>{animate ? shown : value}</>;
}

// The shared end-of-game screen. Both WinMessage and LoseMessage render
// through this.
//
//   variant     "win" | "lose"
//   bigValue    the hero number (usually the score); bigLabel names it
//   isRecord    show the NEW RECORD ribbon + confetti + chime
//   meta        [{ label, value }] secondary figures (best, average…)
//   onPlayAgain / onExit   the two CTAs (Back to Games only if onExit given)
export function GameResult({
  variant = "win",
  title,
  badge,
  bigValue,
  bigLabel,
  isRecord = false,
  meta = [],
  note,
  onPlayAgain,
  onExit,
  playAgainLabel,
  exitLabel,
  hebrew = false,
}) {
  const { play } = useSound();
  const chimed = useRef(false);
  useEffect(() => {
    if (chimed.current) return;
    chimed.current = true;
    play(isRecord ? "record" : variant === "win" ? "score" : "over");
  }, [isRecord, variant, play]);

  const t = hebrew
    ? {
        again: playAgainLabel ?? "עוד פעם",
        exit: exitLabel ?? "חזרה למשחקים",
        record: "שיא חדש!",
      }
    : {
        again: playAgainLabel ?? "Play Again",
        exit: exitLabel ?? "Back to Games",
        record: "New Record",
      };
  const showConfetti = isRecord && variant === "win";

  return (
    <div className="gx-result-overlay win-overlay">
      <div
        className={`gx-result gx-result--${variant}`}
        role="dialog"
        aria-live="polite"
        dir={hebrew ? "rtl" : undefined}
        lang={hebrew ? "he" : undefined}
      >
        {showConfetti && <Confetti />}
        <div className="gx-result-badge">
          {badge ?? (variant === "win" ? "🏆" : "💥")}
        </div>
        <div className="gx-result-title">{title}</div>

        {isRecord && (
          <div className="gx-result-record">
            <span aria-hidden="true">⭐</span> {t.record}
          </div>
        )}

        {bigValue != null && (
          <>
            <div className="gx-result-score">
              <CountUp value={bigValue} />
            </div>
            {bigLabel && (
              <div className="gx-result-score-label">{bigLabel}</div>
            )}
          </>
        )}

        {meta.length > 0 && (
          <div className="gx-result-meta">
            {meta.map((m) => (
              <span key={m.label}>
                {m.label}
                <b>{m.value}</b>
              </span>
            ))}
          </div>
        )}

        {note && <p className="gx-result-note">{note}</p>}

        <div className="gx-result-actions">
          {onPlayAgain && (
            <GameButton className="win-new-game-btn" onClick={onPlayAgain}>
              {t.again}
            </GameButton>
          )}
          {onExit && (
            <GameButton variant="ghost" onClick={onExit}>
              {t.exit}
            </GameButton>
          )}
        </div>
      </div>
    </div>
  );
}
