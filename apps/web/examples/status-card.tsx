'use client';

import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

const files = [
  'app/page.tsx',
  'components/ui/button.tsx',
  'components/status-card.tsx',
  'components/navbar.tsx',
  'components/theme-toggle.tsx',
  'lib/utils.ts',
];

const SEGMENTS = 32;
const BUILD_DURATION = 6;

// Strong ease-out: entrances and exits.
const EASE = [0.23, 1, 0.32, 1] as const;

// Uneven on purpose: a real build speeds up, stalls, then rushes to the end.
const PROGRESS_VALUES = [0, 0.14, 0.31, 0.5, 0.64, 0.86, 1];
const PROGRESS_TIMES = [0, 0.1, 0.28, 0.5, 0.64, 0.86, 1];

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

type Status = 'building' | 'success';

const stats = [
  { label: 'Fichiers', value: '6' },
  { label: 'Poids', value: '184 Ko' },
  { label: 'Erreurs', value: '0' },
];

function formatSeconds(value: number) {
  return `${value.toFixed(1).replace('.', ',')} s`;
}

export default function StatusCardExample() {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>('building');
  const [percent, setPercent] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [run, setRun] = useState(0);

  const progress = useMotionValue(0);
  const startedAt = useRef(0);

  useMotionValueEvent(progress, 'change', (value) => {
    setPercent(Math.round(value * 100));
    setElapsed((performance.now() - startedAt.current) / 1000);
  });

  useEffect(() => {
    progress.set(0);
    startedAt.current = performance.now();

    const controls = animate(progress, PROGRESS_VALUES, {
      duration: BUILD_DURATION,
      times: PROGRESS_TIMES,
      ease: 'linear',
      onComplete: () => {
        setElapsed(BUILD_DURATION - 0.2);
        setStatus('success');
      },
    });

    return () => controls.stop();
  }, [progress, run]);

  const building = status === 'building';
  const lit = Math.round((percent / 100) * SEGMENTS);
  const activeIndex = Math.min(Math.floor((percent / 100) * files.length), files.length - 1);
  const visibleFiles = files.slice(Math.max(0, activeIndex - 2), activeIndex + 1);

  const replay = () => {
    setStatus('building');
    setElapsed(0);
    setRun((value) => value + 1);
  };

  const swap = {
    initial: { opacity: 0, filter: 'blur(6px)', transform: reduce ? 'none' : 'translateY(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' },
    exit: { opacity: 0, filter: 'blur(6px)', transform: reduce ? 'none' : 'translateY(-10px)' },
    transition: { duration: 0.25, ease: EASE },
  };

  return (
    <article
      aria-live="polite"
      className="relative w-72 overflow-hidden rounded-2xl bg-card text-card-foreground shadow-[0_1px_0_0_rgb(255_255_255/0.6)_inset,0_0_0_1px_rgb(24_24_27/0.08),0_12px_32px_-12px_rgb(24_24_27/0.18)] dark:shadow-[0_1px_0_0_rgb(255_255_255/0.06)_inset,0_0_0_1px_rgb(255_255_255/0.08),0_12px_32px_-12px_rgb(0_0_0/0.6)]"
    >
      {/* Grain, to break the flat digital surface. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-multiply dark:opacity-[0.07] dark:mix-blend-screen"
        style={{ backgroundImage: GRAIN }}
      />

      {/* Success light, rising from behind the numeral. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_0%_45%,--alpha(var(--color-emerald-500)/16%),transparent_70%)]"
        initial={false}
        animate={{ opacity: building ? 0 : 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />

      <div className="relative flex flex-col gap-5 p-5">
        {/* Top line */}
        <header className="flex items-center justify-between">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-[4px] px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wide transition-colors duration-500',
              building
                ? 'bg-foreground/[0.06] text-foreground/70'
                : 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
            )}
          >
            <span className="relative grid size-1.5 place-items-center">
              <span className="size-1.5 rounded-[1px] bg-current" />
              {building && !reduce && (
                <motion.span
                  className="absolute size-1.5 rounded-[1px] bg-current"
                  animate={{ transform: ['scale(1)', 'scale(2.6)'], opacity: [0.5, 0] }}
                  transition={{ duration: 1.2, ease: 'easeOut', repeat: Infinity }}
                />
              )}
            </span>
            {building ? 'build' : 'live'}
          </span>

          <div className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
            <span className="tabular-nums">{formatSeconds(elapsed)}</span>
            <div className="relative h-5 w-5">
              <AnimatePresence initial={false}>
                {!building && (
                  <motion.button
                    key="replay"
                    type="button"
                    onClick={replay}
                    aria-label="Relancer le build"
                    className="absolute inset-0 grid place-items-center rounded-[4px] transition-[color,background-color] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-90 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/[0.06] [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
                    {...swap}
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-3"
                      aria-hidden
                    >
                      <path d="M3 8a5 5 0 1 0 1.6-3.7" />
                      <path d="M3 2.5v3h3" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Hero */}
        <div className="space-y-1.5">
          <div className="relative grid h-[52px] items-end overflow-hidden">
            <AnimatePresence initial={false}>
              {building ? (
                <motion.p
                  key="percent"
                  className="col-start-1 row-start-1 flex items-start text-[52px] leading-none font-semibold tracking-[-0.06em] tabular-nums"
                  {...swap}
                >
                  {percent}
                  <span className="mt-1.5 ml-1 text-lg font-medium tracking-normal text-muted-foreground">
                    %
                  </span>
                </motion.p>
              ) : (
                <motion.p
                  key="live"
                  className="col-start-1 row-start-1 text-[44px] leading-none font-semibold tracking-[-0.05em] text-emerald-600 dark:text-emerald-400"
                  {...swap}
                >
                  En ligne
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="relative h-4 overflow-hidden text-xs text-muted-foreground">
            <AnimatePresence initial={false}>
              <motion.p
                key={status}
                className="absolute inset-y-0 left-0 leading-4 whitespace-nowrap"
                {...swap}
              >
                {building ? (
                  <>Déploiement de whoa-ui</>
                ) : (
                  <>
                    Terminé en{' '}
                    <span className="tabular-nums">{formatSeconds(BUILD_DURATION - 0.2)}</span>
                  </>
                )}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Segmented meter */}
        <div
          role="progressbar"
          aria-label="Progression du build"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="grid gap-[2px]"
          style={{ gridTemplateColumns: `repeat(${SEGMENTS}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: SEGMENTS }, (_, index) => {
            const on = index < lit;
            const next = building && index === lit;

            return (
              <span
                key={index}
                className={cn(
                  'h-6 rounded-[2px] transition-[background-color,opacity] duration-200',
                  on ? (building ? 'bg-foreground' : 'bg-emerald-500') : 'bg-foreground/[0.08]',
                  next && !reduce && 'animate-pulse bg-foreground/30',
                )}
                // Success sweeps left to right, 12ms per cell.
                style={{ transitionDelay: !building && !reduce ? `${index * 12}ms` : '0ms' }}
              />
            );
          })}
        </div>

        {/* Log / summary */}
        <div className="relative h-[3.25rem] overflow-hidden">
          <AnimatePresence initial={false}>
            {building ? (
              <motion.ul
                key="log"
                className="absolute inset-0 flex flex-col justify-end gap-1 font-mono text-[10px]"
                {...swap}
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {visibleFiles.map((file) => {
                    const index = files.indexOf(file);
                    const rank = activeIndex - index; // 0 = compiling now
                    const current = rank === 0;

                    return (
                      <motion.li
                        key={file}
                        layout="position"
                        className="flex items-center gap-2 whitespace-nowrap"
                        initial={{ opacity: 0, transform: reduce ? 'none' : 'translateY(8px)' }}
                        animate={{
                          opacity: current ? 1 : rank === 1 ? 0.45 : 0.22,
                          transform: 'translateY(0px)',
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
                      >
                        <span className="grid size-2.5 shrink-0 place-items-center">
                          {current ? (
                            <span className="size-1 rounded-[1px] bg-foreground" />
                          ) : (
                            <svg
                              viewBox="0 0 12 12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.6}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="size-2.5"
                              aria-hidden
                            >
                              <path d="M2.5 6.5 5 9l4.5-5.5" />
                            </svg>
                          )}
                        </span>
                        <span className="truncate">{file}</span>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </motion.ul>
            ) : (
              <motion.dl
                key="stats"
                className="absolute inset-0 grid grid-cols-3 content-end gap-3"
                {...swap}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="border-t border-foreground/10 pt-2"
                    initial={{ opacity: 0, transform: reduce ? 'none' : 'translateY(6px)' }}
                    animate={{ opacity: 1, transform: 'translateY(0px)' }}
                    transition={{ duration: 0.3, ease: EASE, delay: 0.12 + index * 0.05 }}
                  >
                    <dt className="text-[10px] text-muted-foreground">{stat.label}</dt>
                    <dd className="font-mono text-xs font-medium tabular-nums">{stat.value}</dd>
                  </motion.div>
                ))}
              </motion.dl>
            )}
          </AnimatePresence>
        </div>
      </div>
    </article>
  );
}
