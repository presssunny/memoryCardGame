import { useEffect } from "react";

// Sets document.title while the calling component is mounted. Every
// top-level page (HomePage, GamesArea, NotFoundPage) calls this with its own
// title, and exactly one of them is ever mounted at a time — so there's
// nothing to "restore" on unmount: whichever page mounts next always sets
// its own title immediately. (An earlier version restored a captured
// previous title instead — that made the correct value depend on the exact
// order cleanup/setup ran in across sibling route components, and could
// leave a stale "<Game> · Game Arcade" title behind. See L11.)
export function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) return;
    document.title = title;
  }, [title]);
}
