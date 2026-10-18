import type { Variants } from 'motion/react';

/*
  One orchestrated entrance: the badge, each headline line, the text and the button rise in
  sequence. Transforms and opacity only; `MotionConfig reducedMotion="user"` (see `index.tsx`)
  drops the transform for users who ask for less motion and keeps the fade.
*/

export const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;

export const stack = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
} satisfies Variants;

export const rise = {
  hidden: { opacity: 0, transform: 'translateY(14px)' },
  visible: {
    opacity: 1,
    transform: 'translateY(0px)',
    transition: { duration: 0.6, ease: EASE_OUT_STRONG },
  },
} satisfies Variants;

export const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT_STRONG } },
} satisfies Variants;
