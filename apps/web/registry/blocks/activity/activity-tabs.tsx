'use client';

import { motion } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import type { ActivityTab } from './types';

export interface ActivityTabsProps {
  tabs: ActivityTab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function ActivityTabs({ tabs, activeTab, onChange, className }: ActivityTabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-1 overflow-x-auto rounded-full bg-foreground/5 p-1',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className="relative flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
          >
            {isActive && (
              <motion.span
                layoutId="activity-tabs-active-pill"
                className="absolute inset-0 rounded-full bg-card shadow-sm"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}

            <span
              className={cn(
                'relative z-10 flex items-center gap-2',
                !isActive && 'text-muted-foreground',
              )}
              style={isActive ? { color: tab.color } : undefined}
            >
              {tab.icon ?? (
                <span className="size-1.5 rounded-full" style={{ backgroundColor: tab.color }} />
              )}

              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
