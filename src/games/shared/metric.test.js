import { describe, it, expect } from "vitest";
import {
  lowerIsBetter,
  bestChipLabel,
  isNewRecord,
  nearMissLine,
} from "./metric";

describe("metric — direction", () => {
  it("only moves and ms are lower-is-better", () => {
    expect(lowerIsBetter("moves")).toBe(true);
    expect(lowerIsBetter("ms")).toBe(true);
    for (const u of ["score", "streak", "rounds", "hits", "solved", "margin", "wpm", "רצף"]) {
      expect(lowerIsBetter(u)).toBe(false);
    }
  });
});

describe("metric — bestChipLabel", () => {
  it("gives a direction-signalling label per unit", () => {
    expect(bestChipLabel("moves")).toBe("Fewest moves");
    expect(bestChipLabel("ms")).toBe("Best time");
    expect(bestChipLabel("streak")).toBe("Best streak");
    expect(bestChipLabel("wpm")).toBe("Best WPM");
    expect(bestChipLabel("score")).toBe("Best score");
  });
  it("keeps the short Hebrew label", () => {
    expect(bestChipLabel("רצף", true)).toBe("שיא");
  });
  it("falls back to 'Best' for an unknown unit", () => {
    expect(bestChipLabel("bananas")).toBe("Best");
  });
});

describe("metric — isNewRecord (direction-aware)", () => {
  it("first result is always a record", () => {
    expect(isNewRecord(5, null, "score")).toBe(true);
    expect(isNewRecord(5, null, "moves")).toBe(true);
  });
  it("lower-is-better: equal or lower wins", () => {
    expect(isNewRecord(10, 12, "moves")).toBe(true);
    expect(isNewRecord(12, 12, "moves")).toBe(true);
    expect(isNewRecord(13, 12, "moves")).toBe(false);
  });
  it("higher-is-better: equal or higher wins (no backwards <=)", () => {
    expect(isNewRecord(25, 20, "score")).toBe(true);
    expect(isNewRecord(20, 20, "score")).toBe(true);
    expect(isNewRecord(18, 20, "score")).toBe(false);
  });
  it("a null value is never a record", () => {
    expect(isNewRecord(null, 20, "score")).toBe(false);
  });
});

describe("metric — nearMissLine", () => {
  it("returns null without a previous best or value", () => {
    expect(nearMissLine({ value: 10, best: null, bestUnit: "score" })).toBeNull();
    expect(nearMissLine({ value: null, best: 10, bestUnit: "score" })).toBeNull();
  });
  it("returns null on a record or a tie", () => {
    expect(nearMissLine({ value: 8, best: 10, bestUnit: "moves" })).toBeNull(); // beat
    expect(nearMissLine({ value: 25, best: 20, bestUnit: "score" })).toBeNull(); // beat
    expect(nearMissLine({ value: 10, best: 10, bestUnit: "moves" })).toBeNull(); // tie
  });
  it("returns null when the run is not close (>15% of best, min 1)", () => {
    expect(nearMissLine({ value: 40, best: 11, bestUnit: "moves" })).toBeNull();
    expect(nearMissLine({ value: 5, best: 20, bestUnit: "streak" })).toBeNull();
  });
  it("lower-is-better: '<gap> moves over your best'", () => {
    expect(nearMissLine({ value: 13, best: 11, bestUnit: "moves" })).toMatch(
      /2 moves over your best \(11\)/,
    );
    expect(nearMissLine({ value: 12, best: 11, bestUnit: "moves" })).toMatch(
      /1 move over your best \(11\)/,
    );
  });
  it("lower-is-better ms keeps the ms unit", () => {
    expect(nearMissLine({ value: 320, best: 300, bestUnit: "ms" })).toMatch(
      /20 ms over your best \(300\)/,
    );
  });
  it("never nudges a zero score, even when the recorded best is tiny", () => {
    // growing-sequence games record best 1 on a first-round loss; scoring 0
    // the next run is not a near miss
    expect(nearMissLine({ value: 0, best: 1, bestUnit: "rounds" })).toBeNull();
    expect(nearMissLine({ value: 1, best: 2, bestUnit: "rounds" })).toMatch(
      /1 away from your best \(2\)/,
    );
  });
  it("higher-is-better: '<gap> away from your best'", () => {
    expect(nearMissLine({ value: 18, best: 20, bestUnit: "streak" })).toMatch(
      /2 away from your best \(20\)/,
    );
    expect(nearMissLine({ value: 19, best: 20, bestUnit: "streak" })).toMatch(
      /1 away from your best \(20\)/,
    );
  });
});
