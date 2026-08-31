// Static content for the home page. Kept in a plain module (no component
// exports) so it stays out of the games registry and is easy to extend
// as real categories/games get built.

export const NAV_LINKS = [
  { id: "home", label: "Home", type: "current" },
  { id: "games", label: "Games", type: "anchor", href: "#games" },
  { id: "categories", label: "Categories", type: "anchor", href: "#categories" },
  { id: "leaderboard", label: "Leaderboard", type: "soon" },
  { id: "achievements", label: "Achievements", type: "soon" },
];

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

// Short marketing taglines + "new" flags for the featured strip, keyed by
// the games-registry id. Falls back to the registry description for any
// game not listed here.
export const FEATURED_META = {
  "memory-match": { tagline: "Find all pairs", isNew: true },
  "speed-match": { tagline: "Match as fast as you can", isNew: true },
  "time-attack": { tagline: "Beat the clock", isNew: true },
  survival: { tagline: "Survive as long as you can" },
  "sequence-recall": { tagline: "Remember the sequence" },
};

// Placeholder counters for the showcase stats bar. Only "Games" is derived
// from real data (see StatsBar); the rest are UI stand-ins until real
// player/score/achievement tracking exists.
export const SHOWCASE_STATS = {
  players: "2,847+",
  highScores: "12,590",
  achievements: "56",
};
