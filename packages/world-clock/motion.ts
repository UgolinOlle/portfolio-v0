import type { Transition } from 'motion/react';

/*
  One motion vocabulary for the whole clock (mirrors the project's `--ease-out-strong` token).
  Everything is transform + opacity. Springs are critically damped: a clock is an instrument, not
  a toy. `MotionConfig reducedMotion="user"` (see `index.tsx`) drops the transforms; the hand and
  the markers also check `useReducedMotion()` because they drive motion values by hand.
*/

export const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;

/** The hand swinging to the selected city. Carries velocity if the user clicks again mid-swing. */
export const HAND: Transition = { type: 'spring', duration: 0.9, bounce: 0.12 };

/** One digit rolling to its new value. */
export const ROLL: Transition = { type: 'spring', duration: 0.6, bounce: 0 };

/** Delay between digits when several change at once (hours, then minutes). */
export const ROLL_STAGGER = 0.045;

/** Siblings sliding over when the hour gains or loses a digit, and the selection pill. */
export const LAYOUT: Transition = { type: 'spring', duration: 0.35, bounce: 0 };

/** Name, offset and AM/PM crossfades. */
export const SWAP: Transition = { duration: 0.2, ease: EASE_OUT_STRONG };

/** Gap between the list rows on first paint. */
export const STAGGER = 0.04;
