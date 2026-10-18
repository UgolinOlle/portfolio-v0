'use client';

import { AnimatePresence, LazyMotion, MotionConfig, domMax, m } from 'motion/react';
import * as React from 'react';

import type { SearchItem } from '@/components/blocks/command-search';
import { cn } from '@/lib/utils';

import { ActivityFeed } from './activity-feed';
import { CommandPalette } from './command-palette';
import {
  activity as defaultActivity,
  deals as defaultDeals,
  kpis as defaultKpis,
  notices as defaultNotices,
  sources as defaultSources,
  stages as defaultStages,
  tasks as defaultTasks,
} from './data';
import type { ActivityEntry, Deal, Kpi, Notice, Source, Stage, Task } from './data';
import { DealsTable } from './deals-table';
import { PageIntro, TopBar } from './header';
import { KpiCard } from './kpi-card';
import { EASE_OUT_STRONG, enter, rise, slideIn, stagger, stage } from './motion';
import { RevenueCard } from './revenue-card';
import { Sidebar } from './sidebar';
import { SourceDonut } from './source-donut';
import { StageChart } from './stage-chart';
import { TaskRail } from './task-rail';
import { Toast } from './toast';
import type { ToastMessage } from './toast';

export type { Deal, Kpi, MonthPoint, Source, Stage, Task } from './data';
export { DealsTable } from './deals-table';
export { Sparkline } from './sparkline';
export { SourceDonut } from './source-donut';
export { StageChart } from './stage-chart';
export { AnimatedNumber } from './animated-number';
export { EvilChart } from './evil-chart';
export { KpiCard } from './kpi-card';
export { RevenueCard } from './revenue-card';
export { ActivityFeed } from './activity-feed';
export { CommandPalette } from './command-palette';
export { Sidebar } from './sidebar';
export { TaskRail } from './task-rail';

/** Dark theme tokens, scoped to the template so it does not depend on the host's theme. */
const tokens = {
  '--d2-bg': '#0a0a0a',
  '--d2-sidebar': '#131313',
  '--d2-card': '#0f0f0f',
  '--d2-line': 'rgba(255,255,255,0.08)',
  '--d2-fg': '#f5f5f5',
  '--d2-muted': '#8d8d8d',
  '--d2-dim': '#5c5c5c',
  '--d2-orange': '#ff6b2c',
} as React.CSSProperties;

const appear = (delay: number) => ({
  initial: 'hidden',
  animate: 'visible',
  variants: rise,
  transition: { ...enter, delay },
});

export interface Dashboard2Props {
  kpis?: Kpi[];
  tasks?: Task[];
  stages?: Stage[];
  sources?: Source[];
  deals?: Deal[];
  activity?: ActivityEntry[];
  notices?: Notice[];
  /** Items for the ⌘K search. Defaults to demo deals, people, companies and tasks. */
  searchItems?: SearchItem[];
  onSearchSelect?: (item: SearchItem) => void;
  /** Line under the page title, e.g. `Thursday, 16 October`. */
  date?: string;
  summary?: string;
  /** Fill the parent (which must have a height) instead of the viewport, e.g. in docs previews. */
  contained?: boolean;
  className?: string;
}

