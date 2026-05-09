import { useEffect, useState } from "react";
import { GameHeader } from "./components/GameHeader";
import react from "./assets/react.svg";
import github from "./assets/github.svg";
import linux from "./assets/linux.svg";
import docker from "./assets/docker.svg";
import mysql from "./assets/mysql.svg";
import figma from "./assets/figma.svg";
import tailwindcss from "./assets/tailwindcss.svg";
import javascript from "./assets/javascript.svg";
import { Card } from "./components/Card";

const icons = [
  react,
  github,
  linux,
  docker,
  mysql,
  figma,
  tailwindcss,
  javascript,
];

const cardValues = [...icons, ...icons];

function App() {
  const [cards, setCards] = useState([]);

  const initializeGame = () => {
    const finalCards = cardValues.map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(finalCards);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <div className="app">
      <GameHeader score={2} moves={2} />

      <div className="cards-grid">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

export default App;
