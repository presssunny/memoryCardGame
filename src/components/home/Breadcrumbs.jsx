import { Link } from "react-router-dom";

// A small, non-intrusive trail: "Games / Kids / Ready for School / First Math".
// `trail` is the `{ label, to }[]` from routing/paths.js#breadcrumbs — the
// last crumb has `to: null` and renders as plain text (the current page).
export function Breadcrumbs({ trail, hebrew = false }) {
  if (!trail || trail.length < 2) return null;
  return (
    <nav
      className="hp-crumbs"
      aria-label={hebrew ? "מיקום" : "Breadcrumb"}
      dir={hebrew ? "rtl" : "ltr"}
    >
      <ol>
        {trail.map((crumb, i) => (
          <li key={`${crumb.label}-${i}`}>
            {crumb.to ? (
              <Link to={crumb.to}>{crumb.label}</Link>
            ) : (
              <span aria-current="page">{crumb.label}</span>
            )}
            {i < trail.length - 1 && (
              <span className="hp-crumbs-sep" aria-hidden="true">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
