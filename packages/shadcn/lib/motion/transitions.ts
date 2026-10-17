import type { Transition } from 'motion/react';

import { duration, ease, exitRatio, spring } from './tokens';

export const transition = {
  fast: { duration: duration.fast, ease: ease.outStrong },
  base: { duration: duration.base, ease: ease.outStrong },
  slow: { duration: duration.slow, ease: ease.outStrong },
  // Leaving: same curve, shorter.
  exit: { duration: duration.base * exitRatio, ease: ease.outStrong },
  // Something that slides between positions (tab indicator, pressed background).
  indicator: spring.snappy,
  // Content that stays on screen but changes size or position.
  move: { duration: duration.slow, ease: ease.inOutStrong },
} satisfies Record<string, Transition>;
