# Kids picture assets

Every picture used by the Kids games (Letter & Picture, Which Doesn't Belong,
Count & Choose, Shapes & Colors, What Comes Next, Odd One Out, Animal Match,
Follow Instructions) comes from **one** set, so the games share a single,
consistent graphic language.

## Source & license

| | |
|---|---|
| Pack | **Twemoji** — <https://github.com/jdecked/twemoji> |
| Version | v17.0.3 (commit `b6b55fef1e8636b540a6d016a4729ca8cdf2e60b`) |
| Graphics license | **CC-BY 4.0** — <https://creativecommons.org/licenses/by/4.0/> |
| Copyright | © Twitter, Inc and other contributors |

Twemoji graphics are licensed under CC-BY 4.0. The project explicitly accepts
attribution "in a project README or an 'About' section or footer" — this file,
plus the in-app credit on the About/footer, satisfies that.

> Twemoji is © Twitter, Inc and other contributors, licensed under CC-BY 4.0.

Only the `assets/svg/*.svg` files from that pack are used, unmodified. The Twemoji
**code** (MIT) is not used.

### Why Twemoji and not Kenney

The brief preferred Kenney (CC0). Kenney's packs are platformer tiles, UI kits
and isometric 3-D props — there is no "a clean picture of a lion / an apple / a
bus" set in the Kenney catalogue that fits a literacy game. Twemoji is a single
coherently-drawn set that covers every concept these games need, is clearly
licensed (CC-BY 4.0, attribution only — no share-alike obligation), and is a
real step up from raw platform emoji, which render differently on every OS.
No images were taken from image search or any un-vetted source.

## Layout

```
manifest.js   one row per concept: id, source emoji, en/he label, letter, category
pics/*.svg    the SVG files, named by Twemoji codepoint (fetched, not hand-edited)
registry.js   joins the manifest to the files (import.meta.glob) → pic(id) / picSrc(id)
```

`../../components/game-ui/Pic.jsx` is the render component:
`<Pic id="lion" hebrew />`.

## Updating the pack

1. Edit `manifest.js` (add/adjust rows).
2. `node scripts/fetch-kids-assets.mjs` — re-downloads every SVG named by the
   manifest into `pics/`.
3. Bump the version + commit in this file and in the fetch script if you moved
   to a newer Twemoji tag.
