import type { Variants } from 'motion/react';

import { stagger } from './tokens';
import { transition } from './transitions';

/*
  Variants use full `transform` strings so they stay on the compositor under load. They are
  written for `MotionConfig reducedMotion="user"` (see `provider.tsx`): transforms are dropped
  for users who ask for less motion, opacity is kept.
*/

export const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.base },
  exit: { opacity: 0, transition: transition.exit },
} satisfies Variants;

// Small rise-and-fade for content that appears on its own (alerts, empty states).
export const rise = {
  hidden: { opacity: 0, transform: 'translateY(6px)' },
  visible: { opacity: 1, transform: 'translateY(0px)', transition: transition.slow },
  exit: { opacity: 0, transition: transition.exit },
} satisfies Variants;

// Never from scale(0): a visible shape reads as "arriving", not "spawning".
export const pop = {
  hidden: { opacity: 0, transform: 'scale(0.96)' },
  visible: { opacity: 1, transform: 'scale(1)', transition: transition.base },
  exit: { opacity: 0, transform: 'scale(0.98)', transition: transition.exit },
} satisfies Variants;

// Height + opacity for messages that mount inside a form. `height` is the one tolerated layout
// property: there is no transform equivalent for pushing siblings.
export const collapse = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: transition.move },
  exit: { opacity: 0, height: 0, transition: transition.exit },
} satisfies Variants;

// Direction-aware slide for content swapped in place (calendar months). `direction` is 1 or -1.
export const slideX = {
  enter: (direction: number) => ({ opacity: 0, transform: `translateX(${direction * 12}px)` }),
  center: { opacity: 1, transform: 'translateX(0px)', transition: transition.base },
  exit: (direction: number) => ({
    opacity: 0,
    transform: `translateX(${direction * -12}px)`,
    transition: transition.exit,
  }),
} satisfies Variants;

// Parent variant that staggers children carrying `rise`/`fade`/`pop`.
export const stagged = {
  hidden: {},
  visible: { transition: { staggerChildren: stagger } },
} satisfies Variants;
