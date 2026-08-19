export function GameMenu({ games, bestScores, onSelectGame }) {
  return (
    <div className="game-menu">
      <h1>🎮 Game Arcade</h1>
      <p className="game-menu-subtitle">Pick a game to play</p>
      <div className="game-menu-grid">
        {games.map((game) => {
          const best = bestScores.getBestOverall(game.id, {
            higherIsBetter: game.higherScoreIsBetter,
          });
          return (
            <button
              key={game.id}
              className="game-card"
              onClick={() => onSelectGame(game.id)}
            >
              <span className="game-card-icon">{game.icon}</span>
              <span className="game-card-label">{game.label}</span>
              <span className="game-card-description">
                {game.description}
              </span>
              {best && (
                <span className="game-card-best">
                  🏆 Best: {best.moves} {game.bestUnit ?? "moves"}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
