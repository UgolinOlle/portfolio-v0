'use client';

import { motion } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import type { UsagePeriod } from './types';

export interface UsagePeriodTabsProps {
  periods: Pick<UsagePeriod, 'id' | 'label'>[];
  activePeriod: string;
  onChange: (id: string) => void;
  className?: string;
}

export function UsagePeriodTabs({
  periods,
  activePeriod,
  onChange,
  className,
}: UsagePeriodTabsProps) {
  // Unique per instance, so several cards on one page don't share the animated pill.
  const pillId = React.useId();

  return (
    <div
      role="tablist"
      aria-label="Period"
      className={cn(
        'flex max-w-full items-center overflow-x-auto rounded-lg bg-muted p-0.5',
        className,
      )}
    >
      {periods.map((period) => {
        const isActive = period.id === activePeriod;

        return (
          <button
            key={period.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(period.id)}
            className={cn(
              'relative rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap transition-colors',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {isActive && (
              <motion.span
                layoutId={pillId}
                className="absolute inset-0 rounded-md bg-card shadow-sm ring-1 ring-border/60"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
            <span className="relative z-10">{period.label}</span>
          </button>
        );
      })}
    </div>
  );
}
