'use client';

import { BellIcon, SearchIcon, SparklesIcon } from 'lucide-react';
import { m } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { currentUser, navItems } from './data';
import { InitialsAvatar } from './initials-avatar';
import { slide } from './motion';

export function TopNav({ approvalCount = 6 }: { approvalCount?: number }) {
  const [active, setActive] = React.useState<string>('Approvals');
  const pillId = React.useId();

  return (
    <div className="flex h-20 shrink-0 items-center gap-4 px-6 py-6 text-white">
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-white">
          <span aria-hidden className="flex w-4 flex-col gap-0.75">
            <span className="h-[2.5px] w-full rounded-full bg-blue-600" />
            <span className="h-[2.5px] w-3/5 rounded-full bg-blue-600" />
            <span className="h-[2.5px] w-4/5 rounded-full bg-blue-600" />
          </span>
        </span>
        <span className="text-[15px] font-semibold tracking-tight">Plenum</span>
      </div>

      <nav
        aria-label="Primary"
        className="ml-2 hidden items-center gap-0.5 rounded-full border border-white/10 bg-white/5 p-1 lg:flex"
      >
        {navItems.map((item) => {
          const isActive = item === active;
          return (
            <button
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors duration-150',
                isActive ? 'text-slate-900' : 'text-white/75 hover:bg-white/10 hover:text-white',
              )}
              key={item}
              onClick={() => setActive(item)}
              type="button"
            >
              {isActive && (
                <m.span
                  className="absolute inset-0 rounded-full bg-white"
                  layoutId={pillId}
                  transition={slide}
                />
              )}
              <span className="relative">{item}</span>
              {item === 'Approvals' && (
                <span className="relative flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                  {approvalCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <button
          aria-label="Search"
          className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/85 transition-colors hover:bg-white/15"
          type="button"
        >
          <SearchIcon className="size-4" />
        </button>
        <button
          aria-label="Notifications"
          className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/85 transition-colors hover:bg-white/15"
          type="button"
        >
          <BellIcon className="size-4" />
        </button>
        <button
          className="flex h-9 items-center gap-2 rounded-full bg-white pr-3 pl-3.5 text-xs font-semibold text-slate-900 transition-colors hover:bg-white/90"
          type="button"
        >
          <SparklesIcon className="size-3.5 text-blue-600" />
          Ask Plenum
          <kbd className="font-sans text-[10px] font-medium text-slate-500">⌘J</kbd>
        </button>
        <InitialsAvatar className="size-9 text-xs ring-white/20" name={currentUser} />
      </div>
    </div>
  );
}
