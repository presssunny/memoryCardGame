import { useCallback } from "react";
import { MatchPairsGame } from "../shared/MatchPairsGame";
import { GIT_COMMANDS, buildConceptPairs } from "./devMatch.data";

export function GitCommandMatchGame(props) {
  const buildPairs = useCallback(() => buildConceptPairs(GIT_COMMANDS, 6), []);
  return (
    <MatchPairsGame
      {...props}
      title="🔀 Git Command Match"
      buildPairs={buildPairs}
      face="text"
      gridClass="cards-grid--text"
      winNote="You matched every git command!"
    />
  );
}
