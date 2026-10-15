'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import type { UsageDay } from './types';
import { formatDay, formatNumber } from './utils';

export interface UsageDailyChartProps {
  days: UsageDay[];
  label: string;
  unit: string;
  locale: string;
  /** Highlight colour of the active bar. */
  color?: string;
  className?: string;
}

export function UsageDailyChart({
  days,
  label,
  unit,
  locale,
  color = '#2563eb',
  className,
}: UsageDailyChartProps) {
  // The most recent day is shown until the pointer or keyboard picks another one.
  const [activeIndex, setActiveIndex] = React.useState(days.length - 1);
  const max = Math.max(...days.map((day) => day.value), 1);
  const active = days[activeIndex];

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (step === undefined) return;

    event.preventDefault();
    setActiveIndex((index) => Math.min(days.length - 1, Math.max(0, index + step)));
  };

  if (!active) return null;

  return (
    <div className={cn('space-y-2.5', className)}>
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span aria-live="polite" className="tabular-nums">
          <span className="text-muted-foreground">{formatDay(active.date, locale)}</span>{' '}
          <span className="font-semibold">
            {formatNumber(active.value, locale)} {unit}
          </span>
        </span>
      </div>

      <div
        role="group"
        aria-label={`${label}: use the left and right arrow keys to browse days`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseLeave={() => setActiveIndex(days.length - 1)}
        className="flex h-12 items-end gap-[3px] rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
      >
        {days.map((day, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={day.date}
              onMouseEnter={() => setActiveIndex(index)}
              className="flex h-full flex-1 items-end"
            >
              <div
                className={cn(
                  'w-full rounded-[3px] transition-[height,background-color] duration-300',
                  !isActive && 'bg-muted-foreground/20',
                )}
                style={{
                  height: `${Math.max((day.value / max) * 100, 6)}%`,
                  backgroundColor: isActive ? color : undefined,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
