'use client';

import { Moon, Sun } from 'lucide-react';
import { m } from 'motion/react';

import { cn } from '@/lib/utils';

import { LAYOUT, STAGGER } from './motion';
import { describeOffset, formatTime, formatUtc, to12h, type CityView } from './time';

export function CityList({
  views,
  selectedId,
  onSelect,
  pillId,
}: {
  views: CityView[];
  selectedId: string;
  onSelect: (id: string) => void;
  pillId: string;
}) {
  return (
    <m.ul
      animate="visible"
      aria-label="Cities"
      className="flex flex-col gap-2"
      initial="hidden"
      transition={{ staggerChildren: STAGGER }}
    >
      {views.map((view) => {
        const active = view.id === selectedId;
        const { hour12, meridiem } = to12h(view.hour);
        const Icon = view.isDay ? Sun : Moon;

        return (
          <m.li
            key={view.id}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            variants={{
              hidden: { opacity: 0, transform: 'translateY(6px)' },
              visible: { opacity: 1, transform: 'translateY(0px)' },
            }}
          >
            <button
              aria-label={`${view.name}, ${formatTime(view)}, ${view.isHome ? 'home' : describeOffset(view)}${view.dayShift ? (view.dayShift > 0 ? ', next day' : ', previous day') : ''}`}
              aria-pressed={active}
              className={cn(
                'relative flex w-full items-center gap-2.5 rounded-2xl px-3 py-3.5 text-left outline-none @xs:gap-4 @xs:px-4',
                'transition-transform duration-150 ease-out focus-visible:ring-2 focus-visible:ring-[color:var(--wc-focus)] active:scale-[0.99]',
              )}
              onClick={() => onSelect(view.id)}
              type="button"
            >
              {active && (
                <m.span
                  className="absolute inset-0 rounded-2xl border border-[color:var(--wc-line)] bg-[color:var(--wc-card)]"
                  layoutId={pillId}
                  transition={LAYOUT}
                />
              )}
              <Icon
                aria-hidden
                className={cn(
                  'relative size-[1.125rem] shrink-0 transition-colors duration-300 @max-xs:hidden',
                  view.isDay ? 'text-[color:var(--wc-day)]' : 'text-[color:var(--wc-muted)]',
                )}
                strokeWidth={1.75}
              />
              <span className="relative min-w-0 flex-1">
                <span className="block text-[0.9375rem] font-medium wrap-break-word text-[color:var(--wc-text)] @xs:truncate">
                  {view.name}
                </span>
                <span className="block text-[0.8125rem] wrap-break-word text-[color:var(--wc-muted)] @xs:truncate">
                  {view.isHome
                    ? `Home · ${formatUtc(view.offsetMin)}`
                    : `${formatUtc(view.offsetMin)} · ${describeOffset(view)}`}
                </span>
              </span>
              {view.dayShift !== 0 && (
                <span className="relative shrink-0 rounded-full border border-[color:var(--wc-line)] bg-[color:var(--wc-tint)] px-2.5 py-1 text-xs leading-none text-[color:var(--wc-muted)]">
                  {view.dayShift > 0 ? '+1 day' : '−1 day'}
                </span>
              )}
              <span
                aria-hidden
                className="relative shrink-0 text-right text-lg font-medium tracking-tight text-[color:var(--wc-text)] tabular-nums @xs:text-xl"
              >
                {hour12}:{String(view.minute).padStart(2, '0')}
                <span className="ml-1 text-sm font-normal text-[color:var(--wc-muted)]">
                  {meridiem}
                </span>
              </span>
            </button>
          </m.li>
        );
      })}
    </m.ul>
  );
}
