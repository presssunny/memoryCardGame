import { shuffle } from "../../utils/random";

// Asymmetric pair sets for the matching games: each pair is one concept
// shown two ways (command ↔ what it does). useMatchingBoard matches on
// `value`, so both cards of a pair share it while their `face` differs.

export const GIT_COMMANDS = [
  ["git status", "Show the working tree status"],
  ["git clone", "Copy a repository to your machine"],
  ["git add", "Stage changes for the next commit"],
  ["git commit", "Record staged changes to history"],
  ["git push", "Send local commits to the remote"],
  ["git pull", "Fetch and merge from the remote"],
  ["git branch", "List, create or delete branches"],
  ["git merge", "Join another branch into this one"],
  ["git rebase", "Replay commits onto a new base"],
  ["git stash", "Shelve changes to return to later"],
  ["git log", "Show the commit history"],
  ["git reset", "Move HEAD and optionally the index"],
];

export const HTTP_STATUS = [
  ["200", "OK"],
  ["201", "Created"],
  ["204", "No Content"],
  ["301", "Moved Permanently"],
  ["304", "Not Modified"],
  ["400", "Bad Request"],
  ["401", "Unauthorized"],
  ["403", "Forbidden"],
  ["404", "Not Found"],
  ["429", "Too Many Requests"],
  ["500", "Internal Server Error"],
  ["503", "Service Unavailable"],
];

export const TERMINAL_COMMANDS = [
  "ls", "cd", "pwd", "cat", "grep", "mkdir", "rm", "cp",
  "mv", "chmod", "curl", "ps", "kill", "df", "top", "echo",
];

// Builds the pair set for MatchPairsGame from N random concept pairs.
export function buildConceptPairs(source, count, rng = Math.random) {
  const chosen = shuffle(source, rng).slice(0, count);
  return chosen.flatMap(([key, meaning], i) => {
    const value = `p${i}`;
    return [
      { value, face: key, faceLabel: key },
      { value, face: meaning, faceLabel: meaning },
    ];
  });
}
