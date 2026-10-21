'use client';

import { m, useReducedMotion, useScroll } from 'motion/react';

/** Thin bar at the top of the viewport showing how far through the article the reader is. */
export function ReadingProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  if (reduceMotion) {
    return null;
  }

  return (
    <m.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-40 h-0.5 origin-left bg-zinc-950 dark:bg-zinc-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
