import { STORE_INFO } from '../config/store';

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Minutes since midnight in the store's own time zone, whatever the visitor's zone is. */
const storeMinutesNow = (now: Date): number => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: STORE_INFO.hours.timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return get('hour') * 60 + get('minute');
};

export const isStoreOpen = (now: Date = new Date()): boolean => {
  const minutes = storeMinutesNow(now);
  return minutes >= toMinutes(STORE_INFO.hours.open) && minutes < toMinutes(STORE_INFO.hours.close);
};

/** "15.5" for 8:00–23:30. */
export const hoursOpenPerDay = (): string => {
  const hrs = (toMinutes(STORE_INFO.hours.close) - toMinutes(STORE_INFO.hours.open)) / 60;
  return Number.isInteger(hrs) ? String(hrs) : hrs.toFixed(1);
};
