'use client';

import { m, useReducedMotion } from 'motion/react';
import * as React from 'react';

import { EASE_OUT_STRONG } from './motion';

/** Line that draws itself, over a fading area. `vector-effect` keeps the stroke 1.5px at any width. */
export function Sparkline({
  data,
  color,
  delay = 0,
  className,
}: {
  data: number[];
  color: string;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const id = React.useId().replace(/:/g, '');
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * 100,
    30 - ((v - min) / (max - min || 1)) * 26,
  ]);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');

  return (
    <svg aria-hidden className={className} preserveAspectRatio="none" viewBox="0 0 100 34">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.28} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <m.path
        animate={{ opacity: 1 }}
        d={`${line} L100 34 L0 34 Z`}
        fill={`url(#${id})`}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: reduce ? 0 : delay + 0.5 }}
      />
      <m.path
        animate={{ pathLength: 1 }}
        d={line}
        fill="none"
        initial={{ pathLength: reduce ? 1 : 0 }}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        transition={{ duration: 1, delay: reduce ? 0 : delay, ease: EASE_OUT_STRONG }}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
