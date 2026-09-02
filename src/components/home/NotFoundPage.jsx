import { GamesChrome } from "./GamesChrome";
import { useDocumentTitle } from "../../routing/useDocumentTitle";
import { SITE_TITLE } from "../../routing/paths";

// Rendered for any URL that doesn't resolve to a real screen — a mistyped
// game slug, a dead link. Styled like the rest of the arcade, with a clear
// way back to the games index.
export function NotFoundPage() {
  useDocumentTitle(`Page not found · ${SITE_TITLE}`);
  return (
    <GamesChrome backTo="/games" backLabel="← Games">
      <div className="catpage-empty catpage-404">
        <span className="catpage-empty-icon" aria-hidden="true">
          🕹️
        </span>
        <h1 className="catpage-title">Page not found</h1>
        <p>
          That link doesn&rsquo;t point to a game we have. It may have been
          renamed or mistyped.
        </p>
      </div>
    </GamesChrome>
  );
}
