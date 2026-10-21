'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export type CalendarSyncState = 'idle' | 'loading' | 'success';

const SUCCESS_HOLD_DURATION = 1800;

// Strong ease-out: entrances and exits.
const EASE = [0.23, 1, 0.32, 1] as const;

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Fixed, so server and client render the same text.
const DEFAULT_DATE = new Date(2026, 9, 17, 14, 30);

export interface CalendarSyncProps {
  /** Duration of the loading phase, in milliseconds. */
  syncDuration?: number;

  /** Called as soon as a sync starts (before the loading animation plays). */
  onSync?: () => void;

  disabled?: boolean;

  className?: string;

  /** Label shown on the button in the idle state. */
  label?: string;

  /** Event title. */
  title?: string;

  /** Event date, shown on the tile and in the subtitle. */
  date?: Date;

  /** Uncontrolled by default — pass alongside `onStateChange` to drive the cycle yourself. */
  state?: CalendarSyncState;

  onStateChange?: (state: CalendarSyncState) => void;
}

function DrawnCheck({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <motion.path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.28, delay: 0.08, ease: EASE }}
      />
    </svg>
  );
}

function Dots() {
  const reduce = useReducedMotion();

  return (
    <span className="flex items-center gap-[3px]" aria-hidden>
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="size-1 rounded-[1px] bg-current"
          animate={reduce ? { opacity: 0.6 } : { opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1, ease: 'easeInOut', repeat: Infinity, delay: index * 0.15 }}
        />
      ))}
    </span>
  );
}

