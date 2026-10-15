'use client';

import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

import type { UsageCategory } from './types';
import { DEFAULT_CATEGORY_COLORS, formatNumber, percentOf } from './utils';

export interface UsageBreakdownProps {
  categories: UsageCategory[];
  /** Bar width reference: the plan limit, so unused credits stay visible as empty track. */
  limit: number;
  locale: string;
  className?: string;
}

export function UsageBreakdown({ categories, limit, locale, className }: UsageBreakdownProps) {
  const total = categories.reduce((sum, category) => sum + category.value, 0);
  const scale = Math.max(limit, total);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-muted">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{ backgroundColor: category.color ?? DEFAULT_CATEGORY_COLORS[index % 4] }}
            initial={false}
            animate={{ width: `${(category.value / scale) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </div>

      <ul className="space-y-2.5">
        {categories.map((category, index) => (
          <li key={category.id} className="flex items-center gap-2.5 text-sm">
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-[3px]"
              style={{ backgroundColor: category.color ?? DEFAULT_CATEGORY_COLORS[index % 4] }}
            />
            <span className="min-w-0 flex-1 truncate">{category.label}</span>
            <span className="font-medium tabular-nums">{formatNumber(category.value, locale)}</span>
            <span className="w-9 text-right text-muted-foreground tabular-nums">
              {percentOf(category.value, total)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
