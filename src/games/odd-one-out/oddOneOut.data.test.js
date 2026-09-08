import { describe, it, expect } from "vitest";
import { makeOddOneOutQuestion, GROUPS } from "./oddOneOut.data";
import { KID_ASSETS } from "../../assets/kids/manifest";

const ASSET_IDS = new Set(KID_ASSETS.map((a) => a.id));

// A cycling deterministic rng so the tests don't depend on Math.random.
function seededRng(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe("makeOddOneOutQuestion", () => {
  it("returns 4 options with exactly one correct", () => {
    for (let round = 1; round <= 20; round++) {
      const q = makeOddOneOutQuestion(round, seededRng(round));
      expect(q.options).toHaveLength(4);
      expect(q.options.filter((o) => o.correct)).toHaveLength(1);
      expect(q.options.every((o) => ASSET_IDS.has(o.pic))).toBe(true);
    }
  });

  it("the odd option comes from a different group than the other three", () => {
    for (let round = 1; round <= 20; round++) {
      const q = makeOddOneOutQuestion(round, seededRng(round * 7));
      const main = GROUPS.find((g) => g.id === q.groupId);
      const odd = q.options.find((o) => o.correct);
      const others = q.options.filter((o) => !o.correct);
      expect(q.oddGroupId).not.toBe(q.groupId);
      expect(others.every((o) => main.items.includes(o.pic))).toBe(true);
      expect(main.items.includes(odd.pic)).toBe(false);
    }
  });

  it("option ids are unique", () => {
    const q = makeOddOneOutQuestion(1, seededRng(3));
    const ids = q.options.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // ---- difficulty progression ----
  const nearOf = (id) => new Set(GROUPS.find((g) => g.id === id).near);

  it("early rounds pair FAR groups; later rounds prefer NEAR ones", () => {
    let earlyNear = 0;
    let lateNear = 0;
    for (let seed = 1; seed <= 120; seed++) {
      const early = makeOddOneOutQuestion(2, seededRng(seed));
      if (nearOf(early.groupId).has(early.oddGroupId)) earlyNear += 1;

      const late = makeOddOneOutQuestion(9, seededRng(seed));
      if (nearOf(late.groupId).has(late.oddGroupId)) lateNear += 1;
    }
    // rounds 1–3 must NEVER use a near group
    expect(earlyNear).toBe(0);
    // rounds 7+ lean on near groups whenever the main group has any
    expect(lateNear).toBeGreaterThan(earlyNear);
    expect(lateNear).toBeGreaterThan(40);
  });

  it("still yields a valid 4-option question at every round", () => {
    for (let round = 1; round <= 12; round++) {
      const q = makeOddOneOutQuestion(round, seededRng(round * 5));
      expect(q.options).toHaveLength(4);
      expect(q.options.filter((o) => o.correct)).toHaveLength(1);
      expect(q.oddGroupId).not.toBe(q.groupId);
    }
  });
});
