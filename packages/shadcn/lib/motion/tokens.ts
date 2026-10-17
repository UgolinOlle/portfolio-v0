/*
  Motion tokens, mirrored in `styles/globals.css` (`--duration-*`, `--ease-*`). Change both
  together: CSS transitions read the stylesheet, Motion components read this file.
*/

// Seconds (Motion's unit). The CSS counterparts are in milliseconds.
export const duration = {
  instant: 0,
  fast: 0.12,
  base: 0.18,
  slow: 0.24,
  slower: 0.32,
} as const;

// Exits run at roughly 60% of the matching enter: the system answers faster than the user decides.
export const exitRatio = 0.6;

type Bezier = [number, number, number, number];

export const ease = {
  // Default for anything entering or leaving.
  outStrong: [0.23, 1, 0.32, 1] satisfies Bezier,
  // Movement that stays on screen (indicators, collapsing panels).
  inOutStrong: [0.77, 0, 0.175, 1] satisfies Bezier,
  // iOS-like curve for sheets and drawers.
  drawer: [0.32, 0.72, 0, 1] satisfies Bezier,
} as const;

// Springs are for gestures and indicators that can be interrupted. No bounce on utility UI.
export const spring = {
  snappy: { type: 'spring', duration: 0.28, bounce: 0 },
  gentle: { type: 'spring', duration: 0.4, bounce: 0.15 },
} as const;

// Delay between siblings entering together. Decorative: never block interaction on it.
export const stagger = 0.04;
