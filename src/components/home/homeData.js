// Static content for the home page and the category pages. Kept in a plain
// module (no component exports) so it stays out of the games registry and is
// easy to extend as real categories/games get built.

export const NAV_LINKS = [
  { id: "home", label: "Home", type: "current" },
  { id: "games", label: "Games", type: "anchor", href: "#games" },
  { id: "categories", label: "Categories", type: "anchor", href: "#categories" },
];

// The four Browse Categories buckets. `id` matches a game's `category` in the
// registry; `accent` maps to a --hp-* colour in home.css.
export const CATEGORIES = [
  {
    id: "kids",
    accent: "teal",
    icon: "🧒",
    title: "Kids",
    description: "Fun & safe games for kids to learn and play",
  },
  {
    id: "brain-training",
    accent: "violet",
    icon: "🧠",
    title: "Brain Training",
    description: "Boost memory, focus and problem-solving skills",
  },
  {
    id: "arcade",
    accent: "amber",
    icon: "🏆",
    title: "Arcade",
    description: "Classic and modern arcade games for everyone",
  },
  {
    id: "for-developers",
    accent: "blue",
    icon: "⌨️",
    title: "For Developers",
    description: "Games and tools for devs to relax and sharpen skills",
  },
];

export function getCategory(categoryId) {
  return CATEGORIES.find((cat) => cat.id === categoryId) ?? null;
}

// Sub-sections inside a category, in display order. A category with no entry
// here just lists its games in one flat grid. `group` on a game entry in the
// registry selects which section it falls under; games with no `group` (or a
// group not listed here) land in a trailing "More" section.
export const CATEGORY_GROUPS = {
  kids: [
    { id: "fun", label: "Fun Games", icon: "🎈" },
    { id: "ready-for-school", label: "Ready for School", icon: "🎒" },
  ],
};

// Splits a category's games into its declared sub-sections (CATEGORY_GROUPS),
// in order, dropping empty ones. Any game whose `group` isn't a declared
// section falls into a trailing section so nothing is ever hidden. A category
// with no declared groups gets a single unlabelled section.
export function buildCategorySections(categoryId, games) {
  const declared = CATEGORY_GROUPS[categoryId] ?? [];
  const sections = declared
    .map((group) => ({
      ...group,
      games: games.filter((game) => game.group === group.id),
    }))
    .filter((section) => section.games.length > 0);

  const grouped = new Set(sections.flatMap((section) => section.games));
  const rest = games.filter((game) => !grouped.has(game));
  if (rest.length > 0) {
    sections.push({
      id: "more",
      label: declared.length > 0 ? "More games" : null,
      icon: null,
      games: rest,
    });
  }
  return sections;
}

// The curated shelf on the home page — a hand-picked subset spanning the
// categories, not every game. Browse Categories is the full path.
export const FEATURED_IDS = [
  "memory-match",
  "snake",
  "2048",
  "typing-test",
  "stroop-test",
  "reaction-time",
  "animal-match",
  "git-command-match",
];

// Short marketing taglines + "new" flags for the featured strip, keyed by the
// games-registry id. Falls back to the registry description for any game not
// listed here.
export const FEATURED_META = {
  "memory-match": { tagline: "Find all pairs" },
  snake: { tagline: "Eat, grow, don't crash", isNew: true },
  "2048": { tagline: "Slide and merge to 2048", isNew: true },
  "typing-test": { tagline: "Code, timed", isNew: true },
  "stroop-test": { tagline: "Name the ink, not the word", isNew: true },
  "reaction-time": { tagline: "How fast can you tap?", isNew: true },
  "animal-match": { tagline: "A memory game for kids", isNew: true },
  "git-command-match": { tagline: "git command ↔ what it does", isNew: true },
};
