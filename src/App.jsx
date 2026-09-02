import { Routes, Route, useLocation } from "react-router-dom";
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
    case "game":
      return (
        <GameHost resolved={resolved} theme={theme} bestScores={bestScores} />
      );
    default:
      return <NotFoundPage />;
  }
}

function App() {
  const theme = useTheme();
  const bestScores = useBestScores();

  return (
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
  );
}

export default App;
