import Icon from '../Icon/Icon';
import { CATEGORIES } from '../../config/store';
import './CategoryGrid.css';

interface CategoryGridProps {
  activeCategory: string;
  onSelect: (category: string) => void;
}

export default function CategoryGrid({ activeCategory, onSelect }: CategoryGridProps) {
  return (
    <section className="cat-grid" id="categories" aria-labelledby="cat-grid-title">
      <div className="section-head">
        <div>
          <h2 id="cat-grid-title">Shop by category</h2>
          <p>Find what you need in one tap</p>
        </div>
      </div>
      <div className="cat-grid__tiles">
        {CATEGORIES.map((c) => {
          const active = activeCategory.toLowerCase() === c.value.toLowerCase();
          return (
            <button
              type="button"
              key={c.label}
              className="cat-grid__tile"
              aria-pressed={active}
              onClick={() => onSelect(c.value)}
            >
              <span className={`cat-grid__icon tone-${c.tone}`}>
                <Icon name={c.icon} size={30} />
              </span>
              <strong>{c.label}</strong>
              <span className="cat-grid__hint">{c.hint}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
