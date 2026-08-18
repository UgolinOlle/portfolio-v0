'use client';

import { Calendar, Check } from 'lucide-react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export type CalendarSyncState = 'idle' | 'loading' | 'success';

const TRACK_WIDTH = 94;
const BAR_WIDTH = 16;
const SUCCESS_HOLD_DURATION = 1400;

export interface CalendarSyncProps {
  /** Duration of the loading phase, in milliseconds. */
  syncDuration?: number;

  /** Called as soon as a sync starts (before the loading animation plays). */
  onSync?: () => void;

  disabled?: boolean;

  className?: string;

  /** Label shown in the idle state. */
  label?: string;

  /** Uncontrolled by default — pass alongside `onStateChange` to drive the cycle yourself. */
  state?: CalendarSyncState;

  onStateChange?: (state: CalendarSyncState) => void;
}

const contentTransition = { type: 'spring', duration: 0.6, bounce: 0 } as const;

const contentMotionProps = {
  initial: { opacity: 0, filter: 'blur(4px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: 'blur(4px)' },
  transition: contentTransition,
} as const;

export function CalendarSync({
  syncDuration = 2000,
  onSync,
  disabled = false,
  className,
  label = 'Sync event',
  state: controlledState,
  onStateChange,
}: CalendarSyncProps) {
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

  const handleClick = () => {
    if (disabled || isBusy) return;
    onSync?.();
    setState('loading');
  };

  const statusText =
    state === 'loading' ? 'Syncing event…' : state === 'success' ? 'Event synced' : '';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-8 rounded-full bg-white p-1 dark:bg-gray-900',
        className,
      )}
    >
      <div className="flex items-center gap-1 text-sm font-medium font-semibold text-foreground">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground"
        >
          <Calendar className="size-5 stroke-2" />
        </span>
        Calendar
      </div>

      <LayoutGroup>
        <motion.button
          type="button"
          layout
          onClick={handleClick}
          disabled={disabled || isBusy}
          aria-label={label}
          aria-busy={state === 'loading'}
          whileTap={!disabled && !isBusy ? { scale: 0.97 } : undefined}
          transition={{ layout: { type: 'spring', duration: 0.7, bounce: 0.15 } }}
          className={cn(
            'inline-flex h-9 items-center justify-center gap-2 rounded-full bg-muted px-3',
            'text-sm font-medium text-foreground',
            'transition-colors duration-200 outline-none hover:opacity-90',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'focus-visible:ring-offset-background',
            disabled && 'pointer-events-none opacity-60',
            state === 'success' && 'border border-green-200/50 bg-green-100/50',
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {state === 'idle' && (
              <motion.span
                key="idle"
                layoutId="calendar-sync-morph"
                {...contentMotionProps}
                className="flex items-center gap-1.5"
              >
                {label}
              </motion.span>
            )}

            {state === 'loading' && (
              <motion.span
                key="loading"
                layoutId="calendar-sync-morph"
                {...contentMotionProps}
                className="relative h-1.5 overflow-hidden rounded-full bg-current/15"
                style={{ width: TRACK_WIDTH }}
              >
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-full bg-current"
                  style={{ width: BAR_WIDTH }}
                  animate={{ x: [0, TRACK_WIDTH - BAR_WIDTH, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.span>
            )}

            {state === 'success' && (
              <motion.span
                key="success"
                layoutId="calendar-sync-morph"
                {...contentMotionProps}
                className="flex items-center text-green-500"
              >
                <Check className="size-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </LayoutGroup>

      <span className="sr-only" role="status" aria-live="polite">
        {statusText}
      </span>
    </div>
  );
}
