// The single source of truth for the app's URL structure. Every path in the
// games area is *derived* from the games registry + the category/group data
// in home/homeData.js — there are no hand-written route strings anywhere else.
//
// Path shapes:
//   /                                              home
//   /games                                         all categories
//   /games/<category>                              one category
//   /games/<category>/<group>                      one sub-section (kids only)
//   /games/<category>/<group?>/<game>              one game
//
// A game's `group` segment is present iff its registry entry has a `group`
// (today: only Kids games). Everything else is flat.

import { GAMES } from "../games";
import { CATEGORIES, CATEGORY_GROUPS, getCategory } from "../components/home/homeData";

export const GAMES_ROOT = "/games";

// Labels for the breadcrumb / back trail, per locale. The Ready for School
// subtree is presented in Hebrew, so its trail needs Hebrew words too.
const ROOT_LABEL = { en: "Games", he: "משחקים" };
const CATEGORY_LABEL_HE = {
  kids: "ילדים",
  "brain-training": "אימון מוח",
  arcade: "ארקייד",
  "for-developers": "למפתחים",
};

/** The group metadata object for a category/group pair, or null. */
export function getGroup(categoryId, groupId) {
  return (CATEGORY_GROUPS[categoryId] ?? []).find((g) => g.id === groupId) ?? null;
}

/** URL path for a category page. */
export function categoryPath(categoryId) {
  return `${GAMES_ROOT}/${categoryId}`;
}

/** URL path for a sub-section page. */
export function groupPath(categoryId, groupId) {
  return `${GAMES_ROOT}/${categoryId}/${groupId}`;
}

/** URL path for a game, derived from its registry entry. */
export function gamePath(game) {
  return [GAMES_ROOT, game.category, game.group, game.id]
    .filter(Boolean)
    .join("/");
}

/** Split a pathname into its games-area segments (drops a leading "games"). */
function segmentsOf(pathname) {
  const parts = String(pathname || "")
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);
  return parts[0] === "games" ? parts.slice(1) : parts;
}

// Resolve a pathname under /games into one of:
//   { type: "index" }
//   { type: "category", category }
//   { type: "group", category, group }
//   { type: "game", game, category, group|null }
//   { type: "notfound" }
export function resolveGamesPath(pathname) {
  const segs = segmentsOf(pathname);
  if (segs.length === 0) return { type: "index" };

  const [categoryId, ...rest] = segs;
  const category = getCategory(categoryId);
  if (!category) return { type: "notfound" };
  if (rest.length === 0) return { type: "category", category };
  if (rest.length > 2) return { type: "notfound" };

  // Is the final segment a game in this category?
  const last = rest[rest.length - 1];
  const game = GAMES.find((g) => g.id === last && g.category === categoryId);
  if (game) {
    const middle = rest.slice(0, -1).join("/");
    const expected = game.group ?? "";
    if (middle !== expected) return { type: "notfound" }; // wrong group segment
    const group = game.group ? getGroup(categoryId, game.group) : null;
    return { type: "game", game, category, group };
  }

  // Otherwise the only valid 2-segment shape is a sub-section page.
  if (rest.length === 1) {
    const group = getGroup(categoryId, rest[0]);
    if (group) return { type: "group", category, group };
  }
  return { type: "notfound" };
}

/** Where the in-game / in-page "back" control should go, given a resolution. */
export function parentPath(resolved) {
  switch (resolved.type) {
    case "game":
      return resolved.group
        ? groupPath(resolved.category.id, resolved.group.id)
        : categoryPath(resolved.category.id);
    case "group":
      return categoryPath(resolved.category.id);
    case "category":
      return GAMES_ROOT;
    default:
      return "/";
  }
}

// Whether a resolution's subtree is presented in Hebrew (RTL). Today that's
// any Ready-for-School content and any Hebrew-flagged game.
export function isHebrewContext(resolved) {
  if (resolved.type === "game") return !!resolved.game.hebrew;
  if (resolved.type === "group") return resolved.group.id === "ready-for-school";
  return false;
}

function categoryLabel(category, locale) {
  return locale === "he"
    ? CATEGORY_LABEL_HE[category.id] ?? category.title
    : category.title;
}

// Build the breadcrumb trail for a resolution. Returns `{ label, to }[]`,
// oldest first, with `to: null` on the final (current) crumb. `locale` is
// "he" for the Ready for School subtree, "en" otherwise.
export function breadcrumbs(resolved, locale = "en") {
  const trail = [{ label: ROOT_LABEL[locale] ?? ROOT_LABEL.en, to: GAMES_ROOT }];

  if (resolved.type === "index") {
    trail[trail.length - 1].to = null;
    return trail;
  }
  if (resolved.type === "notfound") return trail;

  const { category } = resolved;
  trail.push({ label: categoryLabel(category, locale), to: categoryPath(category.id) });

  if (resolved.type === "category") {
    trail[trail.length - 1].to = null;
    return trail;
  }

  const group = resolved.group;
  if (group) {
    trail.push({ label: group.label, to: groupPath(category.id, group.id) });
  }

  if (resolved.type === "group") {
    trail[trail.length - 1].to = null;
    return trail;
  }

  // game
  trail.push({ label: resolved.game.label, to: null });
  return trail;
}

// The document title for a resolution — "<where> · Game Arcade", so the
// browser tab and history always name the current screen. Kept here so the
// title is derived from the same registry data as the URL and never drifts.
export const SITE_TITLE = "Game Arcade";

export function pageTitle(resolved, locale = "en") {
  const suffix = ` · ${SITE_TITLE}`;
  switch (resolved.type) {
    case "index":
      return `${ROOT_LABEL[locale] ?? ROOT_LABEL.en}${suffix}`;
    case "category":
      return `${categoryLabel(resolved.category, locale)}${suffix}`;
    case "group":
      return `${resolved.group.label}${suffix}`;
    case "game":
      return `${resolved.game.label}${suffix}`;
    case "notfound":
      return `${locale === "he" ? "הדף לא נמצא" : "Page not found"}${suffix}`;
    default:
      return SITE_TITLE;
  }
}

/** Every canonical path in the app — used by tests to prove full coverage. */
export function allPaths() {
  const categories = CATEGORIES.map((c) => categoryPath(c.id));
  const groups = Object.entries(CATEGORY_GROUPS).flatMap(([cat, list]) =>
    list.map((g) => groupPath(cat, g.id)),
  );
  const games = GAMES.map(gamePath);
  return { root: GAMES_ROOT, categories, groups, games };
}
