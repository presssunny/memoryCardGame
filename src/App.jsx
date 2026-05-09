import { GameHeader } from "./components/GameHeader";
import react from "./assets/react.svg";
import git from "./assets/git.svg";
import linux from "./assets/linux.svg";
import docker from "./assets/docker.svg";
import mysql from "./assets/mysql.svg";
import figma from "./assets/figma.svg";
import tailwindcss from "./assets/tailwindcss.svg";
import javascript from "./assets/javascript.svg";
import { Card } from "./components/Card";
import { WinMessage } from "./components/winMessage";
import { useGameLogic } from "./hooks/useGameLogic";

const icons = [
  react,
  git,
  linux,
  docker,
  mysql,
  figma,
  tailwindcss,
  javascript,
];

const cardValues = [...icons, ...icons];

const createCards = () =>
  cardValues.map((value, index) => ({
    id: index,
    value,
    isFlipped: false,
    isMatched: false,
  }));

function App() {
  const { cards, score, moves, isGameWon, initializeGame, handleCardClick } =
    useGameLogic(cardValues);
  return (
    <div className="app">
      <GameHeader score={score} moves={moves} onReset={initializeGame} />

      {isGameWon && <WinMessage moves={moves} score={score} />}

      <div className="cards-grid">
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
}
export default App;
