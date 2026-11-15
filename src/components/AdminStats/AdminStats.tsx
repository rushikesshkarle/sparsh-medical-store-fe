import Icon, { type IconName } from '../Icon/Icon';
import type { ProductStats } from '../../types/product';
import './AdminStats.css';

interface AdminStatsProps {
  stats: ProductStats | null;
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const cards: { label: string; value?: number; icon: IconName; tone: string }[] = [
    { label: 'Total products', value: stats?.total, icon: 'box', tone: 'tone-teal' },
    { label: 'Live on store', value: stats?.live, icon: 'check', tone: 'tone-green' },
    { label: 'Hidden', value: stats?.hidden, icon: 'eyeOff', tone: 'admin-stats__tone-muted' },
    { label: 'Low or out of stock', value: stats?.low_stock, icon: 'alert', tone: 'tone-amber' },
  ];
  return (
    <ul className="admin-stats" aria-label="Catalogue summary">
      {cards.map((card) => (
        <li key={card.label}>
          <span className={`admin-stats__icon ${card.tone}`}>
            <Icon name={card.icon} />
          </span>
          <span>
            <strong>{card.value ?? '–'}</strong>
            <span className="admin-stats__label">{card.label}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
