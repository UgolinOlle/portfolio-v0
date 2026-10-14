'use client';

import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import type { UsageCardLabels, UsageMeter, UsagePeriod } from './types';
import { UsageBreakdown } from './usage-breakdown';
import { UsageDailyChart } from './usage-daily-chart';
import { UsageMeters } from './usage-meters';
import { UsagePeriodTabs } from './usage-period-tabs';
import { formatNumber, getUsageTone, percentOf, TONE_DOT_CLASS } from './utils';

export interface UsageCardProps {
  title: string;
  /** Line under the title, e.g. "Pro plan · Resets in 9 days". */
  subtitle?: React.ReactNode;
  periods: UsagePeriod[];

  /** Uncontrolled initial period. Defaults to the first one. */
  defaultPeriod?: string;
  /** Controlled active period id. */
  activePeriod?: string;
  onPeriodChange?: (id: string) => void;

  meters?: UsageMeter[];
  labels?: UsageCardLabels;
  /** BCP 47 locale for numbers and dates. */
  locale?: string;

  onAction?: () => void;
  /** Full override for the footer action. */
  action?: React.ReactNode;

  className?: string;
}

const DEFAULT_LABELS: Required<UsageCardLabels> = {
  of: 'of',
  unit: 'credits',
  perDay: 'Per day',
  limitReached: 'Limit reached',
  remaining: (remaining) => `${remaining} credits left`,
  action: 'Add credits',
};

export function UsageCard({
  title,
  subtitle,
  periods,
  defaultPeriod,
  activePeriod: controlledPeriod,
  onPeriodChange,
  meters,
  labels: labelOverrides,
  locale = 'en-US',
  onAction,
  action,
  className,
}: UsageCardProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const [internalPeriod, setInternalPeriod] = React.useState(defaultPeriod ?? periods[0]?.id);
  const activeId = controlledPeriod ?? internalPeriod;
  const period = periods.find((item) => item.id === activeId) ?? periods[0];

  if (!period) return null;

  const tone = getUsageTone(period.used, period.limit);
  const remaining = Math.max(period.limit - period.used, 0);

  const handlePeriodChange = (id: string) => {
    setInternalPeriod(id);
    onPeriodChange?.(id);
  };

  return (
    <div
      className={cn(
        'w-full max-w-sm rounded-3xl border border-border/60 bg-muted p-1.5',
        className,
      )}
    >
      <div className="space-y-5 rounded-[20px] border border-border/40 bg-card p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">{title}</h3>
            {subtitle && <p className="text-xs text-pretty text-muted-foreground">{subtitle}</p>}
          </div>

          {periods.length > 1 && (
            <UsagePeriodTabs
              periods={periods}
              activePeriod={period.id}
              onChange={handlePeriodChange}
            />
          )}
        </div>

        <div className="flex items-end justify-between gap-3">
          <p className="flex items-baseline gap-1.5 tabular-nums">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={period.id}
                className="text-4xl font-semibold tracking-tight"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                {formatNumber(period.used, locale)}
              </motion.span>
            </AnimatePresence>
            <span className="text-sm text-muted-foreground">
              {labels.of} {formatNumber(period.limit, locale)} {labels.unit}
            </span>
          </p>

          <span className="flex items-center gap-1.5 pb-1 text-sm font-medium tabular-nums">
            <span aria-hidden="true" className={cn('size-2 rounded-full', TONE_DOT_CLASS[tone])} />
            {percentOf(period.used, period.limit)}%
          </span>
        </div>

        <UsageBreakdown categories={period.categories} limit={period.limit} locale={locale} />

        <UsageDailyChart
          // Remount per period so the highlighted day resets to the latest one.
          key={period.id}
          className="border-t border-dashed border-border pt-4"
          days={period.daily}
          label={labels.perDay}
          unit={labels.unit}
          locale={locale}
          color={period.categories[0]?.color}
        />

        {meters && meters.length > 0 && (
          <UsageMeters
            className="border-t border-dashed border-border pt-4"
            meters={meters}
            locale={locale}
            ofLabel={labels.of}
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-3 px-3 pt-2.5 pb-1.5">
        <span className="flex items-center gap-2 text-xs font-medium">
          <span aria-hidden="true" className={cn('size-2 rounded-full', TONE_DOT_CLASS[tone])} />
          {tone === 'limit'
            ? labels.limitReached
            : labels.remaining(formatNumber(remaining, locale))}
        </span>

        {action ?? (
          <button
            type="button"
            onClick={onAction}
            className={cn(
              'rounded-lg bg-foreground px-3.5 py-1.5 text-xs font-medium text-background',
              'transition-[opacity,transform] hover:opacity-90 active:scale-[0.98]',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
            )}
          >
            {labels.action}
          </button>
        )}
      </div>
    </div>
  );
}

export type {
  UsageCardLabels,
  UsageCategory,
  UsageDay,
  UsageMeter,
  UsagePeriod,
  UsageTone,
} from './types';
