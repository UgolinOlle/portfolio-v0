import { BarChart3Icon } from 'lucide-react';

import type { Stat } from './data';

export function SubHeader({ stats }: { stats: Stat[] }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 px-6 pt-3 pb-6 text-white">
      <div>
        <p className="text-[11px] text-white/60">
          Approvals <span className="px-1">/</span>
          <span className="font-medium text-white">Inbox</span>
        </p>
        <h1 className="mt-1.5 text-3xl font-semibold tracking-tight">Approval inbox</h1>
        <p className="mt-1 text-xs text-white/60">Agents prepare the evidence, you decide</p>
      </div>

      <dl className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/40 py-2 pr-5 pl-2">
        <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-sky-300">
          <BarChart3Icon className="size-4" />
        </span>
        {stats.map((stat, i) => (
          <div
            className={
              i > 0
                ? 'flex items-baseline gap-2 border-l border-white/15 pl-4'
                : 'flex items-baseline gap-2'
            }
            key={stat.label}
          >
            <dt className="text-xs text-white/60">{stat.label}</dt>
            <dd className="text-lg font-semibold">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
