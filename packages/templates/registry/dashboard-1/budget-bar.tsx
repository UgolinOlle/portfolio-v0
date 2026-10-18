'use client';

import { m } from 'motion/react';

import type { ApprovalDetailData } from './data';
import { labelFade, reveal, rise, useQuick } from './motion';

const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

export function BudgetBar({ budget }: { budget: ApprovalDetailData['budget'] }) {
  const quick = useQuick();
  const total = budget.committed + budget.purchase + budget.forecast;
  const scale = total * 1.03;
  const pct = (n: number) => `${(n / scale) * 100}%`;
  const fade = labelFade(quick);

  return (
    <m.section className="rounded-xl border border-slate-200 p-4" variants={rise}>
      <h3 className="text-sm font-semibold text-slate-900">{budget.title}</h3>
      <p className="text-xs text-slate-500">{budget.caption}</p>

      <div className="relative mt-8 mb-2">
        <m.span
          className="absolute -top-5 -translate-x-full pr-1.5 text-[11px] font-medium whitespace-nowrap text-slate-700"
          style={{ left: pct(budget.limit) }}
          variants={fade}
        >
          Budget {usd(budget.limit)}
        </m.span>
        <m.span
          className="absolute -top-5 -translate-x-full pr-1.5 text-[11px] font-semibold whitespace-nowrap text-red-600"
          style={{ left: pct(total), top: '2rem' }}
          variants={fade}
        >
          New {usd(total)}
        </m.span>

        <m.div
          aria-label={`Committed ${usd(budget.committed)}, this purchase ${usd(budget.purchase)}, forecast ${usd(budget.forecast)}`}
          className="flex h-3.5 w-full overflow-hidden rounded-full bg-slate-100"
          role="img"
          variants={reveal(quick)}
        >
          <span className="bg-blue-600" style={{ width: pct(budget.committed) }} />
          <span className="bg-amber-400" style={{ width: pct(budget.purchase) }} />
          <span className="bg-blue-300" style={{ width: pct(budget.forecast) }} />
        </m.div>
        <m.span
          aria-hidden
          className="absolute -top-1 h-6 w-0.5 rounded bg-slate-900"
          style={{ left: pct(budget.limit) }}
          variants={fade}
        />
      </div>

      <m.ul className="mt-9 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600" variants={fade}>
        {[
          ['bg-blue-600', 'Committed', budget.committed],
          ['bg-amber-400', 'This purchase', budget.purchase],
          ['bg-blue-300', 'Forecast to complete', budget.forecast],
        ].map(([dot, label, value]) => (
          <li className="flex items-center gap-1.5" key={label as string}>
            <span className={`size-1.5 rounded-full ${dot}`} />
            {label}
            <span className="font-semibold text-slate-900">{usd(value as number)}</span>
          </li>
        ))}
      </m.ul>
    </m.section>
  );
}
