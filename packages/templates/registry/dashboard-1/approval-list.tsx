'use client';

import { SearchIcon } from 'lucide-react';
import { m } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { ApprovalCard } from './approval-card';
import type { Approval } from './data';
import { QuickContext, enter, enterQuick, rise, slide, stagger } from './motion';

type Tab = 'me' | 'team' | 'done';

export function ApprovalList({
  approvals,
  selectedId,
  onSelect,
  doneCount = 3,
}: {
  approvals: Approval[];
  selectedId: string;
  onSelect: (id: string) => void;
  doneCount?: number;
}) {
  const [tab, setTab] = React.useState<Tab>('me');
  const [query, setQuery] = React.useState('');
  // The first paint plays the full entrance; later tab switches are quick.
  const [quick, setQuick] = React.useState(false);
  const id = React.useId();

  const you = approvals.filter((a) => a.section === 'you');
  const team = approvals.filter((a) => a.section === 'team');

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'me', label: 'On me', count: you.length },
    { id: 'team', label: 'My team', count: team.length },
    { id: 'done', label: 'Done today', count: doneCount },
  ];

  const q = query.trim().toLowerCase();
  const matches = (a: Approval) =>
    !q || `${a.id} ${a.title} ${a.subtitle} ${a.person}`.toLowerCase().includes(q);

  const sections: { id: string; label: string; items: Approval[] }[] =
    tab === 'done'
      ? []
      : [
          ...(tab === 'me' ? [{ id: 'you', label: 'On you', items: you.filter(matches) }] : []),
          { id: 'team', label: 'On your team', items: team.filter(matches) },
        ];
  const visible = sections.filter((s) => s.items.length > 0);

  return (
    <m.div
      animate="visible"
      className="flex min-h-0 flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm"
      initial="hidden"
      transition={enter}
      variants={rise}
    >
      <div className="relative grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1" role="tablist">
        {tabs.map((t) => (
          <button
            aria-selected={tab === t.id}
            className={cn(
              'relative h-8 rounded-lg text-xs font-medium transition-colors duration-150',
              tab === t.id ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800',
            )}
            key={t.id}
            onClick={() => {
              setQuick(true);
              setTab(t.id);
            }}
            role="tab"
            type="button"
          >
            {tab === t.id && (
              <m.span
                className="absolute inset-0 rounded-lg bg-white shadow-sm"
                layoutId={`${id}-tab`}
                transition={slide}
              />
            )}
            <span className="relative">
              {t.label} · {t.count}
            </span>
          </button>
        ))}
      </div>

      <label className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-slate-400 transition-colors duration-150 focus-within:border-blue-400">
        <SearchIcon className="size-3.5" />
        <input
          className="min-w-0 flex-1 bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search approvals, records, people"
          value={query}
        />
        <kbd className="rounded border border-slate-200 px-1.5 font-sans text-[10px] text-slate-500">
          ⌘K
        </kbd>
      </label>

      <QuickContext.Provider value={quick}>
        <m.div
          animate="visible"
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto"
          initial="hidden"
          key={tab}
          layoutScroll
          transition={quick ? enterQuick : enter}
          variants={stagger(quick, 0.1, 0.04)}
        >
          {visible.length === 0 && (
            <m.p className="py-10 text-center text-xs text-slate-500" variants={rise}>
              {tab === 'done'
                ? 'Nothing to show for today yet.'
                : 'No approvals match your search.'}
            </m.p>
          )}
          {visible.map((section) => (
            <section className="flex flex-col gap-2" key={section.id}>
              <m.h2
                className="px-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase"
                variants={rise}
              >
                {section.label}
              </m.h2>
              {section.items.map((approval) => (
                <ApprovalCard
                  approval={approval}
                  key={approval.id}
                  onSelect={onSelect}
                  selected={approval.id === selectedId}
                  selectionId={`${id}-selection`}
                />
              ))}
            </section>
          ))}
        </m.div>
      </QuickContext.Provider>
    </m.div>
  );
}
