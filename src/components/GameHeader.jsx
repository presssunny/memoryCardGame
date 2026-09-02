import { GameHUD } from "./game-ui/GameHUD";
import { ThemeSwitcher } from "./ThemeSwitcher";

// Guess a chip accent from its label so a timer reads cyan and lives read
// red without every game having to say so. It only picks a colour — a wrong
// guess is a slightly-off accent, nothing more. Pass an explicit tone on
// `extraStat` to override.
function toneFor(label = "") {
  const s = String(label).toLowerCase();
  if (/time|timer|זמן|שנ|sec/.test(s)) return "timer";
  if (/live|life|חיים/.test(s)) return "lives";
  if (/streak|combo|רצף/.test(s)) return "streak";
  return "score";
}

// The in-game header. Public API is unchanged — it now renders the shared
// GameHUD (title, stat chips, sound toggle, restart / back) so every game
// gets the modern HUD without its own changes.
export const GameHeader = ({
  title = "🎮 Memory Card Game",
  score,
  scoreLabel = "Score:",
  moves,
  movesLabel = "Moves:",
  best,
  bestUnit = "moves",
  extraStat,
  onReset,
  onExit,
  hebrew = false,
  allThemes,
  activeThemeId,
  onThemeChange,
}) => {
  const chips = [];
  if (score != null)
    chips.push({ id: "score", label: scoreLabel, value: score, tone: "score" });
  if (moves != null)
    chips.push({
      id: "moves",
      label: movesLabel,
      value: moves,
      tone: toneFor(movesLabel),
    });
  if (best)
    chips.push({
      id: "best",
      label: hebrew ? "שיא:" : "Best:",
      value: `${best.moves} ${bestUnit}`,
      tone: "best",
    });
  if (extraStat)
    chips.push({
      id: "extra",
      label: extraStat.label,
      value: extraStat.value,
      tone: extraStat.tone ?? toneFor(extraStat.label),
    });

  return (
    <GameHUD
      title={title}
      chips={chips}
      onReset={onReset}
      onExit={onExit}
      hebrew={hebrew}
    >
      {allThemes && (
        <ThemeSwitcher
          allThemes={allThemes}
          activeThemeId={activeThemeId}
          onThemeChange={onThemeChange}
        />
      )}
    </GameHUD>
  );
};
