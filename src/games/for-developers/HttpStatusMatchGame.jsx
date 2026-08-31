import { useCallback } from "react";
import { MatchPairsGame } from "../shared/MatchPairsGame";
import { HTTP_STATUS, buildConceptPairs } from "./devMatch.data";

export function HttpStatusMatchGame(props) {
  const buildPairs = useCallback(() => buildConceptPairs(HTTP_STATUS, 6), []);
  return (
    <MatchPairsGame
      {...props}
      title="🌐 HTTP Status Match"
      buildPairs={buildPairs}
      face="text"
      gridClass="cards-grid--text"
      winNote="Every status code matched!"
    />
  );
}
