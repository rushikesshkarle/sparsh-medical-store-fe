import { CATEGORIES, type Tone } from '../config/store';
import type { IconName } from '../components/Icon/Icon';

/** Icon + colour for a product's category; unknown categories get the generic teal box. */
export const categoryVisual = (category: string): { icon: IconName; tone: Tone } => {
  const match = CATEGORIES.find((c) => c.value && c.value.toLowerCase() === category.trim().toLowerCase());
  return match ? { icon: match.icon, tone: match.tone } : { icon: 'box', tone: 'teal' };
};
