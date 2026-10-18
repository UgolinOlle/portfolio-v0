'use client';

import { m, useReducedMotion, useSpring } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { AnimatedNumber } from './animated-number';
import { TARGET_6M, months, ranges } from './data';
import type { RangeId } from './data';
import { EvilChart, SERIES } from './evil-chart';
import type { SeriesId } from './evil-chart';
import { CHART_START, EASE_OUT_STRONG, slide } from './motion';

const fmtM = (k: number) => `$${(k / 1000).toFixed(k % 1000 === 0 ? 1 : 2)}M`;

function RangeSwitch({ value, onChange }: { value: RangeId; onChange: (r: RangeId) => void }) {
  const thumbId = React.useId();
  return (
    <div
      aria-label="Time range"
      className="flex h-9 items-center rounded-full border border-(--d2-line) bg-white/[0.03] p-0.5"
      role="radiogroup"
    >
      {ranges.map((r) => {
        const on = r.id === value;
        return (
          <button
            aria-checked={on}
            className={cn(
              'relative h-8 min-w-11 rounded-full px-3 text-[11px] font-medium transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white/40',
              on
                ? 'text-(--d2-fg)'
                : 'text-(--d2-muted) [@media(hover:hover)_and_(pointer:fine)]:hover:text-(--d2-fg)',
            )}
            key={r.id}
            onClick={() => onChange(r.id)}
            role="radio"
            type="button"
          >
            {on && (
              <m.span
                className="absolute inset-0 rounded-full bg-white/10"
                layoutId={thumbId}
                transition={slide}
              />
            )}
            <span className="relative">{r.id}</span>
          </button>
        );
      })}
    </div>
  );
}

function Progress({ ratio, delay }: { ratio: number; delay: number }) {
  const reduce = useReducedMotion();
  const scale = useSpring(reduce ? ratio : 0, { stiffness: 90, damping: 20 });
  React.useEffect(() => {
    if (reduce) {
      scale.jump(ratio);
      return;
    }
    const t = window.setTimeout(() => scale.set(Math.min(1, ratio)), delay * 1000);
    return () => window.clearTimeout(t);
  }, [ratio, delay, reduce, scale]);

  return (
    <div
      aria-label={`${Math.round(ratio * 100)}% of target`}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(ratio * 100)}
      className="relative mt-4 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/[0.07]"
      role="progressbar"
    >
      <m.div
        className="absolute inset-0 overflow-hidden rounded-full bg-linear-to-r from-[#e9521a] to-[#ff8f55]"
        style={{ scaleX: scale, transformOrigin: 'left center' }}
      >
        {/* One shimmer pass after the fill lands. */}
        <m.span
          animate={{ transform: 'translateX(260%)' }}
          className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-white/45 to-transparent"
          initial={{ transform: 'translateX(-120%)' }}
          transition={{ duration: 0.9, delay: delay + 0.9, ease: EASE_OUT_STRONG }}
        />
      </m.div>
    </div>
  );
}

export function RevenueCard() {
  const [range, setRange] = React.useState<RangeId>('6M');
  const [hidden, setHidden] = React.useState<ReadonlySet<SeriesId>>(new Set());

  const count = ranges.find((r) => r.id === range)!.count;
  const points = React.useMemo(() => months.slice(-count), [count]);
  const monthlyTarget = TARGET_6M / 6;
  const target = monthlyTarget * count;
  const total = points.reduce((sum, p) => sum + p.forecast, 0);
  const ratio = total / target;
  const onTrack = ratio >= 0.8;

  const toggle = (id: SeriesId) =>
    setHidden((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else if (next.size < SERIES.length - 1) next.add(id); // always keep one series
      return next;
    });

  return (
    <section
      aria-labelledby="d2-revenue"
      className="min-w-0 rounded-[22px] border border-(--d2-line) bg-(--d2-card) px-5 pt-5 pb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[16px] leading-tight font-medium text-(--d2-fg)" id="d2-revenue">
              Revenue forecast
            </h2>
            <span
              className={cn(
                'inline-flex h-6 items-center rounded-full px-3 text-[11px] font-medium',
                onTrack
                  ? 'bg-emerald-500/[0.14] text-emerald-400'
                  : 'bg-amber-500/[0.14] text-amber-400',
              )}
            >
              {onTrack ? 'On track' : 'Behind pace'}
            </span>
          </div>
          <p className="mt-1.5 text-[13px] text-(--d2-muted)">
            Weighted by stage probability · last {count} months
          </p>
        </div>
        <RangeSwitch onChange={setRange} value={range} />
      </div>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <AnimatedNumber
          className="text-[28px] leading-none font-medium tracking-tight text-(--d2-fg) tabular-nums"
          delay={CHART_START - 0.2}
          duration={1.2}
          format={(n) => fmtM(n)}
          value={total}
        />
        <span className="text-[13px] text-(--d2-muted) tabular-nums">of {fmtM(target)} target</span>
      </div>
      <Progress delay={CHART_START} ratio={ratio} />

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2" role="group" aria-label="Series">
        {SERIES.map((s) => {
          const off = hidden.has(s.id);
          return (
            <button
              aria-pressed={!off}
              className="flex items-center gap-2 rounded-md text-[12px] transition-opacity duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              key={s.id}
              onClick={() => toggle(s.id)}
              type="button"
            >
              <span
                className="size-2.5 rounded-full transition-opacity duration-150"
                style={{ background: s.glow, opacity: off ? 0.3 : 1 }}
              />
              <span
                className={cn(
                  'transition-colors duration-150',
                  off ? 'text-(--d2-dim) line-through' : 'text-(--d2-muted)',
                )}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      <EvilChart
        className="mt-4 h-[220px] @3xl/main:h-[250px]"
        hidden={hidden}
        monthlyTarget={monthlyTarget}
        points={points}
        startDelay={CHART_START}
        targetLabel={`Target ${fmtM(target)}`}
      />

      <table className="sr-only">
        <caption>Revenue forecast by month, in thousands of dollars</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Forecast</th>
            <th scope="col">Closed won</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.id}>
              <th scope="row">{p.long}</th>
              <td>${p.forecast}K</td>
              <td>${p.won}K</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
