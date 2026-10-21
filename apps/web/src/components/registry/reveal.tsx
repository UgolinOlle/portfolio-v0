'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { m, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

import { EASE_OUT } from '~/lib/constants';

type RevealProps = {
  children: ReactNode;
  className?: string;
  // Seconds. Use it to chain a few elements; for long lists prefer capping the index.
  delay?: number;
  // `rise`: fade + short upward slide. `wipe`: clip-path reveal from the left.
  variant?: 'rise' | 'wipe';
  distance?: number;
};

// Reveals its children once, the first time they scroll into view (above-the-fold content
// therefore plays on load). Full `transform` strings keep the slide off the main thread; under
// `prefers-reduced-motion` only the opacity is animated.
export const Reveal = ({
  children,
  className,
  delay = 0,
  variant = 'rise',
  distance = 12,
}: RevealProps) => {
  const reduce = useReducedMotion();
  const wipe = variant === 'wipe' && !reduce;

  return (
    <m.div
      className={className}
      initial={
        wipe
          ? { clipPath: 'inset(0 100% 0 0)', opacity: 0 }
          : { opacity: 0, transform: `translateY(${distance}px)` }
      }
      transition={{ delay, duration: wipe ? 0.6 : 0.45, ease: EASE_OUT }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      whileInView={
        wipe
          ? { clipPath: 'inset(0 0% 0 0)', opacity: 1 }
          : { opacity: 1, transform: 'translateY(0px)' }
      }
    >
      {children}
    </m.div>
  );
};

type DrawLineProps = {
  className?: string;
  delay?: number;
};

// A hairline that draws itself from the left edge. Meant to replace a `border-b`.
export const DrawLine = ({ className, delay = 0 }: DrawLineProps) => (
  <m.span
    aria-hidden="true"
    className={cn('pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left', className)}
    initial={{ transform: 'scaleX(0)' }}
    transition={{ delay, duration: 0.7, ease: EASE_OUT }}
    viewport={{ once: true }}
    whileInView={{ transform: 'scaleX(1)' }}
  />
);
