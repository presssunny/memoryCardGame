import { Link } from "react-router-dom";
import { CATEGORIES } from "./homeData";
import { categoryPath } from "../../routing/paths";

// The "Browse Categories" grid, shared by the home page and the /games index.
// Each card is a real link to its category route.
export function CategorySection({ games }) {
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
            <Link
              key={cat.id}
              className="hp-category-card"
              data-accent={cat.accent}
              to={categoryPath(cat.id)}
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
            </Link>
          );
        })}
      </div>
    </section>
  );
}
