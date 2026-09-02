// Downloads the Twemoji (jdecked/twemoji, CC-BY 4.0) SVG for every concept in
// the kids asset manifest into src/assets/kids/pics/<codepoint>.svg.
//
//   node scripts/fetch-kids-assets.mjs
//
// Re-run any time the manifest grows; existing files are overwritten so a
// pack update is a one-command refresh. The license + attribution live in
// src/assets/kids/README.md.
import { mkdir, writeFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { KID_ASSETS, codepointOf } from "../src/assets/kids/manifest.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const PICS = join(HERE, "..", "src", "assets", "kids", "pics");
const REV = "b6b55fef1e8636b540a6d016a4729ca8cdf2e60b"; // jdecked/twemoji v17.0.3
const BASE = `https://raw.githubusercontent.com/jdecked/twemoji/${REV}/assets/svg`;

async function main() {
  await mkdir(PICS, { recursive: true });
  const wanted = new Set(KID_ASSETS.map((a) => codepointOf(a.emoji)));
  let ok = 0;
  const missing = [];

  for (const cp of wanted) {
    const res = await fetch(`${BASE}/${cp}.svg`);
    if (!res.ok) {
      missing.push(cp);
      continue;
    }
    const svg = await res.text();
    await writeFile(join(PICS, `${cp}.svg`), svg, "utf8");
    ok += 1;
  }

  const onDisk = (await readdir(PICS)).filter((f) => f.endsWith(".svg"));
  console.log(`downloaded ${ok}/${wanted.size} · ${onDisk.length} svg on disk`);
  if (missing.length) {
    console.error("MISSING:", missing.join(", "));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
