'use client';

import { animate, m, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import * as React from 'react';

import { EASE_OUT_STRONG } from './motion';

/**
 * Counts to `value` without re-rendering: the text is driven by a motion value. Retargets from the
 * current number when `value` changes. Reduced motion jumps straight to the value.
 */
export function AnimatedNumber({
  value,
  format,
  delay = 0,
  duration = 1.1,
  className,
}: {
  value: number;
  format: (n: number) => string;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce ? value : 0);
  const text = useTransform(mv, format);

  React.useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration, delay, ease: EASE_OUT_STRONG });
    return () => controls.stop();
    // `delay` only matters for the first run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduce]);

  return <m.span className={className}>{text}</m.span>;
}
