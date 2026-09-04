import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { StatsBar } from "./StatsBar";

const games = [{ id: "memory-match" }, { id: "snake" }];
const bestScores = { getBestOverall: () => null };

// L7: <dd> (value) rendered before <dt> (label) inside each <dl> item is
// invalid <dl> ordering — a screen reader announces the value before what
// it's a value of. The DOM must carry <dt> first; the CSS compensates so
// the value still shows above the label visually (see home.css).
describe("StatsBar: <dl> term/description order (L7)", () => {
  it("puts <dt> before <dd> in every stat", () => {
    const { container } = render(
      <StatsBar games={games} bestScores={bestScores} />,
    );
    const items = container.querySelectorAll(".hp-stat-text");
    expect(items.length).toBeGreaterThan(0);
    items.forEach((item) => {
      const dt = item.querySelector("dt");
      const dd = item.querySelector("dd");
      expect(dt).toBeTruthy();
      expect(dd).toBeTruthy();
      // bitwise 4 = Node.DOCUMENT_POSITION_FOLLOWING: dd comes after dt.
      expect(dt.compareDocumentPosition(dd) & 4).toBeTruthy();
    });
  });
});
