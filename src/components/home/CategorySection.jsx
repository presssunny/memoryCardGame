import { CATEGORIES } from "./homeData";

export function CategorySection({ games, onSelectCategory }) {
  const countFor = (categoryId) =>
    games.filter((game) => game.category === categoryId).length;

  return (
    <section className="hp-section hp-categories" id="categories">
      <h2 className="hp-section-label">
        <span aria-hidden="true">🎮</span> Browse Categories
      </h2>
      <div className="hp-category-grid">
        {CATEGORIES.map((cat) => {
          const count = countFor(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              className="hp-category-card"
              data-accent={cat.accent}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span className="hp-category-icon" aria-hidden="true">
                {cat.icon}
              </span>
              <span className="hp-category-title">{cat.title}</span>
              <span className="hp-category-desc">{cat.description}</span>
              <span className="hp-category-count">
                {count} {count === 1 ? "game" : "games"}
              </span>
              <span className="hp-category-arrow" aria-hidden="true">
                →
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
