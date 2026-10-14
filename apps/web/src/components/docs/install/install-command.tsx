'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { type KeyboardEvent, useEffect, useId, useState } from 'react';

import { CopyButton } from '~/components/docs/copy-button';
import { PACKAGE_MANAGERS, type PackageManager } from '~/lib/registry';

const STORAGE_KEY = 'registry-package-manager';

const readStoredManager = (): PackageManager => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return PACKAGE_MANAGERS.includes(stored as PackageManager)
      ? (stored as PackageManager)
      : 'pnpm';
  } catch {
    return 'pnpm';
  }
};

type InstallCommandProps = {
  commands: Record<PackageManager, string>;
};

// Package-manager tabs over a square command line. The choice is remembered across pages.
export const InstallCommand = ({ commands }: InstallCommandProps) => {
  const id = useId();
  const [manager, setManager] = useState<PackageManager>('pnpm');

  // Read after hydration so the server-rendered default never mismatches.
  useEffect(() => {
    setManager(readStoredManager());
  }, []);

  const select = (next: PackageManager) => {
    setManager(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode): the choice just isn't remembered.
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const index = PACKAGE_MANAGERS.indexOf(manager);
    const offset = event.key === 'ArrowRight' ? 1 : -1;
    const next =
      PACKAGE_MANAGERS[(index + offset + PACKAGE_MANAGERS.length) % PACKAGE_MANAGERS.length];
    select(next);
    document.getElementById(`${id}-${next}`)?.focus();
  };

  return (
    <div className="not-prose border border-foreground/10">
      <div
        aria-label="Gestionnaire de paquets"
        className="flex h-9 items-stretch border-b border-foreground/10"
        role="tablist"
      >
        {PACKAGE_MANAGERS.map((item) => {
          const selected = item === manager;

          return (
            <button
              aria-controls={`${id}-panel`}
              aria-selected={selected}
              className={cn(
                'relative border-e border-foreground/10 px-3.5 font-mono text-[0.6875rem] tracking-widest text-foreground/55 transition-colors',
                'hover:bg-foreground/3 hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
                selected &&
                  'bg-foreground/3 text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-foreground',
              )}
              id={`${id}-${item}`}
              key={item}
              onClick={() => select(item)}
              onKeyDown={onKeyDown}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              {item}
            </button>
          );
        })}
      </div>

      <div
        aria-labelledby={`${id}-${manager}`}
        className="flex items-center gap-3 py-1.5 ps-4 pe-1.5"
        id={`${id}-panel`}
        role="tabpanel"
      >
        <code className="min-w-0 flex-1 overflow-x-auto py-1.5 font-mono text-[0.8125rem] whitespace-nowrap text-foreground [scrollbar-width:none]">
          <span aria-hidden="true" className="me-2 text-foreground/35 select-none">
            $
          </span>
          {commands[manager]}
        </code>
        <CopyButton
          className="h-7 shrink-0 rounded-none border-foreground/10 font-mono text-[0.6875rem] tracking-widest uppercase shadow-none"
          value={commands[manager]}
        />
      </div>
    </div>
  );
};
