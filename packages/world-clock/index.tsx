'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { AnimatePresence, LazyMotion, MotionConfig, domMax, m } from 'motion/react';
import { useEffect, useId, useMemo, useState, type ComponentProps } from 'react';

import { cn } from '@/lib/utils';

import { CityList } from './city-list';
import { DEFAULT_CITIES, DEFAULT_HOME_ID, type ClockCity } from './data';
import { Dial } from './dial';
import { SWAP } from './motion';
import { Odometer } from './odometer';
import { buildViews, describeOffset, formatTime, formatDelta } from './time';

export type { ClockCity } from './data';

export type WorldClockProps = Omit<ComponentProps<'section'>, 'children'> & {
  cities?: ClockCity[];
  /** Id of the home city; every offset is measured from it. */
  homeId?: string;
  /** Id of the city shown on open. Defaults to the home city. */
  defaultSelectedId?: string;
  /** Freeze the clock on this instant (stories, screenshots). Omit for the live time. */
  now?: Date;
  onSelectedChange?: (id: string) => void;
  /** `auto` follows the page's `.dark` class. */
  theme?: 'auto' | 'light' | 'dark';
  /** Click sound while the sun moves; the speaker button toggles it. Default on. */
  sound?: boolean;
};

/*
  Light and dark tokens, scoped to the clock. `theme="auto"` follows a `.dark` ancestor (what
  next-themes and shadcn set), so it matches the rest of the page; force one with `theme`.
*/
const THEME_CSS = `
.wc{--wc-bg:#f3f3f0;--wc-face:#fff;--wc-card:#fff;--wc-line:rgb(0 0 0/.11);--wc-tint:rgb(0 0 0/.04);--wc-text:#17171a;--wc-muted:#6c6c72;--wc-day:#1c9a55;--wc-hand:#17171a;--wc-focus:#2563eb}
.wc[data-wc-theme=dark],:is(.dark,[data-theme=dark]) .wc[data-wc-theme=auto]{--wc-bg:#0e0e10;--wc-face:#161618;--wc-card:#212124;--wc-line:rgb(255 255 255/.1);--wc-tint:rgb(255 255 255/.04);--wc-text:#f4f4f2;--wc-muted:#8e8e93;--wc-day:#6fd392;--wc-hand:#fff;--wc-focus:#9bc4ff}
@keyframes wc-pulse{0%{transform:scale(1);opacity:.55}70%,100%{transform:scale(1.55);opacity:0}}
`;

/** Current time, re-read on every minute boundary so the hand and digits tick together. */
function useNow(frozen?: Date) {
  const [now, setNow] = useState<Date | null>(frozen ?? null);

  useEffect(() => {
    if (frozen) {
      setNow(frozen);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const current = new Date();
      setNow(current);
      timer = setTimeout(tick, 60_000 - (current.getTime() % 60_000) + 50);
    };
    tick();
    // Timers are throttled in background tabs and stop in sleep: resync as soon as we are back.
    const resync = () => {
      if (document.visibilityState === 'visible') {
        clearTimeout(timer);
        tick();
      }
    };
    document.addEventListener('visibilitychange', resync);
    window.addEventListener('focus', resync);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', resync);
      window.removeEventListener('focus', resync);
    };
  }, [frozen]);

  return now;
}