export function CalendarSync({
  syncDuration = 2000,
  onSync,
  disabled = false,
  className,
  label = 'Synchroniser',
  title = 'Revue de design',
  date = DEFAULT_DATE,
  state: controlledState,
  onStateChange,
}: CalendarSyncProps) {
  const reduce = useReducedMotion();
  const [uncontrolledState, setUncontrolledState] = React.useState<CalendarSyncState>('idle');

  const isControlled = controlledState !== undefined;
  const state = isControlled ? controlledState : uncontrolledState;

  const setState = React.useCallback(
    (next: CalendarSyncState) => {
      if (!isControlled) setUncontrolledState(next);
      onStateChange?.(next);
    },
    [isControlled, onStateChange],
  );

  React.useEffect(() => {
    if (state !== 'loading') return;

    const timeout = setTimeout(() => setState('success'), syncDuration);
    return () => clearTimeout(timeout);
  }, [state, syncDuration, setState]);

  React.useEffect(() => {
    if (state !== 'success') return;

    const timeout = setTimeout(() => setState('idle'), SUCCESS_HOLD_DURATION);
    return () => clearTimeout(timeout);
  }, [state, setState]);

  const isBusy = state !== 'idle';
  const success = state === 'success';

  const handleClick = () => {
    if (disabled || isBusy) return;
    onSync?.();
    setState('loading');
  };

  const month = date.toLocaleDateString('fr-FR', { month: 'short' });
  const day = date.getDate();
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const subtitle = {
    idle: `${day} ${month} · ${time}`,
    loading: "Envoi vers l'agenda",
    success: "Ajouté à l'agenda",
  }[state];

  const statusText =
    state === 'loading' ? 'Synchronisation en cours' : success ? 'Événement synchronisé' : '';

  const swap = {
    initial: { opacity: 0, filter: 'blur(4px)', transform: reduce ? 'none' : 'translateY(6px)' },
    animate: { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' },
    exit: { opacity: 0, filter: 'blur(4px)', transform: reduce ? 'none' : 'translateY(-6px)' },
    transition: { duration: 0.2, ease: EASE },
  };

  return (
    <div
      className={cn(
        'relative flex w-[22rem] max-w-full flex-wrap items-center gap-3 overflow-hidden rounded-2xl bg-card p-3 text-card-foreground',
        'shadow-[0_1px_0_0_rgb(255_255_255/0.6)_inset,0_0_0_1px_rgb(24_24_27/0.08),0_12px_32px_-12px_rgb(24_24_27/0.18)]',
        'dark:shadow-[0_1px_0_0_rgb(255_255_255/0.06)_inset,0_0_0_1px_rgb(255_255_255/0.08),0_12px_32px_-12px_rgb(0_0_0/0.6)]',
        className,
      )}
    >
      {/* Grain, to break the flat digital surface. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-multiply dark:opacity-[0.07] dark:mix-blend-screen"
        style={{ backgroundImage: GRAIN }}
      />

      {/* Success light. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_0%_50%,--alpha(var(--color-emerald-500)/14%),transparent_70%)]"
        initial={false}
        animate={{ opacity: success ? 1 : 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />

      {/* Date tile */}
      <div className="relative shrink-0">
        <div className="flex size-11 flex-col overflow-hidden rounded-xl bg-foreground/[0.05] shadow-[0_0_0_1px_rgb(24_24_27/0.06)_inset] dark:shadow-[0_0_0_1px_rgb(255_255_255/0.08)_inset]">
          <span
            className={cn(
              'h-1.5 shrink-0 transition-colors duration-500',
              success ? 'bg-emerald-500' : 'bg-foreground',
            )}
          />
          <span className="flex flex-1 flex-col items-center justify-center leading-none">
            <span className="text-[9px] font-medium text-muted-foreground">{month}</span>
            <span className="mt-0.5 text-base font-semibold tracking-tight tabular-nums">
              {day}
            </span>
          </span>
        </div>

        <AnimatePresence>
          {success && (
            <motion.span
              aria-hidden
              className="absolute -right-1 -bottom-1 grid size-4 place-items-center rounded-[5px] bg-emerald-500 text-white ring-2 ring-card"
              initial={{ opacity: 0, transform: reduce ? 'none' : 'scale(0.6)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <DrawnCheck className="size-3" />
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Event */}
      <div className="relative min-w-28 flex-1">
        <p className="truncate text-sm font-semibold tracking-tight">{title}</p>
        <div className="relative h-4 overflow-hidden text-xs text-muted-foreground">
          <AnimatePresence initial={false}>
            <motion.p
              key={state}
              className={cn(
                'absolute inset-y-0 left-0 truncate leading-4 whitespace-nowrap transition-colors duration-500',
                success && 'text-emerald-700 dark:text-emerald-400',
                state === 'idle' && 'tabular-nums',
              )}
              {...swap}
            >
              {subtitle}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Action: fixed width, so the swap never shifts the layout. */}
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isBusy}
        aria-label={label}
        aria-busy={state === 'loading'}
        className={cn(
          'relative ml-auto grid h-8 w-[6.5rem] shrink-0 place-items-center overflow-hidden rounded-lg text-xs font-medium',
          'transition-[background-color,color,transform] duration-200 ease-out outline-none',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card',
          'active:scale-[0.97] disabled:active:scale-100',
          state === 'idle' &&
            'bg-foreground text-background [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/85',
          state === 'loading' && 'bg-foreground/[0.06] text-foreground/70',
          success && 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
          disabled && 'pointer-events-none opacity-60',
        )}
      >
        <AnimatePresence initial={false}>
          <motion.span
            key={state}
            className="col-start-1 row-start-1 flex items-center gap-1.5"
            {...swap}
          >
            {state === 'idle' && label}
            {state === 'loading' && <Dots />}
            {success && (
              <>
                <DrawnCheck className="size-3.5" />
                Ajouté
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* Progress hairline along the bottom edge. Linear: it is a duration, not a gesture. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 origin-left bg-foreground/70"
          initial={false}
          animate={{
            transform: state === 'idle' ? 'scaleX(0)' : 'scaleX(1)',
            opacity: state === 'idle' ? 0 : 1,
          }}
          transition={{
            transform:
              state === 'loading'
                ? { duration: syncDuration / 1000, ease: 'linear' }
                : { duration: 0, delay: state === 'idle' ? 0.3 : 0 },
            opacity: { duration: 0.3, ease: 'easeOut' },
          }}
        />
        <motion.div
          className="absolute inset-0 bg-emerald-500"
          initial={false}
          animate={{ opacity: success ? 1 : 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        {statusText}
      </span>
    </div>
  );
}
