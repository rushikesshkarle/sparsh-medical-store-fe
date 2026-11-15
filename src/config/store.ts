import type { IconName } from '../components/Icon/Icon';

/** Store details shown across the storefront. Change them here only. */
export const STORE_INFO = {
  name: 'Sparsh Medical',
  tagline: 'Care · Quality · Trust',
  address: 'Anganwadi Road, Ashtvinayak Chowk, Morewasti, Chikhali, Pune',
  shortAddress: 'Morewasti, Chikhali, Pune',
  phone: '9503486348',
  phoneDisplay: '95034 86348',
  whatsappNumber: '919503486348',
  mapsUrl: 'https://maps.app.goo.gl/vbaMeB72wELNyez58',
  /** Map in "Visit the store": a place search shown at street level (zoom 1–21). */
  map: {
    /** The store's exact pin (SPARSH MEDICAL on Google Maps), as "lat,lng". */
    query: '18.6751002,73.7974917',
    zoom: 17,
    /** Optional: paste the store's own embed URL from Google Maps → Share → "Embed a map"
     *  (the src="…" part) for an exact pin. When set, it is used instead of the query. */
    embedUrl: '',
  },
  logo: '/images/logo.jpg',
  /** Opening hours, 24h "HH:MM" in the store's time zone. */
  hours: {
    open: '08:00',
    close: '23:30',
    openLabel: '8:00 AM',
    closeLabel: '11:30 PM',
    label: '8:00 AM – 11:30 PM',
    timeZone: 'Asia/Kolkata',
  },
  /** Short locality shown in the hero status badge. */
  locality: 'Morewasti, Chikhali',
};

export type Tone = 'blue' | 'amber' | 'pink' | 'green' | 'red' | 'teal';

export interface CategoryOption {
  label: string;
  /** Sent as ?category=; empty = all products. */
  value: string;
  hint: string;
  icon: IconName;
  tone: Tone;
}

export const CATEGORIES: CategoryOption[] = [
  { label: 'All', value: '', hint: 'Everything in store', icon: 'grid', tone: 'teal' },
  { label: 'Medicines', value: 'Medicines', hint: 'Everyday medicines', icon: 'pill', tone: 'blue' },
  { label: 'Vitamins', value: 'Vitamins', hint: 'Immunity & energy', icon: 'citrus', tone: 'amber' },
  { label: 'Personal care', value: 'Personal Care', hint: 'Skin & hygiene', icon: 'droplet', tone: 'pink' },
  { label: 'Hair care', value: 'Hair Care', hint: 'Oils & shampoos', icon: 'leaf', tone: 'green' },
  { label: 'Healthcare', value: 'Healthcare', hint: 'First aid & devices', icon: 'bandage', tone: 'red' },
];

/** Products with this stock or less show "Few left" to customers (matches the backend's LOW_STOCK_THRESHOLD). */
export const LOW_STOCK_THRESHOLD = 5;
