import { useState, useCallback } from "react";
import { THEMES, DEFAULT_THEME_ID } from "../themes/index.js";

const STORAGE_KEY = "memory-game-theme";

function getInitialThemeId() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && THEMES.some((t) => t.id === saved)) return saved;
  } catch (_) {
    // localStorage blocked (e.g. private browsing) — fall through to default
  }
  return DEFAULT_THEME_ID;
}

export function useTheme() {
  const [themeId, setThemeId] = useState(getInitialThemeId);

  const activeTheme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
  const cardValues = [...activeTheme.icons, ...activeTheme.icons];

  const changeTheme = useCallback((newId) => {
    try {
      localStorage.setItem(STORAGE_KEY, newId);
    } catch (_) {
      // ignore write failure
    }
    setThemeId(newId);
  }, []);

  return { activeTheme, cardValues, changeTheme, allThemes: THEMES };
}
