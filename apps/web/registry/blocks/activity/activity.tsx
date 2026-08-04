'use client';

import { AnimatePresence, motion, type Variants } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { ActivityHeader } from './activity-header';
import { ActivityHeatmap } from './activity-heatmap';
import { ActivityLegend } from './activity-legend';
import { ActivityStats } from './activity-stats';
import { ActivityTabs } from './activity-tabs';
import type { ActivityTab } from './types';
import { computeActivityStreaks, sumActivityValues } from './utils';

export interface ActivityProps {
  title?: string;
  period?: string;
  tabs: ActivityTab[];

  /** Uncontrolled initial tab. Defaults to the first tab. */
  defaultTab?: string;

  /** Controlled active tab id. */
  activeTab?: string;
  onTabChange?: (id: string) => void;
  onRefresh?: () => void;

  /** Full override for the refresh button. */
  refreshButton?: React.ReactNode;

  /** Number of intensity levels, including the empty level 0. */
  levels?: number;
  cellSize?: number;
  cellGap?: number;
  cellRadius?: number;
  weeks?: number;
  dayLabels?: (string | undefined)[];
  showMonthLabels?: boolean;
  legendLabels?: { less?: string; more?: string };

  /** Disable the tab-switch motion animations. */
  animated?: boolean;

  className?: string;
}

const contentVariants: Variants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? 32 : -32,
    opacity: 0,
    scale: 0.98,
    filter: 'blur(8px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
  },
  exit: (direction: number) => ({
    x: direction >= 0 ? -32 : 32,
    opacity: 0,
    scale: 0.98,
    filter: 'blur(8px)',
  }),
};

export function Activity({
  title = 'Activity',
  period,
  tabs,
  defaultTab,
  activeTab: controlledTab,
  onTabChange,
  onRefresh,
  refreshButton,
  levels = 5,
  cellSize = 11,
  cellGap = 3,
  cellRadius = 3,
  weeks = 48,
  dayLabels,
  showMonthLabels = true,
  legendLabels,
  animated = true,
  className,
}: ActivityProps) {
  const [internalTab, setInternalTab] = React.useState(defaultTab ?? tabs[0]?.id);
  const activeId = controlledTab ?? internalTab ?? tabs[0]?.id;
  const activeTabData = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  // Direction is derived from each tab's position in `tabs`, not from clicks: this keeps it
  // correct whether the active tab changes via a click or via the controlled `activeTab` prop.
  // Updating state during render (React's documented pattern for "adjusting state when a prop
  // changes") avoids the one-frame flash a `useEffect` would introduce.
  const [prevTabId, setPrevTabId] = React.useState(activeTabData?.id);
  const [direction, setDirection] = React.useState(0);

  if (activeTabData && activeTabData.id !== prevTabId) {
    const oldIndex = tabs.findIndex((tab) => tab.id === prevTabId);
    const newIndex = tabs.findIndex((tab) => tab.id === activeTabData.id);

    setDirection(newIndex > oldIndex ? 1 : newIndex < oldIndex ? -1 : 0);
    setPrevTabId(activeTabData.id);
  }

  const handleChange = (id: string) => {
    setInternalTab(id);
    onTabChange?.(id);
  };

  if (!activeTabData) return null;

  const streaks = computeActivityStreaks(activeTabData.data);
  const total = sumActivityValues(activeTabData.data);

  const active = activeTabData.stats?.active ?? { label: 'Active', value: `${streaks.active}d` };
  const longest = activeTabData.stats?.longest ?? {
    label: 'Longest',
    value: `${streaks.longest}d`,
  };
  const current = activeTabData.stats?.current ?? {
    label: 'Current',
    value: `${streaks.current}d`,
  };

  return (
    <div
      className={cn('w-full max-w-4xl rounded-3xl border border-border/60 bg-muted p-3', className)}
    >
      <div className="space-y-3 px-1.5 pt-1">
        <ActivityHeader
          title={title}
          period={period}
          onRefresh={onRefresh}
          refreshButton={refreshButton}
        />

        <ActivityTabs tabs={tabs} activeTab={activeTabData.id} onChange={handleChange} />
      </div>

      <div className="relative mt-3 overflow-hidden rounded-2xl border border-border/40 bg-card p-4 shadow-sm">
        <div className="grid">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={activeTabData.id}
              custom={direction}
              variants={animated ? contentVariants : undefined}
              initial={animated ? 'enter' : false}
              animate={animated ? 'center' : undefined}
              exit={animated ? 'exit' : undefined}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ gridArea: '1 / 1' }}
            >
              <p className="text-sm text-muted-foreground">
                {activeTabData.summary ?? (
                  <>
                    <span className="font-semibold text-foreground">{total.toLocaleString()}</span>{' '}
                    {activeTabData.unit ?? 'entries'} in the last year
                  </>
                )}
              </p>

              <div className="mt-4">
                <ActivityHeatmap
                  data={activeTabData.data}
                  color={activeTabData.color}
                  categoryLabel={activeTabData.label}
                  unit={activeTabData.unit}
                  levels={levels}
                  cellSize={cellSize}
                  cellGap={cellGap}
                  cellRadius={cellRadius}
                  weeks={weeks}
                  dayLabels={dayLabels}
                  showMonthLabels={showMonthLabels}
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-border/60 pt-3">
                <ActivityStats
                  color={activeTabData.color}
                  active={active}
                  longest={longest}
                  current={current}
                />

                <ActivityLegend
                  color={activeTabData.color}
                  levels={levels}
                  lessLabel={legendLabels?.less}
                  moreLabel={legendLabels?.more}
                  cellSize={cellSize - 1}
                  cellRadius={cellRadius}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export type { ActivityDataPoint, ActivityStat, ActivityTab, ActivityTabStats } from './types';
