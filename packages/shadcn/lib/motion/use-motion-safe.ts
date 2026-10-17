'use client';

import { useReducedMotion } from 'motion/react';

// For choosing a different variant (skip the slide, keep the fade) where `MotionConfig` alone
// is not enough. `offset(8)` is 8 normally and 0 under `prefers-reduced-motion`.
export function useMotionSafe() {
  const reduce = useReducedMotion() ?? false;

  return { reduce, offset: (distance: number) => (reduce ? 0 : distance) };
}
