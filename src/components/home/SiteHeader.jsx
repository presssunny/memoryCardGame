import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "./homeData";

function GamepadMark() {
  return (
    <svg viewBox="0 0 48 48" className="hp-logo-mark" aria-hidden="true">
      <defs>
        <linearGradient id="hp-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b8cff" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <path
        fill="url(#hp-logo-grad)"
        d="M16 12h16a12 12 0 0 1 11.9 10.5l1.7 13.6A6.4 6.4 0 0 1 34 41.3l-3.2-4.8a4 4 0 0 0-3.3-1.8h-6.9a4 4 0 0 0-3.3 1.8L14 41.3a6.4 6.4 0 0 1-11.3-5.2l1.7-13.6A12 12 0 0 1 16 12Z"
      />
      <circle cx="18" cy="24" r="2.4" fill="#0b1022" />
      <path
        d="M16 20v8M12 24h8"
        stroke="#0b1022"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="30" cy="21" r="2.2" fill="#0b1022" />
      <circle cx="34" cy="26" r="2.2" fill="#0b1022" />
    </svg>
  );
}

// The site header is now fully route-driven: the logo and nav links are real
// `<Link>`s, and the active state is derived from the current pathname.
export function SiteHeader({ isLight, onToggleTheme }) {
  const { pathname } = useLocation();

  const isActive = (link) =>
    link.match === "exact"
      ? pathname === link.to
      : pathname === link.to || pathname.startsWith(`${link.to}/`);

  return (
    <header className="hp-header">
      <div className="hp-header-inner">
        <Link className="hp-logo" to="/">
          <GamepadMark />
          Game Arcade
        </Link>

        <nav className="hp-nav" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = isActive(link);
            return (
              <Link
                key={link.id}
                className={`hp-nav-link${active ? " is-active" : ""}`}
                to={link.to}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hp-header-actions">
          <button
            type="button"
            className="hp-theme-toggle"
            role="switch"
            aria-checked={isLight}
            aria-label="Toggle light mode"
            onClick={onToggleTheme}
          >
            <span className="hp-theme-toggle-track">
              <span className="hp-theme-toggle-thumb">{isLight ? "☀️" : "🌙"}</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
