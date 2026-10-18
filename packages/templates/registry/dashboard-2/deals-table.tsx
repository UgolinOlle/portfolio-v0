'use client';

import { m, useInView } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import type { Deal } from './data';
import { EASE_OUT_STRONG } from './motion';

const stageTone: Record<string, string> = {
  Closing: 'bg-emerald-500/[0.14] text-emerald-400',
  Negotiation: 'bg-orange-500/[0.14] text-orange-400',
  Proposal: 'bg-blue-500/[0.14] text-blue-400',
  Qualified: 'bg-violet-500/[0.14] text-violet-400',
  Prospecting: 'bg-white/[0.07] text-(--d2-muted)',
};

export function DealsTable({ deals }: { deals: Deal[] }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const go = useInView(ref, { once: true, margin: '0px 0px -8% 0px' });

  return (
    <section
      aria-labelledby="d2-deals"
      className="rounded-[22px] border border-(--d2-line) bg-(--d2-card) px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
      ref={ref}
    >
      <div className="flex items-baseline justify-between px-2">
        <h2 className="text-[16px] font-medium text-(--d2-fg)" id="d2-deals">
          Deals closing soon
        </h2>
        <span className="text-[12px] text-(--d2-muted)">Next 14 days</span>
      </div>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[480px] border-separate border-spacing-0 text-left text-[12px]">
          <thead>
            <tr className="text-(--d2-dim)">
              {['Deal', 'Stage', 'Amount', 'Close', 'Win chance'].map((h, i) => (
                <th
                  className={cn(
                    'px-2 py-2 font-medium',
                    i === 2 && 'text-right',
                    i === 3 && 'hidden @xl/main:table-cell',
                    i === 4 && 'hidden @2xl/main:table-cell',
                  )}
                  key={h}
                  scope="col"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deals.map((d, i) => (
              <m.tr
                animate={go ? { opacity: 1, transform: 'translateY(0px)' } : undefined}
                className="group"
                initial={{ opacity: 0, transform: 'translateY(6px)' }}
                key={d.id}
                transition={{ duration: 0.35, delay: i * 0.06, ease: EASE_OUT_STRONG }}
              >
                <td className="rounded-l-xl border-t border-(--d2-line) px-2 py-2.5 transition-colors group-hover:bg-white/[0.03]">
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-[10px] font-medium text-(--d2-fg)"
                    >
                      {d.owner}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-(--d2-fg)">{d.company}</span>
                      <span className="block truncate text-(--d2-muted)">{d.name}</span>
                    </span>
                  </div>
                </td>
                <td className="border-t border-(--d2-line) px-2 transition-colors group-hover:bg-white/[0.03]">
                  <span
                    className={cn(
                      'inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-medium',
                      stageTone[d.stage],
                    )}
                  >
                    {d.stage}
                  </span>
                </td>
                <td className="border-t border-(--d2-line) px-2 text-right font-medium text-(--d2-fg) tabular-nums transition-colors group-hover:bg-white/[0.03]">
                  ${d.amount}K
                </td>
                <td className="hidden border-t border-(--d2-line) px-2 text-(--d2-muted) transition-colors group-hover:bg-white/[0.03] @xl/main:table-cell">
                  {d.close}
                </td>
                <td className="hidden rounded-r-xl border-t border-(--d2-line) px-2 transition-colors group-hover:bg-white/[0.03] @2xl/main:table-cell">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.07]">
                      <m.span
                        animate={{ transform: go ? `scaleX(${d.probability / 100})` : 'scaleX(0)' }}
                        className="block h-full origin-left rounded-full bg-(--d2-orange)"
                        initial={false}
                        transition={{ duration: 0.8, delay: 0.2 + i * 0.06, ease: EASE_OUT_STRONG }}
                      />
                    </span>
                    <span className="text-(--d2-muted) tabular-nums">{d.probability}%</span>
                  </div>
                </td>
              </m.tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
