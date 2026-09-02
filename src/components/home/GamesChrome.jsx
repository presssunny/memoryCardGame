import { Link } from "react-router-dom";
import "./home.css";
import { SiteHeader } from "./SiteHeader";
import { Breadcrumbs } from "./Breadcrumbs";
import { useArcadeMode } from "./useArcadeMode";

// Shared shell for every non-home screen in the games area (index / category /
// sub-section / 404). Keeps the light-mode toggle, the header, the back pill
// (`.catpage-back`, the class the e2e suite clicks) and the breadcrumb trail
// in one place so the pages themselves are just their grid + heading.
export function GamesChrome({
  backTo,
  backLabel = "← Back",
  trail,
  hebrew = false,
  extraClass = "",
  children,
}) {
  const { isLight, toggleMode } = useArcadeMode();

  return (
    <div className={`home-page catpage${isLight ? " is-light" : ""} ${extraClass}`}>
      <SiteHeader isLight={isLight} onToggleTheme={toggleMode} />
      <main className="hp-main" dir={hebrew ? "rtl" : "ltr"}>
        {backTo && (
          <Link to={backTo} className="catpage-back">
            {backLabel}
          </Link>
        )}
        {trail && <Breadcrumbs trail={trail} hebrew={hebrew} />}
        {children}
      </main>
    </div>
  );
}
