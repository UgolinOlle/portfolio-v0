'use client';

import { domAnimation, LazyMotion, MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

import { transition } from './transitions';

/*
  Loads the DOM animation features lazily (~4.6 KB with `m` components instead of ~34 KB with
  `motion`) and applies `prefers-reduced-motion`. Components that use Motion wrap themselves in
  it, so consumers need no setup; mounting it once near the app root is optional and only
  sets the config for the whole tree.
*/
export function Motion({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user" transition={transition.base}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
