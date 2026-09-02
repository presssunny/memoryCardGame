import { useNavigate } from "react-router-dom";
import { parentPath } from "./paths";

// Mounts one game component for a resolved game route. Everything the game
// needs still arrives as the same flat prop shape it always had — the only
// new wiring is `onExit`, which now navigates one real level up the URL
// hierarchy (game → sub-section/category → …) instead of flipping a state flag.
export function GameHost({ resolved, theme, bestScores }) {
  const navigate = useNavigate();
  const { game, category } = resolved;
  const GameComponent = game.component;
  const usesCards = game.usesCards ?? false;
  // The document title is owned centrally by GamesArea (see App.jsx) so it
  // never lingers after you leave a game.

  const exitGame = () => navigate(parentPath(resolved));

  return (
    <div
      className={`app app-game${
        usesCards ? ` theme--${theme.activeTheme.id}` : ""
      }`}
      data-category={category.id}
    >
      <GameComponent
        key={usesCards ? `${game.id}-${theme.activeTheme.id}` : game.id}
        gameId={game.id}
        cardValues={theme.cardValues}
        allThemes={theme.allThemes}
        activeThemeId={theme.activeTheme.id}
        onThemeChange={theme.changeTheme}
        bestScores={bestScores}
        higherIsBetter={game.higherScoreIsBetter}
        bestUnit={game.bestUnit}
        onExit={exitGame}
      />
    </div>
  );
}
