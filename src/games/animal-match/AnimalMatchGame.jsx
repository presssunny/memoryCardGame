import { MatchPairsGame } from "../shared/MatchPairsGame";
import { pickAnimalPairs } from "./animalMatch.data";

// Memory Match for the youngest players: a small board of animal emoji, no
// card-icon theme, big friendly cards. The shared MatchPairsGame supplies
// the board, best-score tracking and win screen; this just feeds it the
// animal pairs and the kid grid class. A fresh set is picked each time the
// game is opened, like every other matching game here.
export function AnimalMatchGame(props) {
  return (
    <MatchPairsGame
      {...props}
      title="🐾 Animal Match"
      buildPairs={pickAnimalPairs}
      face="emoji"
      gridClass="cards-grid--kids"
      winNote="🎉 You found every animal pair!"
    />
  );
}
