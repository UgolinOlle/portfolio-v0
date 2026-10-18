'use client';

import { LayoutGridIcon, RefreshCwIcon, SearchIcon } from 'lucide-react';
import { m, useAnimate } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { tabs } from './data';
import type { Notice } from './data';
import { slide } from './motion';
import { Notifications } from './notifications';

/** Page bar: title on the left, search trigger and notifications on the right. */
export function TopBar({
  title = 'Home',
  notices,
  onSearch,
  searchRef,
}: {
  title?: string;
  notices: Notice[];
  onSearch: () => void;
  searchRef?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <header className="flex h-[52px] shrink-0 items-center gap-3 border-b border-(--d2-line) px-5 @4xl/dash:px-6">
      <LayoutGridIcon aria-hidden className="size-4 text-(--d2-muted)" strokeWidth={1.8} />
      <h1 className="text-[13px] font-medium text-(--d2-fg)">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        <button
          aria-keyshortcuts="Meta+K Control+K"
          aria-label="Search deals, people"
          className="flex h-9 items-center gap-2.5 rounded-xl border border-(--d2-line) bg-white/[0.02] px-3 text-(--d2-muted) transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white/30 @xl/main:w-[260px] [@media(hover:hover)_and_(pointer:fine)]:hover:border-white/20 [@media(hover:hover)_and_(pointer:fine)]:hover:text-(--d2-fg)"
          onClick={onSearch}
          ref={searchRef}
          type="button"
        >
          <SearchIcon aria-hidden className="size-[15px] shrink-0" strokeWidth={1.8} />
          <span className="hidden flex-1 text-left text-[12px] @xl/main:inline">
            Search deals, people
          </span>
          <kbd className="hidden rounded-md bg-white/[0.07] px-1.5 py-0.5 font-sans text-[10px] font-medium @xl/main:inline">
            ⌘K
          </kbd>
        </button>
        <Notifications initial={notices} />
      </div>
    </header>
  );
}

export function PageIntro({
  date,
  summary,
  tab,
  onTabChange,
}: {
  date: string;
  summary: string;
  tab: string;
  onTabChange: (tab: string) => void;
}) {
  const [scope, animate] = useAnimate();
  const [syncedAt, setSyncedAt] = React.useState('Synced just now');
  const underlineId = React.useId();

  const sync = () => {
    // Retargets from the current angle, so rapid clicks keep spinning instead of restarting.
    animate(
      scope.current,
      { transform: 'rotate(360deg)' },
      { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
    ).then(() => animate(scope.current, { transform: 'rotate(0deg)' }, { duration: 0 }));
    setSyncedAt('Synced just now');
  };

  return (
    <div>
      <div className="flex items-center gap-2.5 text-[13px] font-medium text-(--d2-fg)">
        <span>{date}</span>
        <button
          aria-label="Sync data"
          className="flex size-7 items-center justify-center rounded-full text-(--d2-fg) transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white/30 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/[0.07]"
          onClick={sync}
          title={syncedAt}
          type="button"
        >
          <span className="flex" ref={scope}>
            <RefreshCwIcon aria-hidden className="size-[15px]" strokeWidth={1.8} />
          </span>
        </button>
        <span aria-live="polite" className="sr-only">
          {syncedAt}
        </span>
      </div>
      <p className="mt-2 text-[13px] text-(--d2-muted) @3xl/main:text-[13px]">{summary}</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div aria-label="Dashboard sections" className="flex gap-5" role="tablist">
          {tabs.map((t) => {
            const isActive = t === tab;
            return (
              <button
                aria-selected={isActive}
                className={cn(
                  'relative pb-3 text-[13px] font-medium transition-colors duration-150 outline-none focus-visible:text-(--d2-fg)',
                  isActive
                    ? 'text-(--d2-fg)'
                    : 'text-(--d2-muted) [@media(hover:hover)_and_(pointer:fine)]:hover:text-(--d2-fg)',
                )}
                key={t}
                onClick={() => onTabChange(t)}
                role="tab"
                type="button"
              >
                {t}
                {isActive && (
                  <m.span
                    className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-(--d2-orange)"
                    layoutId={underlineId}
                    transition={slide}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div aria-hidden className="-mt-px border-t border-(--d2-line)" />
    </div>
  );
}
