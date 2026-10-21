'use client';

import { m, type Variants, useReducedMotion } from 'motion/react';

export type StackGroup = {
  /** Layer name shown in the left column, e.g. "Dashboard". */
  layer: string;
  items: string[];
};

type TechStackProps = {
  groups: StackGroup[];
};

// Expo-out: fast start, long soft landing.
const EASE = [0.22, 1, 0.36, 1] as const;

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const rowVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } },
};

// The hairline draws from left to right, like a ruled line on a printed spec sheet.
const ruleVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.7, ease: EASE } },
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/** Stack overview as ruled editorial rows: each layer draws its rule, then its technologies settle in. */
export function TechStack({ groups }: TechStackProps) {
  const reduceMotion = useReducedMotion();

  return (
    <m.ol
      className="my-10 flex flex-col"
      variants={listVariants}
      initial={reduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {groups.map((group) => (
        <m.li
          key={group.layer}
          variants={rowVariants}
          className="group relative grid gap-2 py-5 sm:grid-cols-[11rem_1fr] sm:gap-8"
        >
          <m.span
            aria-hidden="true"
            variants={ruleVariants}
            className="absolute inset-x-0 top-0 h-px origin-left bg-zinc-300 dark:bg-zinc-700"
          />

          <m.h3
            variants={textVariants}
            className="pt-1 font-mono text-xs tracking-wider text-zinc-500 uppercase transition-colors duration-300 group-hover:text-zinc-950 dark:text-zinc-400 dark:group-hover:text-zinc-50"
          >
            {group.layer}
          </m.h3>

          <m.ul
            variants={textVariants}
            className="flex flex-wrap gap-x-1 gap-y-1.5 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300"
          >
            {group.items.map((item, index) => (
              <li key={item} className="flex items-center">
                {item}
                {index < group.items.length - 1 && (
                  <span aria-hidden="true" className="mx-2 text-zinc-300 dark:text-zinc-600">
                    /
                  </span>
                )}
              </li>
            ))}
          </m.ul>
        </m.li>
      ))}
    </m.ol>
  );
}
