import type { Transition, Variants } from 'motion/react';

/*
  Motion for the dashboard. Curves mirror the project's tokens (`--ease-out-strong`). Everything
  is transform and opacity; only the chart (see `revenue-chart.tsx`) goes further, with springs
  on SVG geometry. `MotionConfig reducedMotion="user"` (see `index.tsx`) drops transforms and
  keeps fades; the chart checks `useReducedMotion` itself.
*/

export const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;

export const enter: Transition = { duration: 0.4, ease: EASE_OUT_STRONG };

/** Shared-element moves (nav and tab indicators). No bounce: they track a click. */
export const slide: Transition = { type: 'spring', duration: 0.32, bounce: 0 };

export const rise = {
  hidden: { opacity: 0, transform: 'translateY(8px)' },
  visible: { opacity: 1, transform: 'translateY(0px)' },
} satisfies Variants;

export const slideIn = {
  hidden: { opacity: 0, transform: 'translateX(-8px)' },
  visible: { opacity: 1, transform: 'translateX(0px)' },
} satisfies Variants;

/**
 * Page-load choreography: sidebar, then header, KPIs, chart and tasks. Delays are seconds from
 * mount; the chart starts growing its bars at `CHART_START` once its card is in.
 */
export const stage = { sidebar: 0, header: 0.08, kpis: 0.16, chart: 0.34, tasks: 0.46 } as const;
export const CHART_START = 0.62;

/** Orchestrates its children only; the parent itself does not move. */
export function stagger(delay: number, step = 0.06): Variants {
  return { hidden: {}, visible: { transition: { delayChildren: delay, staggerChildren: step } } };
}

export const popIn = {
  hidden: { opacity: 0, transform: 'scale(0.92)' },
  visible: { opacity: 1, transform: 'scale(1)' },
} satisfies Variants;