export function Dashboard2({
  kpis = defaultKpis,
  tasks = defaultTasks,
  stages = defaultStages,
  sources = defaultSources,
  deals = defaultDeals,
  activity = defaultActivity,
  notices = defaultNotices,
  searchItems,
  onSearchSelect,
  date = 'Thursday, 16 October',
  summary = '6 deals close this week and 3 follow-ups are overdue.',
  contained = false,
  className,
}: Dashboard2Props) {
  const [nav, setNav] = React.useState('home');
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = React.useState(false);
  // `null` follows the container width; a click on the toggle pins the user's choice.
  const [pinned, setPinned] = React.useState<boolean | null>(null);
  const collapsed = pinned ?? narrow;

  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const searchBtn = React.useRef<HTMLButtonElement>(null);
  const [toast, setToast] = React.useState<ToastMessage | null>(null);
  const notify = React.useCallback((text: string) => {
    setToast({ id: Date.now(), text });
  }, []);
  React.useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(t);
  }, [toast]);

  const closePalette = React.useCallback(() => {
    setPaletteOpen(false);
    searchBtn.current?.focus();
  }, []);

  // ⌘K / Ctrl+K only while focus is inside this dashboard, so it never hijacks the host page.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      setPaletteOpen((o) => !o);
    }
  };

  React.useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const read = () => setNarrow(el.clientWidth < 900);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const [tab, setTab] = React.useState('Overview');

  return (
    // Not `strict`: the embedded CommandSearch is built with the full `motion` component.
    <LazyMotion features={domMax}>
      <MotionConfig reducedMotion="user" transition={enter}>
        <div
          className={cn(
            '@container/dash relative flex w-full bg-(--d2-bg) text-(--d2-fg) antialiased',
            contained ? 'h-full min-h-0' : 'h-screen',
            className,
          )}
          onKeyDown={onKeyDown}
          ref={rootRef}
          style={tokens}
        >
          <m.div
            animate="visible"
            className="relative z-30 flex shrink-0"
            initial="hidden"
            transition={{ ...enter, delay: stage.sidebar }}
            variants={slideIn}
          >
            <Sidebar
              active={nav}
              collapsed={collapsed}
              onNavigate={setNav}
              onToggle={() => setPinned(!collapsed)}
            />
          </m.div>

          <div className="@container/main flex min-w-0 flex-1 flex-col">
            {/* Own stacking level: the bar's popover must paint above the scrolling content. */}
            <m.div className="relative z-20" {...appear(stage.header)}>
              <TopBar
                notices={notices}
                onSearch={() => setPaletteOpen(true)}
                searchRef={searchBtn}
              />
            </m.div>

            <main className="min-h-0 flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-[1100px] px-5 py-6 @4xl/dash:px-6 @4xl/dash:py-7">
                <m.div {...appear(stage.header)}>
                  <PageIntro date={date} onTabChange={setTab} summary={summary} tab={tab} />
                </m.div>

                <m.div
                  animate="visible"
                  className="mt-5 grid grid-cols-1 gap-4 @xl/main:grid-cols-3"
                  initial="hidden"
                  variants={stagger(stage.kpis, 0.07)}
                >
                  {kpis.map((kpi, i) => (
                    <KpiCard index={i} key={kpi.id} kpi={kpi} />
                  ))}
                </m.div>

                <AnimatePresence initial={false} mode="wait">
                  <m.div
                    animate={{ opacity: 1, transform: 'translateY(0px)' }}
                    className="mt-4 flex flex-col gap-4"
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    initial={{ opacity: 0, transform: 'translateY(6px)' }}
                    key={tab}
                    role="tabpanel"
                    transition={{ duration: 0.25, ease: EASE_OUT_STRONG }}
                  >
                    {tab === 'Overview' && (
                      <>
                        <div className="grid grid-cols-1 items-start gap-4 @4xl/main:grid-cols-[minmax(0,1fr)_280px]">
                          <div className="min-w-0">
                            <RevenueCard />
                          </div>
                          <TaskRail initial={tasks} />
                        </div>
                        <div className="grid grid-cols-1 gap-4 @4xl/main:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                          <StageChart stages={stages} />
                          <SourceDonut sources={sources} />
                        </div>
                        <DealsTable deals={deals} />
                      </>
                    )}
                    {tab === 'Pipeline' && (
                      <>
                        <div className="grid grid-cols-1 gap-4 @4xl/main:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                          <StageChart stages={stages} />
                          <SourceDonut sources={sources} />
                        </div>
                        <DealsTable deals={deals} />
                      </>
                    )}
                    {tab === 'Activity' && (
                      <div className="grid grid-cols-1 items-start gap-4 @4xl/main:grid-cols-[minmax(0,1fr)_280px]">
                        <ActivityFeed entries={activity} />
                        <TaskRail initial={tasks} />
                      </div>
                    )}
                    {tab === 'Forecast' && <RevenueCard />}
                  </m.div>
                </AnimatePresence>
              </div>
            </main>
          </div>

          <CommandPalette
            items={searchItems}
            onClose={closePalette}
            onSelect={(item) => {
              closePalette();
              notify(`Opened “${item.title}”`);
              onSearchSelect?.(item);
            }}
            open={paletteOpen}
          />
          <Toast message={toast} />
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
