import type { UsageTone } from './types';

export const DEFAULT_CATEGORY_COLORS = ['#2563eb', '#60a5fa', '#bfdbfe', '#a1a1aa'];

/** Ratio thresholds for the status dot: amber from 80 %, "limit" once fully used. */
export function getUsageTone(value: number, limit: number | null): UsageTone {
  if (!limit) return 'ok';

  const ratio = value / limit;

  if (ratio >= 1) return 'limit';
  if (ratio >= 0.8) return 'warning';
  return 'ok';
}

export const TONE_DOT_CLASS: Record<UsageTone, string> = {
  ok: 'bg-emerald-500',
  warning: 'bg-amber-500',
  limit: 'bg-amber-500',
};

export function percentOf(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

export function formatNumber(value: number, locale: string, maximumFractionDigits = 0) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value);
}

/** "Aug 23" — UTC so server and client render the same day. */
export function formatDay(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date));
}
