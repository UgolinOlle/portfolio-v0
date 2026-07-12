'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import type { AnimatePresenceProps, Transition, Variants } from 'motion/react';
import { AnimatePresence, motion } from 'motion/react';
import { Children, useEffect, useState } from 'react';

const MILLISECONDS_PER_SECOND = 1000;

export type TextLoopProps = {
  children: React.ReactNode[];
  className?: string;
  interval?: number;
  transition?: Transition;
  variants?: Variants;
  onIndexChange?: (index: number) => void;
  trigger?: boolean;
  mode?: AnimatePresenceProps['mode'];
};

export function TextLoop({
  children,
  className,
  interval = 2,
  transition = { duration: 0.3 },
  variants,
  onIndexChange,
  trigger = true,
  mode = 'popLayout',
}: TextLoopProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = Children.toArray(children);

  useEffect(() => {
    if (!trigger) {
      return;
    }

    const intervalMs = interval * MILLISECONDS_PER_SECOND;
    const timer = setInterval(() => {
      setCurrentIndex((current) => {
        const next = (current + 1) % items.length;
        onIndexChange?.(next);

        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [items.length, interval, onIndexChange, trigger]);

  const motionVariants: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  return (
    <div className={cn('relative inline-block whitespace-nowrap', className)}>
      <AnimatePresence initial={false} mode={mode}>
        <motion.div
          animate="animate"
          exit="exit"
          initial="initial"
          key={currentIndex}
          transition={transition}
          variants={variants || motionVariants}
        >
          {items[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
