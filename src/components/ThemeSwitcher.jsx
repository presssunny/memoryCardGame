export function ThemeSwitcher({ allThemes, activeThemeId, onThemeChange }) {
  return (
    <div className="theme-switcher" role="group" aria-label="Choose card theme">
      {allThemes.map((theme) => (
        <button
          key={theme.id}
          className={`theme-btn theme-btn--${theme.id}${theme.id === activeThemeId ? " theme-btn--active" : ""}`}
          onClick={() => onThemeChange(theme.id)}
          aria-pressed={theme.id === activeThemeId}
        >
          {theme.label}
        </button>
      ))}
    </div>
  );
}
