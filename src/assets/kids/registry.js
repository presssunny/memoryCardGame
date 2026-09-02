// Joins the manifest rows to the actual SVG files on disk. One `import.meta.glob`
// pulls every picture in ./pics as a URL, so adding an asset is: add a manifest
// row + run scripts/fetch-kids-assets.mjs — nothing here changes.
import { KID_ASSETS, codepointOf } from "./manifest.js";

const URLS = import.meta.glob("./pics/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

function urlFor(emoji) {
  return URLS[`./pics/${codepointOf(emoji)}.svg`];
}

// id -> { id, src, alt (en), he, en, letter, cat }
const PICS = new Map(
  KID_ASSETS.map((a) => [
    a.id,
    { ...a, src: urlFor(a.emoji), alt: a.en },
  ]),
);

// Fail loudly in dev if a manifest row has no downloaded file.
if (import.meta.env?.DEV) {
  for (const [id, p] of PICS) {
    if (!p.src) {
      console.error(`kids asset "${id}" has no SVG — run scripts/fetch-kids-assets.mjs`);
    }
  }
}

/** The full picture record for an id: { id, src, he, en, letter, cat, alt }. */
export function pic(id) {
  return PICS.get(id) ?? null;
}

/** Just the image URL for an id. */
export function picSrc(id) {
  return PICS.get(id)?.src ?? "";
}

/** Every picture record in a category. */
export function picsInCategory(cat) {
  return [...PICS.values()].filter((p) => p.cat === cat);
}

export { KID_ASSETS, LETTER_PICTURES } from "./manifest.js";
