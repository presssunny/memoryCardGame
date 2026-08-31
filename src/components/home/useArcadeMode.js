import { useCallback, useEffect, useState } from "react";

const MODE_KEY = "arcade-home-mode";

function getInitialLight() {
  try {
    return localStorage.getItem(MODE_KEY) === "light";
  } catch {
    return false;
  }
}

// Light/dark mode for the arcade chrome (home + category pages), separate from
// the in-game card-icon themes. Lifted out of HomePage so the category pages
// share the same toggle state and persistence.
export function useArcadeMode() {
  const [isLight, setIsLight] = useState(getInitialLight);

  useEffect(() => {
    try {
      localStorage.setItem(MODE_KEY, isLight ? "light" : "dark");
    } catch {
      // localStorage unavailable — mode just won't persist
    }
  }, [isLight]);

  const toggleMode = useCallback(() => setIsLight((v) => !v), []);

  return { isLight, toggleMode };
}
