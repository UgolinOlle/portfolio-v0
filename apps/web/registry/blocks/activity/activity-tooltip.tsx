'use client';

import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

import { parseISODate, type HeatmapDay } from './utils';

export interface ActivityTooltipProps {
  day: HeatmapDay | null;

  /** Position relative to the heatmap's own container (already clamped/flipped by the caller). */
  left: number;
  top: number;
  flip: boolean;

  color: string;
  categoryLabel: string;
  unit?: string;
  className?: string;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

export function ActivityTooltip({
  day,
  left,
  top,
  flip,
  color,
  categoryLabel,
  unit,
  className,
}: ActivityTooltipProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-20"
      style={{
        left,
        top,
        transform: flip ? 'translate(-50%, 10px)' : 'translate(-50%, calc(-100% - 10px))',
      }}
    >
      <AnimatePresence>
        {day && (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, scale: 0.9, y: flip ? -4 : 4, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: flip ? -4 : 4, filter: 'blur(4px)' }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'w-max rounded-xl border border-border/50 bg-card/80 px-3 py-2 text-xs whitespace-nowrap shadow-lg backdrop-blur-md',
              className,
            )}
          >
            <p className="font-medium text-foreground">
              {dateFormatter.format(parseISODate(day.date))}
            </p>

            <p className="mt-0.5 text-muted-foreground">
              <span className="font-semibold" style={{ color }}>
                {day.value !== undefined && day.value > 0
                  ? `${day.value.toLocaleString()}${unit ? ` ${unit}` : ''}`
                  : 'No activity'}
              </span>{' '}
              · {categoryLabel}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
