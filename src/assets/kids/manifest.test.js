import { describe, it, expect } from "vitest";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { KID_ASSETS, codepointOf, asset, assetIds, LETTER_PICTURES } from "./manifest";

const PICS = join(dirname(fileURLToPath(import.meta.url)), "pics");
const ON_DISK = new Set(readdirSync(PICS).filter((f) => f.endsWith(".svg")));

describe("kids asset manifest", () => {
  it("every row has a unique id and the required fields", () => {
    const ids = KID_ASSETS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const a of KID_ASSETS) {
      expect(a.emoji).toBeTruthy();
      expect(a.en).toBeTruthy();
      expect(a.he).toBeTruthy();
      expect(a.cat).toBeTruthy();
    }
  });

  it("every row's picture is downloaded into ./pics", () => {
    for (const a of KID_ASSETS) {
      expect(ON_DISK.has(`${codepointOf(a.emoji)}.svg`)).toBe(true);
    }
  });

  it("covers all 22 Hebrew letters exactly once", () => {
    const letters = LETTER_PICTURES.map((a) => a.letter);
    expect(letters).toHaveLength(22);
    expect(new Set(letters).size).toBe(22);
  });

  it("asset() and assetIds() resolve", () => {
    expect(asset("lion").he).toBe("אריה");
    expect(assetIds("animals").length).toBeGreaterThan(5);
    expect(asset("not-a-real-id")).toBeFalsy();
  });
});
