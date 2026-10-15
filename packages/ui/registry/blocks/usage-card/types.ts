export interface UsageCategory {
  id: string;
  label: string;
  value: number;
  /** Segment and legend colour. Defaults to the built-in blue/grey palette. */
  color?: string;
}

export interface UsageDay {
  /** `YYYY-MM-DD`. */
  date: string;
  value: number;
}

export interface UsagePeriod {
  id: string;
  /** Tab label, e.g. "This month". */
  label: string;
  used: number;
  limit: number;
  categories: UsageCategory[];
  daily: UsageDay[];
}

export interface UsageMeter {
  id: string;
  label: string;
  value: number;
  /** `null` means unlimited. */
  limit: number | null;
  /** Appended after the limit, e.g. "GB". */
  unit?: string;
}

export type UsageTone = 'ok' | 'warning' | 'limit';

export interface UsageCardLabels {
  /** Word between a value and its limit, e.g. "of". */
  of?: string;
  /** Suffix after the limit in the headline, e.g. "credits". */
  unit?: string;
  perDay?: string;
  limitReached?: string;
  /** Footer text while under the limit. */
  remaining?: (remaining: string) => string;
  action?: string;
}
