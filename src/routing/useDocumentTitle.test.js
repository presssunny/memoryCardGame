import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDocumentTitle } from "./useDocumentTitle";

// L11: the old version restored a captured "previous" title on unmount,
// which — depending on the exact order sibling route components' effects
// ran in — could leave a stale "<Game> · Game Arcade" title behind on the
// way to Home. There's nothing to restore: whichever page mounts next
// always sets its own title right away.
describe("useDocumentTitle (L11)", () => {
  it("sets the title on mount and does not restore a stale one on unmount", () => {
    document.title = "Game Arcade";
    const game = renderHook(() => useDocumentTitle("🐍 Snake · Game Arcade"));
    expect(document.title).toBe("🐍 Snake · Game Arcade");

    game.unmount();
    // No restore-to-"prev" — the title is left as-is until the next page
    // (which always calls this hook itself) sets its own.
    expect(document.title).toBe("🐍 Snake · Game Arcade");

    const home = renderHook(() =>
      useDocumentTitle("Game Arcade · Play, challenge, win"),
    );
    expect(document.title).toBe("Game Arcade · Play, challenge, win");
    home.unmount();
  });

  it("updates the title when the prop changes, no unmount needed", () => {
    const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: "🐍 Snake · Game Arcade" },
    });
    expect(document.title).toBe("🐍 Snake · Game Arcade");

    rerender({ title: "🏓 Pong · Game Arcade" });
    expect(document.title).toBe("🏓 Pong · Game Arcade");
  });

  it("ignores a falsy title", () => {
    document.title = "Game Arcade";
    const { unmount } = renderHook(() => useDocumentTitle(""));
    expect(document.title).toBe("Game Arcade");
    unmount();
    expect(document.title).toBe("Game Arcade");
  });
});
