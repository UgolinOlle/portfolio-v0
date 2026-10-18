'use client';

import {
  AnimatePresence,
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';
import type { MotionValue } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { AnimatedNumber } from './animated-number';
import type { MonthPoint } from './data';
import { EASE_OUT_STRONG } from './motion';

/*
  The "evil chart": a grouped bar chart built from springs.

  - Every bar's height is a spring on its *data value*; the y-axis maximum is a spring too, and
    bar heights are derived from both (`value / axis * height`). A range change therefore moves the
    gridlines and the bars on the same curve, with no layout pass: only SVG geometry attributes and
    transforms change, driven by motion values, so React does not re-render per frame.
  - Forecast and closed-won use different spring configs and delays, so they never land together.
  - Bars are drawn taller than they need to be and clipped at the baseline, which keeps the top
    corners round at any height without distorting them with `scaleY`.
  - The tooltip follows the cursor on its own spring. Columns are focusable (arrow keys, Home/End),
    and focus drives the same tooltip, so keyboard users get the same readout.
  - Reduced motion: springs jump to their value, the tooltip stops trailing, nothing grows.
*/

export type SeriesId = 'forecast' | 'won';

export const SERIES: ReadonlyArray<{
  id: SeriesId;
  label: string;
  top: string;
  bottom: string;
  glow: string;
}> = [
  { id: 'forecast', label: 'Forecast', top: '#ff8f55', bottom: '#e9521a', glow: '#ff6b2c' },
  { id: 'won', label: 'Closed won', top: '#6e96ff', bottom: '#2e52c4', glow: '#4167e0' },
];

const MARGIN = { top: 26, right: 6, bottom: 28, left: 46 };
const BAR_GAP = 6;
const MAX_BAR = 22;
const BASELINE_BLEED = 12;
const TOOLTIP_W = 180;
const TOOLTIP_H = 112;

const BAR_SPRING = {
  forecast: { stiffness: 150, damping: 13, mass: 1 },
  won: { stiffness: 250, damping: 18, mass: 0.9 },
} as const;
const AXIS_SPRING = { stiffness: 130, damping: 22, mass: 1 };
const TOOLTIP_SPRING = { stiffness: 520, damping: 38, mass: 0.6 };
const LIFT_SPRING = { type: 'spring', stiffness: 420, damping: 30 } as const;

const fmtK = (v: number) => (v === 0 ? '$0' : `$${Math.round(v)}K`);

/** Smallest "nice" step that keeps the axis to at most six intervals. */
function niceAxis(max: number) {
  for (const step of [50, 100, 200, 250, 500, 1000]) {
    const top = Math.ceil(max / step) * step;
    if (top / step <= 6) return { max: top, step };
  }
  return { max: Math.ceil(max / 1000) * 1000, step: 1000 };
}

function useElementSize<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () =>
      setSize({ width: Math.round(el.clientWidth), height: Math.round(el.clientHeight) });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

/* -------------------------------------------------------------------------------------------------
 * Gridline
 * -----------------------------------------------------------------------------------------------*/

function GridLine({
  tick,
  axis,
  innerH,
  innerW,
}: {
  tick: number;
  axis: MotionValue<number>;
  innerH: MotionValue<number>;
  innerW: number;
}) {
  const y = useTransform([axis, innerH], ([a, h]: number[]) => h - (tick / a) * h);
  return (
    <m.g
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      style={{ y }}
      transition={{ duration: 0.25 }}
    >
      <line
        stroke="white"
        strokeOpacity={tick === 0 ? 0.14 : 0.06}
        x1={0}
        x2={innerW}
        y1={0}
        y2={0}
      />
      <text className="fill-(--d2-muted) text-[11px] tabular-nums" dy={4} textAnchor="end" x={-10}>
        {fmtK(tick)}
      </text>
    </m.g>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Bar
 * -----------------------------------------------------------------------------------------------*/

function Bar({
  series,
  value,
  x,
  width,
  delay,
  axis,
  innerH,
  lift,
  glow,
  opacity,
  gradientId,
  glowId,
}: {
  series: (typeof SERIES)[number];
  value: number;
  x: number;
  width: number;
  delay: number;
  axis: MotionValue<number>;
  innerH: MotionValue<number>;
  lift: number;
  glow: boolean;
  opacity: number;
  gradientId: string;
  glowId: string;
}) {
  const reduce = useReducedMotion();
  const spring = useSpring(reduce ? value : 0, BAR_SPRING[series.id]);

  React.useEffect(() => {
    if (reduce) {
      spring.jump(value);
      return;
    }
    const t = window.setTimeout(() => spring.set(value), delay * 1000);
    return () => window.clearTimeout(t);
  }, [value, delay, reduce, spring]);

  const h = useTransform([spring, axis, innerH], ([v, a, ih]: number[]) =>
    Math.max(0, (v / a) * ih),
  );
  const y = useTransform([h, innerH], ([hh, ih]: number[]) => ih - hh);
  const drawn = useTransform(h, (hh) => hh + BASELINE_BLEED);

  return (
    <m.g animate={{ x, y: lift, opacity }} initial={{ x, y: 0, opacity }} transition={LIFT_SPRING}>
      <AnimatePresence>
        {glow && (
          <m.rect
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            fill={series.glow}
            filter={`url(#${glowId})`}
            height={drawn}
            initial={{ opacity: 0 }}
            key="glow"
            rx={5}
            transition={{ duration: 0.2 }}
            width={width}
            y={y}
          />
        )}
      </AnimatePresence>
      <m.rect
        animate={{ width }}
        fill={`url(#${gradientId})`}
        height={drawn}
        initial={false}
        rx={5}
        stroke="white"
        strokeOpacity={0.14}
        y={y}
      />
    </m.g>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Tooltip
 * -----------------------------------------------------------------------------------------------*/

function Tooltip({
  point,
  focus,
  x,
  y,
  visible,
}: {
  point: MonthPoint;
  focus: SeriesId | null;
  x: MotionValue<number>;
  y: MotionValue<number>;
  visible: boolean;
}) {
  const attainment = point.forecast === 0 ? 0 : (point.won / point.forecast) * 100;
  return (
    <m.div
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 z-10 rounded-xl border border-white/10 bg-[#161616]/95 p-3 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md"
      initial={false}
      style={{ x, y, width: TOOLTIP_W, transformOrigin: 'left center' }}
      transition={{ duration: visible ? 0.14 : 0.1, ease: EASE_OUT_STRONG }}
    >
      <p className="text-[11px] font-medium text-(--d2-fg)">{point.long}</p>
      <ul className="mt-2.5 flex flex-col gap-1">
        {SERIES.map((s) => (
          <li
            className={cn(
              'flex items-center gap-2 rounded-lg px-2 py-1 text-[11px] transition-colors duration-150',
              focus === s.id ? 'bg-white/[0.07]' : 'bg-transparent',
            )}
            key={s.id}
          >
            <span className="size-2 rounded-full" style={{ background: s.glow }} />
            <span className="flex-1 text-(--d2-muted)">{s.label}</span>
            <AnimatedNumber
              className="font-medium text-(--d2-fg) tabular-nums"
              duration={0.45}
              format={(n) => fmtK(n)}
              value={point[s.id]}
            />
          </li>
        ))}
      </ul>
      <div className="mt-2.5 border-t border-white/[0.07] pt-2.5 text-[11px] text-(--d2-muted)">
        <AnimatedNumber
          className="font-medium text-(--d2-fg) tabular-nums"
          duration={0.45}
          format={(n) => `${Math.round(n)}%`}
          value={attainment}
        />{' '}
        of forecast closed
      </div>
    </m.div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Chart
 * -----------------------------------------------------------------------------------------------*/

export interface EvilChartProps {
  points: MonthPoint[];
  /** Monthly pace implied by the revenue target, in $K. */
  monthlyTarget: number;
  targetLabel: string;
  hidden: ReadonlySet<SeriesId>;
  /** Seconds before the first bars start to grow. */
  startDelay?: number;
  className?: string;
}

export function EvilChart({
  points,
  monthlyTarget,
  targetLabel,
  hidden,
  startDelay = 0,
  className,
}: EvilChartProps) {
  const uid = React.useId().replace(/:/g, '');
  const reduce = useReducedMotion();
  const [wrapRef, { width, height }] = useElementSize<HTMLDivElement>();

  const innerW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerHpx = Math.max(0, height - MARGIN.top - MARGIN.bottom);

  const shownSeries = SERIES.filter((s) => !hidden.has(s.id));
  const peak = Math.max(monthlyTarget, ...points.flatMap((p) => shownSeries.map((s) => p[s.id])));
  const { max: axisMax, step } = niceAxis(peak * 1.06);
  const ticks = Array.from({ length: Math.round(axisMax / step) + 1 }, (_, i) => i * step);

  const axis = useSpring(axisMax, AXIS_SPRING);
  const innerH = useMotionValue(innerHpx);
  React.useEffect(() => {
    if (reduce) axis.jump(axisMax);
    else axis.set(axisMax);
  }, [axisMax, axis, reduce]);
  React.useEffect(() => {
    innerH.set(innerHpx);
  }, [innerHpx, innerH]);

  // Intro choreography only runs once; later range changes use a tighter stagger.
  const [intro, setIntro] = React.useState(true);
  React.useEffect(() => {
    const t = window.setTimeout(() => setIntro(false), (startDelay + 2) * 1000);
    return () => window.clearTimeout(t);
  }, [startDelay]);

  /* Geometry */
  const n = points.length;
  const k = Math.max(1, shownSeries.length);
  const colW = n ? innerW / n : 0;
  const barW = Math.max(4, Math.min(MAX_BAR, (colW * 0.66 - BAR_GAP * (k - 1)) / k));
  const groupW = barW * k + BAR_GAP * (k - 1);
  const colX = (i: number) => i * colW;
  const barX = (seriesIndex: number) => (colW - groupW) / 2 + seriesIndex * (barW + BAR_GAP);

  /* Interaction */
  const [hover, setHover] = React.useState<{ index: number; series: SeriesId | null } | null>(null);
  const [focusIndex, setFocusIndex] = React.useState<number | null>(null);
  const activeIndex = hover?.index ?? focusIndex;
  const activeSeries = hover?.series ?? null;

  const tx = useSpring(0, TOOLTIP_SPRING);
  const ty = useSpring(0, TOOLTIP_SPRING);
  const place = (px: number, py: number, instant: boolean) => {
    const flip = px + 18 + TOOLTIP_W > width - 4;
    const x = Math.max(4, flip ? px - 18 - TOOLTIP_W : px + 18);
    const y = Math.min(Math.max(0, py - TOOLTIP_H / 2), Math.max(0, height - TOOLTIP_H));
    if (instant || reduce) {
      tx.jump(x);
      ty.jump(y);
    } else {
      tx.set(x);
      ty.set(y);
    }
  };

  const lastPoint = React.useRef<MonthPoint | undefined>(points[0]);
  const activePoint = activeIndex == null ? undefined : points[activeIndex];
  if (activePoint) lastPoint.current = activePoint;

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const lx = px - MARGIN.left;
    if (lx < 0 || lx > innerW || py < MARGIN.top - 12 || py > height - MARGIN.bottom + 8 || !colW) {
      if (hover) setHover(null);
      return;
    }
    const index = Math.min(n - 1, Math.max(0, Math.floor(lx / colW)));
    const inCol = lx - colX(index);
    let series: SeriesId | null = null;
    let best = Infinity;
    shownSeries.forEach((s, j) => {
      const d = Math.abs(inCol - (barX(j) + barW / 2));
      if (d < best) {
        best = d;
        series = s.id;
      }
    });
    place(px, py, hover === null);
    if (hover?.index !== index || hover.series !== series) setHover({ index, series });
  };

  const focusColumn = (i: number) => {
    const el = wrapRef.current?.querySelectorAll<SVGGElement>('[data-col]')[i];
    el?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (focusIndex == null) return;
    const move: Record<string, number> = {
      ArrowLeft: Math.max(0, focusIndex - 1),
      ArrowRight: Math.min(n - 1, focusIndex + 1),
      Home: 0,
      End: n - 1,
    };
    if (e.key in move) {
      e.preventDefault();
      focusColumn(move[e.key]);
    } else if (e.key === 'Escape') {
      (document.activeElement as HTMLElement | null)?.blur();
    }
  };

  const yFor = (v: number) => MARGIN.top + innerHpx - (v / axisMax) * innerHpx;
  const targetY = useTransform([axis, innerH], ([a, h]: number[]) => h - (monthlyTarget / a) * h);

  const gradient = (id: SeriesId) => `${uid}-${id}`;
  const clipId = `${uid}-clip`;
  const targetClipId = `${uid}-tclip`;
  const glowId = `${uid}-glow`;

  return (
    <div
      className={cn('relative touch-pan-y select-none', className)}
      onKeyDown={onKeyDown}
      onPointerLeave={() => setHover(null)}
      onPointerMove={onPointerMove}
      ref={wrapRef}
    >
      {width > 0 && height > 0 && (
        <svg
          aria-label="Revenue forecast by month. Use the arrow keys to move between months."
          className="absolute inset-0 overflow-visible"
          height={height}
          role="group"
          width={width}
        >
          <defs>
            {SERIES.map((s) => (
              <linearGradient id={gradient(s.id)} key={s.id} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={s.top} />
                <stop offset="100%" stopColor={s.bottom} />
              </linearGradient>
            ))}
            <filter height="240%" id={glowId} width="240%" x="-70%" y="-70%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
            <clipPath id={clipId}>
              <rect height={innerHpx + 40} width={innerW + 16} x={-8} y={-40} />
            </clipPath>
            <clipPath id={targetClipId}>
              <m.rect
                animate={{ width: innerW + 4 }}
                height={innerHpx + 60}
                initial={{ width: reduce ? innerW + 4 : 0 }}
                transition={{
                  duration: 0.9,
                  delay: reduce ? 0 : startDelay + 0.9,
                  ease: EASE_OUT_STRONG,
                }}
                x={-2}
                y={-30}
              />
            </clipPath>
          </defs>

          <g transform={`translate(${MARGIN.left} ${MARGIN.top})`}>
            {/* Axis + gridlines */}
            <AnimatePresence initial={false}>
              {ticks.map((t) => (
                <GridLine axis={axis} innerH={innerH} innerW={innerW} key={t} tick={t} />
              ))}
            </AnimatePresence>

            {/* Columns */}
            <g aria-label="Monthly revenue" clipPath={`url(#${clipId})`} role="list">
              <AnimatePresence initial={false}>
                {points.map((p, i) => {
                  const isActive = activeIndex === i;
                  const dimmed = activeIndex != null && !isActive;
                  return (
                    <m.g
                      animate={{ x: colX(i), opacity: dimmed ? 0.34 : 1 }}
                      data-col=""
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      initial={{ x: colX(i), opacity: 0 }}
                      key={p.id}
                      transition={{
                        x: { type: 'spring', stiffness: 170, damping: 24 },
                        opacity: { duration: 0.2 },
                      }}
                    >
                      <rect
                        className="fill-white transition-[fill-opacity] duration-150"
                        fillOpacity={isActive ? 0.035 : 0}
                        height={innerHpx + 40}
                        rx={10}
                        width={colW}
                        y={-40}
                      />
                      {SERIES.map((s) => {
                        const j = shownSeries.findIndex((x) => x.id === s.id);
                        const visible = j !== -1;
                        const focused = isActive && (activeSeries == null || activeSeries === s.id);
                        const order =
                          i * (intro ? 0.085 : 0.03) + (s.id === 'won' ? (intro ? 0.14 : 0.05) : 0);
                        return (
                          <Bar
                            axis={axis}
                            delay={(intro ? startDelay : 0) + order}
                            glow={focused && visible}
                            glowId={glowId}
                            gradientId={gradient(s.id)}
                            innerH={innerH}
                            key={s.id}
                            lift={focused && visible ? (activeSeries ? -6 : -4) : 0}
                            opacity={!visible ? 0 : isActive && !focused ? 0.55 : 1}
                            series={s}
                            value={visible ? p[s.id] : 0}
                            width={barW}
                            x={barX(Math.max(0, j))}
                          />
                        );
                      })}
                    </m.g>
                  );
                })}
              </AnimatePresence>
            </g>

            {/* Target line: revealed left to right once the bars have landed. */}
            <g clipPath={`url(#${targetClipId})`}>
              <m.g style={{ y: targetY }}>
                <line
                  stroke="white"
                  strokeDasharray="5 5"
                  strokeOpacity={0.55}
                  x1={0}
                  x2={innerW}
                  y1={0}
                  y2={0}
                />
              </m.g>
            </g>
            <m.g
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              style={{ y: targetY }}
              transition={{ duration: 0.3, delay: reduce ? 0 : startDelay + 1.5 }}
            >
              <g transform={`translate(${Math.max(0, innerW - 108)} -29)`}>
                <title>{`Monthly pace: ${fmtK(monthlyTarget)}`}</title>
                <rect
                  fill="#1c1c1c"
                  height={22}
                  rx={11}
                  stroke="white"
                  strokeOpacity={0.14}
                  width={108}
                />
                <text
                  className="fill-(--d2-fg) text-[11px] font-medium"
                  dominantBaseline="central"
                  textAnchor="middle"
                  x={54}
                  y={11.5}
                >
                  {targetLabel}
                </text>
              </g>
            </m.g>

            {/* Month labels + focusable hit areas */}
            <g role="list">
              {points.map((p, i) => (
                <g
                  aria-label={`${p.long}: forecast ${fmtK(p.forecast)}, closed won ${fmtK(p.won)}`}
                  className="outline-none"
                  data-col-hit=""
                  key={p.id}
                  onBlur={() => setFocusIndex((cur) => (cur === i ? null : cur))}
                  onFocus={(e) => {
                    // Mouse focus is ignored: the pointer already drives the tooltip.
                    if (!e.currentTarget.matches(':focus-visible')) return;
                    setFocusIndex(i);
                    if (!hover) {
                      const top = yFor(Math.max(p.forecast, p.won));
                      place(MARGIN.left + colX(i) + colW / 2 + groupW / 2, top + 40, !activePoint);
                    }
                  }}
                  role="listitem"
                  tabIndex={0}
                  transform={`translate(${colX(i)} 0)`}
                >
                  <rect className="fill-transparent" height={innerHpx + 40} width={colW} y={-40} />
                  <text
                    className={cn(
                      'text-[11px] font-medium transition-[fill] duration-150',
                      activeIndex === i ? 'fill-(--d2-fg)' : 'fill-(--d2-muted)',
                    )}
                    textAnchor="middle"
                    x={colW / 2}
                    y={innerHpx + 19}
                  >
                    {p.label}
                  </text>
                  {focusIndex === i && (
                    <rect
                      fill="none"
                      height={innerHpx + 8}
                      rx={10}
                      stroke="white"
                      strokeOpacity={0.45}
                      strokeWidth={1.5}
                      width={colW}
                      y={0}
                    />
                  )}
                </g>
              ))}
            </g>
          </g>
        </svg>
      )}

      {lastPoint.current && (
        <Tooltip
          focus={activeSeries}
          point={lastPoint.current}
          visible={activeIndex != null}
          x={tx}
          y={ty}
        />
      )}
    </div>
  );
}
