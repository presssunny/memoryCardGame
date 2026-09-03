import { useEffect, useRef, useState } from "react";
import "./gameUI.css";
import { GameButton } from "./GameButton";
import { useSound } from "./useSound";
import { useGameExit } from "./gameExit";

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

  // "Back to Games": an explicit onExit prop wins; otherwise fall back to the
  // exit action GameHost provides for the whole game subtree, so the result
  // screen is never a dead end even when a game forgot to thread the prop.
  const ctxExit = useGameExit();
  const exit = onExit ?? ctxExit ?? undefined;

  // Modal focus management (H3): move focus into the dialog on open, keep Tab
  // inside it, and restore focus to wherever it was when it closes. Done once
  // here so every game's end screen behaves like a real dialog.
  const dialogRef = useRef(null);
  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return undefined;
    const opener = document.activeElement;
    const focusables = () =>
      node.querySelectorAll(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
    (focusables()[0] ?? node).focus();

    const onKeyDown = (e) => {
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    node.addEventListener("keydown", onKeyDown);
    return () => {
      node.removeEventListener("keydown", onKeyDown);
      if (opener instanceof HTMLElement && document.contains(opener)) {
        opener.focus();
      }
    };
  }, []);

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
        ref={dialogRef}
        className={`gx-result gx-result--${variant}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        aria-live="polite"
        tabIndex={-1}
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
          {exit && (
            <GameButton variant="ghost" onClick={exit}>
              {t.exit}
            </GameButton>
          )}
        </div>
      </div>
    </div>
  );
}
