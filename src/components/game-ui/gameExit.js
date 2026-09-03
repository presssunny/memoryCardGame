import { createContext, useContext } from "react";

// The "leave this game" action, provided once by GameHost for the whole game
// subtree. It lets the shared result screen always offer a "Back to Games"
// button without every game having to remember to thread an `onExit` prop
// down to <WinMessage> / <LoseMessage>. A game may still pass an explicit
// `onExit` to override (or when rendered outside a GameHost, e.g. in tests).
export const GameExitContext = createContext(null);

export const useGameExit = () => useContext(GameExitContext);
