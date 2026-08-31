import { CATEGORIES } from "./homeData";

export function CategorySection() {
  return (
    <section className="hp-section hp-categories" id="categories">
      <h2 className="hp-section-label">
        <span aria-hidden="true">🎮</span> Browse Categories
      </h2>
      <div className="hp-category-grid">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className="hp-category-card"
            data-accent={cat.accent}
            aria-disabled="true"
            title="Category games coming soon"
          >
            <span className="hp-category-icon" aria-hidden="true">
              {cat.icon}
            </span>
            <span className="hp-category-title">{cat.title}</span>
            <span className="hp-category-desc">{cat.description}</span>
            <span className="hp-category-arrow" aria-hidden="true">
              →
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
