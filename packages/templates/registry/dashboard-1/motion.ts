import type { Transition, Variants } from 'motion/react';
import * as React from 'react';

/*
  Motion for the dashboard. Curves mirror the project's tokens (`--ease-out-strong`, 40ms
  stagger). Transforms, opacity and clip-path only. The first mount plays the full choreography;
  once the user is interacting (selecting, switching tabs) the same moves run "quick": no stagger,
  160ms. `MotionConfig reducedMotion="user"` (see `index.tsx`) drops transforms and keeps fades.
*/

export const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;

export const enter: Transition = { duration: 0.36, ease: EASE_OUT_STRONG };
export const enterQuick: Transition = { duration: 0.16, ease: EASE_OUT_STRONG };

/** Shared-element moves (selection highlight, tab and nav pills). No bounce: it tracks a click. */
export const slide: Transition = { type: 'spring', duration: 0.32, bounce: 0 };

export const QuickContext = React.createContext(false);
export const useQuick = () => React.useContext(QuickContext);

export const rise = {
  hidden: { opacity: 0, transform: 'translateY(6px)' },
  visible: { opacity: 1, transform: 'translateY(0px)' },
} satisfies Variants;

/** Orchestrates its children only; the parent itself does not move. */
export function stagger(quick: boolean, delay = 0.06, step = 0.04): Variants {
  return {
    hidden: {},
    visible: { transition: quick ? {} : { delayChildren: delay, staggerChildren: step } },
  };
}

/** A child that rises in and staggers its own children. */
export function riseGroup(quick: boolean, step = 0.05): Variants {
  return {
    hidden: rise.hidden,
    visible: {
      ...rise.visible,
      transition: quick ? enterQuick : { ...enter, delayChildren: 0, staggerChildren: step },
    },
  };
}

/** Left-to-right sweep for the budget bar. */
export function reveal(quick: boolean): Variants {
  return {
    hidden: { clipPath: 'inset(0 100% 0 0 round 9999px)' },
    visible: {
      clipPath: 'inset(0 0% 0 0 round 9999px)',
      transition: { duration: quick ? 0.3 : 0.6, delay: quick ? 0 : 0.15, ease: EASE_OUT_STRONG },
    },
  };
}

/** Labels that wait for the bar sweep. */
export function labelFade(quick: boolean): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2, delay: quick ? 0.1 : 0.5 } },
  };
}
