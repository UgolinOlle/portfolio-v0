'use client';

import type { UsageDay, UsagePeriod } from '@/components/blocks/usage-card/usage-card';
import { UsageCard } from '@/components/blocks/usage-card/usage-card';

function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fixed dates (not "today") so server and client render identical markup.
function generateDaily(seed: number, start: string, days: number, total: number): UsageDay[] {
  const random = mulberry32(seed);
  const weights = Array.from({ length: days }, () => 0.35 + random());
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
  const values = weights.map((weight) => Math.round((weight / weightSum) * total));
  // Absorb rounding so the days add up exactly to the period total.
  values[values.length - 1] += total - values.reduce((sum, value) => sum + value, 0);

  const startTime = Date.parse(`${start}T00:00:00Z`);

  return values.map((value, index) => ({
    date: new Date(startTime + index * 86_400_000).toISOString().slice(0, 10),
    value,
  }));
}

const COLORS = { chat: '#2563eb', search: '#60a5fa', image: '#bfdbfe', api: '#a1a1aa' };

function categories(chat: number, search: number, image: number, api: number) {
  return [
    { id: 'chat', label: 'Chat', value: chat, color: COLORS.chat },
    { id: 'search', label: 'Search', value: search, color: COLORS.search },
    { id: 'image', label: 'Image', value: image, color: COLORS.image },
    { id: 'api', label: 'API', value: api, color: COLORS.api },
  ];
}

const periods: UsagePeriod[] = [
  {
    id: 'this-month',
    label: 'This month',
    used: 4286,
    limit: 10000,
    categories: categories(2231, 912, 731, 412),
    daily: generateDaily(7, '2026-10-01', 14, 4286),
  },
  {
    id: 'last-month',
    label: 'Last month',
    used: 10000,
    limit: 10000,
    categories: categories(5210, 2140, 1690, 960),
    daily: generateDaily(3, '2026-09-01', 30, 10000),
  },
  {
    id: '7-days',
    label: '7 days',
    used: 2138,
    limit: 10000,
    categories: categories(1108, 457, 369, 204),
    daily: generateDaily(11, '2026-10-08', 7, 2138),
  },
];

export default function Demo() {
  return (
    <UsageCard
      title="Halden AI"
      subtitle="Pro plan · Resets in 9 days"
      periods={periods}
      defaultPeriod="last-month"
      meters={[
        { id: 'seats', label: 'Seats', value: 10, limit: 10 },
        { id: 'storage', label: 'Storage', value: 2.9, limit: 5, unit: 'GB' },
        { id: 'projects', label: 'Projects', value: 11, limit: null },
      ]}
    />
  );
}
