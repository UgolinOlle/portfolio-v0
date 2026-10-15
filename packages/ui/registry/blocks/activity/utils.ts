import type { ActivityDataPoint } from './types';

export interface HeatmapDay {
  date: string;
  level: number;
  value?: number;
}

export interface BuildHeatmapWeeksOptions {
  weeks: number;
  weekStartsOn?: 0 | 1;
  endDate?: Date;
}

/** Formats a local date as "YYYY-MM-DD" without going through UTC (unlike `toISOString`, which can shift the day). */
function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/** Parses a "YYYY-MM-DD" key as a local date, avoiding the UTC-parsing day-shift of `new Date(string)`. */
export function parseISODate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year!, month! - 1, day!);
}

export function buildHeatmapWeeks(
  data: ActivityDataPoint[],
  { weeks, weekStartsOn = 1, endDate }: BuildHeatmapWeeksOptions,
) {
  const byDate = new Map(data.map((point) => [point.date, point]));

  const end = endDate ?? (data.length > 0 ? parseISODate(data[data.length - 1]!.date) : new Date());
  end.setHours(0, 0, 0, 0);

  const start = new Date(end);
  start.setDate(start.getDate() - (weeks * 7 - 1));

  const offset = (start.getDay() - weekStartsOn + 7) % 7;
  start.setDate(start.getDate() - offset);

  const days: (HeatmapDay | null)[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const key = toDateKey(cursor);
    const point = byDate.get(key);

    days.push({ date: key, level: point?.level ?? 0, value: point?.value });
    cursor.setDate(cursor.getDate() + 1);
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  const columns: (HeatmapDay | null)[][] = [];

  for (let i = 0; i < days.length; i += 7) {
    columns.push(days.slice(i, i + 7));
  }

  const monthLabels = new Map<number, string>();
  let lastMonth = -1;

  columns.forEach((column, index) => {
    const firstRealDay = column.find((day): day is HeatmapDay => day !== null);

    if (!firstRealDay) return;

    const month = parseISODate(firstRealDay.date).getMonth();

    if (month !== lastMonth) {
      monthLabels.set(
        index,
        new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
          parseISODate(firstRealDay.date),
        ),
      );
      lastMonth = month;
    }
  });

  return { columns, monthLabels };
}

export function getIntensityColor(color: string, level: number, levels: number) {
  if (level <= 0) return undefined;

  const clamped = Math.min(level, levels - 1);
  const percent = Math.round((clamped / Math.max(levels - 1, 1)) * 70 + 30);

  return `color-mix(in srgb, ${color} ${percent}%, var(--card))`;
}

export function sumActivityValues(data: ActivityDataPoint[]) {
  return data.reduce((total, point) => total + (point.value ?? (point.level > 0 ? 1 : 0)), 0);
}

export function computeActivityStreaks(data: ActivityDataPoint[]) {
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));

  let active = 0;
  let longest = 0;
  let running = 0;
  let previousDate: Date | null = null;

  for (const point of sorted) {
    if (point.level <= 0) {
      running = 0;
      previousDate = null;
      continue;
    }

    active += 1;

    const currentDate = parseISODate(point.date);
    const isConsecutive =
      previousDate !== null &&
      Math.round((currentDate.getTime() - previousDate.getTime()) / 86_400_000) === 1;

    running = isConsecutive ? running + 1 : 1;
    longest = Math.max(longest, running);
    previousDate = currentDate;
  }

  let current = 0;

  for (let i = sorted.length - 1; i >= 0; i -= 1) {
    const point = sorted[i]!;

    if (point.level <= 0) break;

    if (i < sorted.length - 1) {
      const currentDate = parseISODate(point.date);
      const nextDate = parseISODate(sorted[i + 1]!.date);

      if (Math.round((nextDate.getTime() - currentDate.getTime()) / 86_400_000) !== 1) break;
    }

    current += 1;
  }

  return { active, longest, current };
}
