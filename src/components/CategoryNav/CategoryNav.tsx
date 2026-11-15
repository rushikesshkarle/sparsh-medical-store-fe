import { CATEGORIES } from '../../config/store';
import './CategoryNav.css';

interface CategoryNavProps {
  activeCategory: string;
  onSelect: (category: string) => void;
}

/** Category tabs under the header: an underlined row on desktop, scrollable chips on phones. */
export default function CategoryNav({ activeCategory, onSelect }: CategoryNavProps) {
  return (
    <nav className="category-nav" aria-label="Product categories">
      <div className="container category-nav__row">
        {CATEGORIES.map((c) => {
          const active = activeCategory.toLowerCase() === c.value.toLowerCase();
          return (
            <button
              type="button"
              key={c.label}
              className="category-nav__item"
              aria-pressed={active}
              onClick={() => onSelect(c.value)}
            >
              {c.value ? c.label : 'All products'}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
