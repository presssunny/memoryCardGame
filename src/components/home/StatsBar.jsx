import { CATEGORIES } from "./homeData";

// Every number here is derived from real data: the registry, the category
// list, and the visitor's own saved best scores in localStorage (via the
// useBestScores hook value). Nothing is invented. "Played" is how many games
// this browser has a recorded result for — 0 for a first-time visitor,
// which is honest.
export function StatsBar({ games, bestScores }) {
  const played = games.filter(
    (g) => bestScores.getBestOverall(g.id) != null,
  ).length;

  const stats = [
    { icon: "🎮", accent: "blue", value: games.length, label: "Games" },
    {
      icon: "🗂️",
      accent: "cyan",
      value: CATEGORIES.length,
      label: "Categories",
    },
    { icon: "🏅", accent: "amber", value: played, label: "You've Played" },
  ];

  return (
    <section className="hp-section hp-stats">
      <dl className="hp-stats-bar">
        {stats.map((s) => (
          <div key={s.label} className="hp-stat" data-accent={s.accent}>
            <span className="hp-stat-icon" aria-hidden="true">
              {s.icon}
            </span>
            {/* <dt> before <dd> — term before description, the order a
                screen reader needs. The visual order (value above label) is
                unchanged: .hp-stat-text is column-reverse (see home.css). */}
            <div className="hp-stat-text">
              <dt className="hp-stat-label">{s.label}</dt>
              <dd className="hp-stat-value">{s.value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
