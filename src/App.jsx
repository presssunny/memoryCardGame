import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HomePage } from "./components/home/HomePage";
import { GamesIndexPage } from "./components/home/GamesIndexPage";
import { CategoryPage } from "./components/home/CategoryPage";
import { SubCategoryPage } from "./components/home/SubCategoryPage";
import { NotFoundPage } from "./components/home/NotFoundPage";
import { GameHost } from "./routing/GameHost";
import { isHebrewContext, pageTitle, resolveGamesPath } from "./routing/paths";
import { useDocumentTitle } from "./routing/useDocumentTitle";
import { GAMES } from "./games";
import { useTheme } from "./hooks/useTheme";
import { useBestScores } from "./hooks/useBestScores";

// The whole games area lives under one `/games/*` route. Path depth is
// variable (a Kids game has an extra `group` segment), so a single splat
// route resolves the pathname against the registry rather than enumerating
// 34 <Route>s — see src/routing/paths.js for the resolver and its tests.
function GamesArea({ theme, bestScores }) {
  const { pathname } = useLocation();
  const resolved = resolveGamesPath(pathname);
  const locale = isHebrewContext(resolved) ? "he" : "en";
  useDocumentTitle(pageTitle(resolved, locale));

  switch (resolved.type) {
    case "index":
      return <GamesIndexPage />;
    case "category":
      return (
        <CategoryPage categoryId={resolved.category.id} bestScores={bestScores} />
      );
    case "group":
      return (
        <SubCategoryPage
          categoryId={resolved.category.id}
          groupId={resolved.group.id}
        />
      );
    case "subgroup":
      return (
        <SubCategoryPage
          categoryId={resolved.category.id}
          groupId={resolved.group.id}
          subgroupId={resolved.subgroup.id}
        />
      );
    case "game":
      return (
        <GameHost resolved={resolved} theme={theme} bestScores={bestScores} />
      );
    case "redirect":
      return <Navigate to={resolved.to} replace />;
    default:
      return <NotFoundPage />;
  }
}

// Per-route side effects, in one place so there's a single owner:
//   • React Router (non-data mode) keeps the window scroll position across
//     route changes — a game opened from halfway down a long category page
//     would appear scrolled past its own header. Reset to the top.
//   • Keep <html lang/dir> in step with the content: the Ready-for-School
//     subtree is Hebrew / RTL, everything else English / LTR. Screen readers
//     pick the right voice from `lang`; `dir` fixes RTL edge cases (scrollbar
//     side, form controls) the inner `dir="rtl"` wrappers don't reach.
function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const resolved = pathname.startsWith("/games/")
      ? resolveGamesPath(pathname)
      : null;
    const hebrew = resolved ? isHebrewContext(resolved) : false;
    const el = document.documentElement;
    el.lang = hebrew ? "he" : "en";
    el.dir = hebrew ? "rtl" : "ltr";
  }, [pathname]);
  return null;
}

function App() {
  const theme = useTheme();
  const bestScores = useBestScores();

  return (
    <>
      <RouteEffects />
      <Routes>
        <Route
          path="/"
          element={<HomePage games={GAMES} bestScores={bestScores} />}
        />
        <Route
          path="/games/*"
          element={<GamesArea theme={theme} bestScores={bestScores} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
