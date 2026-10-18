'use client';

import { m, useInView, useReducedMotion } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { AnimatedNumber } from './animated-number';
import type { Source } from './data';
import { EASE_OUT_STRONG } from './motion';

const GAP = 1.4;

export function SourceDonut({ sources }: { sources: Source[] }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const go = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState<string | null>(null);
  const shown = sources.find((s) => s.id === active);

  let offset = 0;
  const arcs = sources.map((s) => {
    const start = offset;
    offset += s.share;
    return { ...s, start };
  });

  return (
    <section
      aria-labelledby="d2-sources"
      className="rounded-[22px] border border-(--d2-line) bg-(--d2-card) px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
      ref={ref}
    >
      <h2 className="text-[16px] font-medium text-(--d2-fg)" id="d2-sources">
        Deals by source
      </h2>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="relative size-[132px] shrink-0">
          <svg aria-hidden className="size-full -rotate-90" viewBox="0 0 36 36">
            <circle
              cx={18}
              cy={18}
              fill="none"
              r={15.9155}
              stroke="white"
              strokeOpacity={0.05}
              strokeWidth={3.4}
            />
            {arcs.map((a, i) => {
              const len = Math.max(0, a.share - GAP);
              return (
                <m.circle
                  animate={{
                    strokeDasharray: go ? `${len} ${100 - len}` : '0 100',
                    strokeWidth: active === a.id ? 4.4 : 3.4,
                    opacity: active && active !== a.id ? 0.35 : 1,
                  }}
                  cx={18}
                  cy={18}
                  fill="none"
                  initial={false}
                  key={a.id}
                  pathLength={100}
                  r={15.9155}
                  stroke={a.color}
                  strokeDashoffset={-(a.start + GAP / 2)}
                  transition={{
                    strokeDasharray: {
                      duration: reduce ? 0 : 0.9,
                      delay: reduce ? 0 : i * 0.12,
                      ease: EASE_OUT_STRONG,
                    },
                    strokeWidth: { type: 'spring', stiffness: 400, damping: 28 },
                    opacity: { duration: 0.2 },
                  }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <AnimatedNumber
              className="text-[22px] leading-none font-medium text-(--d2-fg) tabular-nums"
              duration={0.5}
              format={(n) => `${Math.round(n)}%`}
              value={go ? (shown?.share ?? 100) : 0}
            />
            <span className="mt-1 text-[11px] text-(--d2-muted)">
              {shown?.label ?? 'All sources'}
            </span>
          </div>
        </div>

        <ul className="flex min-w-[140px] flex-1 flex-col gap-0.5">
          {sources.map((s) => (
            <li key={s.id}>
              <button
                aria-label={`${s.label}: ${s.share}% of deals`}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-[12px] transition-[opacity,background-color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white/30 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/[0.04]',
                  active && active !== s.id ? 'opacity-45' : 'opacity-100',
                )}
                onBlur={() => setActive(null)}
                onFocus={() => setActive(s.id)}
                onPointerEnter={() => setActive(s.id)}
                onPointerLeave={() => setActive(null)}
                type="button"
              >
                <span className="size-2 rounded-full" style={{ background: s.color }} />
                <span className="flex-1 text-left text-(--d2-muted)">{s.label}</span>
                <span className="font-medium text-(--d2-fg) tabular-nums">{s.share}%</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
