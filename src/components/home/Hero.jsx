import { HeroScene } from "./HeroScene";
import { SHOWCASE_STATS } from "./homeData";

const AVATARS = ["🧑‍🚀", "🧑‍🎤", "🧑‍💻", "🧑‍🎨"];

export function Hero({ onExplore }) {
  return (
    <section className="hp-hero" id="top">
      <div className="hp-hero-copy">
        <span className="hp-eyebrow">Play • Challenge • Win</span>
        <h1 className="hp-hero-title">
          <span>Level Up</span>
          <span>
            Your <span className="hp-gradient-text">Brain</span>
          </span>
        </h1>
        <p className="hp-hero-lead">
          Welcome to Game Arcade &ndash; a playground of fun and brain-boosting
          games. Challenge yourself, beat your high scores, and unlock
          achievements!
        </p>
        <div className="hp-hero-actions">
          <button type="button" className="hp-btn hp-btn--primary" onClick={onExplore}>
            <span aria-hidden="true">🎮</span> Explore Games
          </button>
          <a className="hp-btn hp-btn--ghost" href="#categories">
            <span className="hp-btn-play" aria-hidden="true">▶</span> How It Works
          </a>
        </div>
        <div className="hp-hero-players">
          <span className="hp-avatars" aria-hidden="true">
            {AVATARS.map((a, i) => (
              <span key={i} className="hp-avatar">
                {a}
              </span>
            ))}
          </span>
          <span className="hp-players-text">
            Join <strong>{SHOWCASE_STATS.players}</strong> players and start
            playing today!
          </span>
        </div>
      </div>
      <HeroScene />
    </section>
  );
}
