'use client';

import { motion, useScroll, useSpring } from 'motion/react';

// 1px reading-progress line glued under the navbar. Sprung so Lenis' stepped scroll stays smooth.
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-(--nav-height) z-50 h-px origin-left bg-foreground"
      style={{ scaleX }}
    />
  );
};
