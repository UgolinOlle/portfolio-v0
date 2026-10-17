'use client';

import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

type CountUpProps = {
  value: number;
  // Seconds to wait before counting, to sit behind the surrounding reveal.
  delay?: number;
};

const pad = (n: number) => String(Math.round(n)).padStart(2, '0');

// Counts from 0 to `value` once visible. Renders the final value on the server and with
// reduced motion, so the number is always right even if the animation never runs.
export const CountUp = ({ value, delay = 0 }: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView || reduce || value === 0) return;
    const controls = animate(0, value, {
      delay,
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    setDisplay(0);
    return () => controls.stop();
  }, [inView, reduce, value, delay]);

  return <span ref={ref}>{pad(display)}</span>;
};
