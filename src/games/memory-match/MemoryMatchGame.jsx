import { useMemo, useState } from "react";
import { GameHeader } from "../../components/GameHeader";
import { Card } from "../../components/Card";
import { WinMessage } from "../../components/WinMessage";
import { ToastMessage } from "../../components/ToastMessage";
import { ComboBadge, DifficultyPills } from "../../components/game-ui";
import { useGameResult } from "../shared/useGameResult";
import { useGameLogic } from "./useGameLogic";
import { LEVELS, DEFAULT_LEVEL, pairsFor, levelPills, colsFor } from "./difficulty";

const DIFF_KEY = "memory-match-difficulty";

function loadDifficulty() {
  try {
    const v = localStorage.getItem(DIFF_KEY);
    if (v && LEVELS[v]) return v;
  } catch {
    // localStorage blocked — fall through
  }
  return DEFAULT_LEVEL;
}

// Rendered by the registry in `src/games/index.js`. Every game component
// receives this same prop shape: theme data/handlers from useTheme, the
// shared `bestScores` hook, its own registry `gameId`, and `onExit` to
// return to the game menu.
//
// The board itself lives in <MemoryBoard>, keyed by theme + difficulty so a
// change to either deals a genuinely fresh board (no reset-in-effect).
export function MemoryMatchGame({
  gameId,
  allThemes,
  activeThemeId,
  onThemeChange,
  bestScores,
  higherIsBetter,
  bestUnit,
  onExit,
}) {
  const [difficulty, setDifficulty] = useState(loadDifficulty);

  const icons = allThemes.find((t) => t.id === activeThemeId)?.icons ?? [];
  const pairCount = pairsFor(difficulty, icons.length);

  const chooseDifficulty = (level) => {
    setDifficulty(level);
    try {
      localStorage.setItem(DIFF_KEY, level);
    } catch {
      // ignore write failure
    }
  };

  return (
    <MemoryBoard
      key={`${activeThemeId}:${difficulty}`}
      gameId={gameId}
      icons={icons}
      pairCount={pairCount}
      difficulty={difficulty}
      pills={levelPills(icons.length)}
      onDifficulty={chooseDifficulty}
      allThemes={allThemes}
      activeThemeId={activeThemeId}
      onThemeChange={onThemeChange}
      bestScores={bestScores}
      higherIsBetter={higherIsBetter}
      bestUnit={bestUnit}
      onExit={onExit}
    />
  );
}

function MemoryBoard({
  gameId,
  icons,
  pairCount,
  difficulty,
  pills,
  onDifficulty,
  allThemes,
  activeThemeId,
  onThemeChange,
  bestScores,
  higherIsBetter,
  bestUnit,
  onExit,
}) {
  const cardValues = useMemo(() => {
    const chosen = icons.slice(0, pairCount);
    return [...chosen, ...chosen];
  }, [icons, pairCount]);

  const {
    cards,
    score,
    moves,
    isGameWon,
    matchMessage,
    streak,
    bestStreak,
    mismatchedCards,
    initializeGame,
    handleCardClick,
  } = useGameLogic(cardValues);

  // Best score is tracked per theme *and* board size — a 4-pair win can't
  // overwrite a 12-pair best.
  const best = useGameResult(bestScores, gameId, `${activeThemeId}:${difficulty}`, {
    ended: isGameWon,
    result: { moves, score },
    higherIsBetter,
  });

  const cols = colsFor(pairCount);

  return (
    <>
      <GameHeader
        title="🧠 Memory Match"
        score={score}
        moves={moves}
        best={best}
        bestUnit={bestUnit}
        extraStat={
          streak >= 2
            ? { label: "Streak:", value: `×${streak}`, tone: "streak" }
            : undefined
        }
        onReset={initializeGame}
        onExit={onExit}
        allThemes={allThemes}
        activeThemeId={activeThemeId}
        onThemeChange={onThemeChange}
      />
      <div className="mm-controls">
        <DifficultyPills
          options={pills}
          value={difficulty}
          onChange={onDifficulty}
          ariaLabel="Board size"
        />
      </div>
      {matchMessage && <ToastMessage message={matchMessage} />}
      <ComboBadge count={streak} threshold={3} label="streak" />
      {isGameWon && (
        <WinMessage
          moves={moves}
          score={score}
          best={best}
          note={bestStreak >= 3 ? `Best streak this game: ×${bestStreak}` : undefined}
          onNewGame={initializeGame}
        />
      )}
      <div
        className={`cards-grid${isGameWon ? " is-complete" : ""}`}
        data-cols={cols}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={handleCardClick}
            mismatch={mismatchedCards.includes(card.id)}
          />
        ))}
      </div>
    </>
  );
}