export function WorldClock({
  cities = DEFAULT_CITIES,
  homeId = DEFAULT_HOME_ID,
  defaultSelectedId,
  now: frozenNow,
  onSelectedChange,
  theme = 'auto',
  sound: soundProp = true,
  className,
  ...props
}: WorldClockProps) {
  const pillId = useId();
  const [sound, setSound] = useState(soundProp);
  /** How far the user has dragged the clock away from the real time, in minutes. */
  const [shift, setShift] = useState(0);
  const liveNow = useNow(frozenNow);
  const now = useMemo(
    () => (liveNow ? new Date(liveNow.getTime() + shift * 60_000) : null),
    [liveNow, shift],
  );
  const [selectedId, setSelectedId] = useState(defaultSelectedId ?? homeId);

  const views = useMemo(() => (now ? buildViews(cities, homeId, now) : []), [cities, homeId, now]);
  const selected = views.find((view) => view.id === selectedId) ?? views[0];

  const select = (id: string) => {
    setSelectedId(id);
    onSelectedChange?.(id);
  };

  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">
        <style>{THEME_CSS}</style>
        <section
          aria-label="World clock"
          className={cn(
            'wc @container w-full rounded-3xl bg-[color:var(--wc-bg)] p-5 text-[color:var(--wc-text)] @2xl:p-8',
            className,
          )}
          data-wc-theme={theme}
          {...props}
        >
          {selected ? (
            <div className="grid grid-cols-1 items-center gap-8 @2xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] @2xl:gap-12">
              <div className="mx-auto w-full max-w-[26rem]">
                <Dial
                  onScrub={(delta) => setShift((value) => value + delta)}
                  onSelect={select}
                  sound={sound}
                  selected={selected}
                  views={views}
                >
                  <div className="grid">
                    <AnimatePresence initial={false}>
                      <m.div
                        key={selected.id}
                        animate={{ opacity: 1, transform: 'translateY(0px)' }}
                        className="col-start-1 row-start-1"
                        exit={{ opacity: 0, transform: 'translateY(-4px)' }}
                        initial={{ opacity: 0, transform: 'translateY(4px)' }}
                        transition={SWAP}
                      >
                        <div className="truncate text-[0.8125rem] text-[color:var(--wc-text)]/90 @md:text-sm">
                          {selected.name}
                        </div>
                      </m.div>
                    </AnimatePresence>
                    <div className="col-start-1 row-start-2 my-1 flex justify-center text-[clamp(0.7rem,3.4cqw,1.125rem)]">
                      <Odometer
                        hour={selected.hour}
                        label={`${selected.name}, ${formatTime(selected)}`}
                        minute={selected.minute}
                      />
                    </div>
                    <AnimatePresence initial={false}>
                      <m.div
                        key={selected.id}
                        animate={{ opacity: 1 }}
                        className="col-start-1 row-start-3 text-xs text-[color:var(--wc-muted)] tabular-nums"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        transition={SWAP}
                      >
                        {selected.isHome ? 'Home' : formatDelta(selected.deltaHours)}
                      </m.div>
                    </AnimatePresence>
                  </div>
                </Dial>
                <div className="relative flex h-8 items-center justify-center">
                  <button
                    aria-label={sound ? 'Mute click sound' : 'Unmute click sound'}
                    aria-pressed={!sound}
                    className="absolute right-0 grid size-8 place-items-center rounded-full text-[color:var(--wc-muted)] transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--wc-focus)] can-hover:hover:text-[color:var(--wc-text)]"
                    onClick={() => setSound((value) => !value)}
                    type="button"
                  >
                    {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {shift !== 0 && (
                      <m.button
                        key="reset"
                        animate={{ opacity: 1, transform: 'translateY(0px)' }}
                        className="rounded-full border border-[color:var(--wc-line)] bg-[color:var(--wc-tint)] px-3 py-1 text-xs text-[color:var(--wc-muted)] transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--wc-focus)] can-hover:hover:text-[color:var(--wc-text)]"
                        exit={{ opacity: 0, transform: 'translateY(4px)' }}
                        initial={{ opacity: 0, transform: 'translateY(4px)' }}
                        onClick={() => setShift(0)}
                        transition={SWAP}
                        type="button"
                      >
                        Back to now
                      </m.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <CityList onSelect={select} pillId={pillId} selectedId={selected.id} views={views} />
              <p aria-live="polite" className="sr-only">
                {selected.name}, {formatTime(selected)},{' '}
                {selected.isHome ? 'home' : describeOffset(selected)}
              </p>
            </div>
          ) : (
            <div aria-busy className="aspect-[2/1] w-full" />
          )}
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
