import type { Transition } from 'motion/react';

/*
  One motion vocabulary for the whole board (mirrors the project's `--ease-out-strong` and
  duration tokens). Everything is transform + opacity; springs are critically damped (no bounce)
  because a board is a working tool. `MotionConfig reducedMotion="user"` (see `index.tsx`) drops
  the transforms and keeps the fades.
*/

export const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;

/** Neighbours making room, and a card gliding between columns (`layout` / `layoutId`). */
export const LAYOUT: Transition = { type: 'spring', duration: 0.28, bounce: 0 };

/** Cards, columns and overlays entering. */
export const ENTER: Transition = { duration: 0.22, ease: EASE_OUT_STRONG };

/** Exits are quicker than entrances. */
export const EXIT: Transition = { duration: 0.14, ease: EASE_OUT_STRONG };

/** Stagger between cards on first paint. */
export const STAGGER = 0.04;

/** How long the first-paint choreography lasts before cards stop carrying a delay. */
export const INTRO_MS = 1200;

/** Drop animation handed to `DragOverlay`: eases the lifted card into its slot. */
export const DROP_ANIMATION = { duration: 200, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' };

/** Lifted card while dragging. */
export const LIFT_SCALE = 1.03;

/** Max tilt (degrees) towards the direction of travel. */
export const MAX_TILT = 4;

/** WIP breach: a single short shake, not a loop. */
export const SHAKE = {
  transform: [
    'translateX(0px)',
    'translateX(-6px)',
    'translateX(5px)',
    'translateX(-3px)',
    'translateX(0px)',
  ],
  transition: { duration: 0.32, ease: 'easeInOut' as const },
};
