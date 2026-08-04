import type * as React from 'react';

export interface ActivityDataPoint {
  /** ISO date string, e.g. "2025-08-01". */
  date: string;

  /** Intensity level for this day, from 0 (inactive) to `levels - 1`. */
  level: number;

  /** Raw value for this day (commits count, words written, minutes...). Used for the summary total. */
  value?: number;
}

export interface ActivityStat {
  label: string;
  value: string | number;
}

export interface ActivityTabStats {
  active?: ActivityStat;
  longest?: ActivityStat;
  current?: ActivityStat;
}

export interface ActivityTab {
  id: string;
  label: string;

  /** Any CSS color (hex, rgb, oklch...). Drives the tab accent, the heatmap tint and the stats color. */
  color: string;

  /** Optional icon shown instead of the default color dot. */
  icon?: React.ReactNode;

  /** Dense series covering the displayed period, one entry per day. */
  data: ActivityDataPoint[];

  /** Unit used in the default summary sentence, e.g. "commits", "words". */
  unit?: string;

  /** Full override for the summary line above the heatmap. */
  summary?: React.ReactNode;

  /** Override the computed Active / Longest / Current stats. */
  stats?: ActivityTabStats;
}
