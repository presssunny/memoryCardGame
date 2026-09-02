import { useEffect } from "react";

// Sets document.title while the calling component is mounted and restores
// the previous title on unmount. One call site owns the title at a time —
// GamesArea drives it for every games-area screen (see App.jsx) so a stale
// "<Game> · Game Arcade" can't linger after you leave a game.
export function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) return undefined;
    const prev = document.title;
    document.title = title;
    return () => {
      document.title = prev;
    };
  }, [title]);
}
