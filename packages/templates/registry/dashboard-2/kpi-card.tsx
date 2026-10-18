'use client';

import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { m } from 'motion/react';

import { cn } from '@/lib/utils';

import { AnimatedNumber } from './animated-number';
import type { Kpi } from './data';
import { EASE_OUT_STRONG, rise } from './motion';
import { Sparkline } from './sparkline';

export function DeltaPill({ delta, delay = 0 }: { delta: number; delay?: number }) {
  const up = delta >= 0;
  const Icon = up ? TrendingUpIcon : TrendingDownIcon;
  return (
    <m.span
      animate={{ opacity: 1, transform: 'scale(1)' }}
      className={cn(
        'inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-medium',
        up ? 'bg-emerald-500/[0.14] text-emerald-400' : 'bg-red-500/[0.14] text-red-400',
      )}
      initial={{ opacity: 0, transform: 'scale(0.9)' }}
      style={{ transformOrigin: 'left center' }}
      transition={{ duration: 0.3, ease: EASE_OUT_STRONG, delay }}
    >
      <Icon aria-hidden className="size-3.5" strokeWidth={2.2} />
      <span>
        {up ? '+' : '−'}
        {Math.abs(delta).toFixed(1)}%
      </span>
    </m.span>
  );
}

export function KpiCard({ kpi, index }: { kpi: Kpi; index: number }) {
  // Numbers start counting once the card's own entrance is under way.
  const countDelay = 0.3 + index * 0.06;
  return (
    <m.article
      className="relative rounded-[22px] border border-(--d2-line) bg-(--d2-card) px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors duration-200 [@media(hover:hover)_and_(pointer:fine)]:hover:border-white/15"
      variants={rise}
    >
      <Sparkline
        className="absolute top-4 right-4 h-8 w-[88px]"
        color={kpi.delta >= 0 ? '#34d399' : '#f87171'}
        data={kpi.trend}
        delay={countDelay + 0.2}
      />
      <h3 className="text-[13px] font-medium text-(--d2-fg)/90">{kpi.label}</h3>
      <p className="mt-2.5 text-[26px] leading-[1.05] font-medium tracking-tight text-(--d2-fg) tabular-nums">
        <AnimatedNumber delay={countDelay} format={kpi.format} value={kpi.value} />
      </p>
      <div className="mt-3 flex items-center gap-2.5 text-[12px] text-(--d2-muted)">
        <DeltaPill delay={countDelay + 0.5} delta={kpi.delta} />
        <span>{kpi.caption}</span>
      </div>
    </m.article>
  );
}
