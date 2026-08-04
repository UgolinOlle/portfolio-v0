'use client';

import { Activity } from 'registry/blocks/activity/activity';
import type { ActivityDataPoint } from 'registry/blocks/activity/types';

function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Local "YYYY-MM-DD" formatting — `toISOString()` converts to UTC first, which can shift the day.
function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function generateData(seed: number, days: number, maxValue: number): ActivityDataPoint[] {
  const random = mulberry32(seed);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const data: ActivityDataPoint[] = [];

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const isActive = random() > 0.32;
    const value = isActive ? Math.round(random() * maxValue) + 1 : 0;
    const level = value === 0 ? 0 : Math.min(4, Math.floor((value / maxValue) * 4) + 1);

    data.push({ date: toDateKey(date), level, value });
  }

  return data;
}

const commits = generateData(1, 371, 12);
const focus = generateData(2, 371, 6);
const writing = generateData(3, 371, 1800);
const exercise = generateData(4, 371, 2);

export default function Demo() {
  return (
    <Activity
      title="Activity"
      period="Jul 2025 – Jul 2026"
      defaultTab="writing"
      tabs={[
        { id: 'commits', label: 'Commits', color: '#16a34a', unit: 'commits', data: commits },
        { id: 'focus', label: 'Focus', color: '#7c3aed', unit: 'focus sessions', data: focus },
        { id: 'writing', label: 'Writing', color: '#f59e0b', unit: 'words', data: writing },
        { id: 'exercise', label: 'Exercise', color: '#e11d48', unit: 'workouts', data: exercise },
      ]}
    />
  );
}
