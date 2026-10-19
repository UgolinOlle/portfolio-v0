'use client';

import { AnimatePresence, m } from 'motion/react';

import { cn } from '@/lib/utils';

import { LAYOUT, ROLL, ROLL_STAGGER, SWAP } from './motion';
import { to12h } from './time';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** One column of digits sliding behind a 1-line window. Percent translates are relative to the column. */
function Digit({ value, index }: { value: number; index: number }) {
  return (
    <m.span
      className="relative inline-block h-[1.1em] w-[0.62em] overflow-hidden text-center"
      layout="position"
      transition={LAYOUT}
    >
      <m.span
        animate={{ transform: `translateY(${-value * 10}%)` }}
        className="absolute inset-x-0 top-0 flex flex-col"
        initial={false}
        transition={{ ...ROLL, delay: index * ROLL_STAGGER }}
      >
        {DIGITS.map((digit) => (
          <span key={digit} className="block h-[1.1em] leading-[1.1]">
            {digit}
          </span>
        ))}
      </m.span>
    </m.span>
  );
}

/**
 * Rolling time display (odometer). The text is `aria-hidden`; the wrapper carries the full time as its
 * accessible name so screen readers hear "1:15 PM", not a column of digits.
 */
export function Odometer({
  hour,
  minute,
  label,
  className,
}: {
  hour: number;
  minute: number;
  label: string;
  className?: string;
}) {
  const { hour12, meridiem } = to12h(hour);
  const tens = hour12 >= 10 ? 1 : null;

  return (
    <div
      aria-label={label}
      className={cn('inline-flex items-center justify-center', className)}
      role="img"
    >
      <span
        aria-hidden
        className="relative inline-flex items-center text-[2.25em] leading-none font-medium tracking-tight"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {tens !== null && (
            <m.span
              key="hour-tens"
              animate={{ opacity: 1 }}
              className="inline-block h-[1.1em] w-[0.62em] text-center leading-[1.1]"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              layout="position"
              transition={SWAP}
            >
              1
            </m.span>
          )}
        </AnimatePresence>
        <Digit index={0} value={hour12 % 10} />
        <m.span
          className="-mx-[0.02em] inline-block h-[1.1em] w-[0.3em] text-center leading-[1.1] opacity-60"
          layout="position"
          transition={LAYOUT}
        >
          :
        </m.span>
        <Digit index={1} value={Math.floor(minute / 10)} />
        <Digit index={2} value={minute % 10} />
      </span>
      <span
        aria-hidden
        className="relative ml-1.5 inline-block h-[1.2em] w-[1.7em] overflow-hidden text-[0.8em] leading-[1.2] text-[color:var(--wc-muted)]"
      >
        <AnimatePresence initial={false} mode="popLayout">
          <m.span
            key={meridiem}
            animate={{ transform: 'translateY(0%)', opacity: 1 }}
            className="absolute inset-0 block"
            exit={{ transform: 'translateY(-60%)', opacity: 0 }}
            initial={{ transform: 'translateY(60%)', opacity: 0 }}
            transition={SWAP}
          >
            {meridiem}
          </m.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
