import { SHOWCASE_STATS } from "./homeData";

export function StatsBar({ gameCount }) {
  const stats = [
    { icon: "🎮", accent: "blue", value: `${gameCount}+`, label: "Games" },
    { icon: "👥", accent: "cyan", value: SHOWCASE_STATS.players, label: "Players" },
    {
      icon: "🏆",
      accent: "amber",
      value: SHOWCASE_STATS.highScores,
      label: "High Scores",
    },
    {
      icon: "🔥",
      accent: "red",
      value: SHOWCASE_STATS.achievements,
      label: "Achievements",
    },
  ];

  return (
    <section className="hp-section hp-stats">
      <dl className="hp-stats-bar">
        {stats.map((s) => (
          <div key={s.label} className="hp-stat" data-accent={s.accent}>
            <span className="hp-stat-icon" aria-hidden="true">
              {s.icon}
            </span>
            <div className="hp-stat-text">
              <dd className="hp-stat-value">{s.value}</dd>
              <dt className="hp-stat-label">{s.label}</dt>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
