import type { Variants } from 'motion/react';

/*
  Entrance choreography, mirrored from the project's motion tokens (`--ease-out-strong`, 40ms
  stagger). Transforms and opacity only; `MotionConfig reducedMotion="user"` (see `index.tsx`)
  drops the transform for users who ask for less motion and keeps the fade.
*/

export const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;

export const list = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.06 } },
} satisfies Variants;

export const rise = {
  hidden: { opacity: 0, transform: 'translateY(6px)' },
  visible: {
    opacity: 1,
    transform: 'translateY(0px)',
    transition: { duration: 0.36, ease: EASE_OUT_STRONG },
  },
} satisfies Variants;
