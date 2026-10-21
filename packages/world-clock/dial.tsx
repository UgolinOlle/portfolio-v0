'use client';

import { Moon, Sun } from 'lucide-react';
import { animate, m, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/utils';

import { HAND } from './motion';
import { playTick, primeSound } from './sound';
import { formatTime, type CityView } from './time';

const SIZE = 400;
const C = SIZE / 2;
/** Dial radii in viewBox units; HTML layers use the same numbers as percentages of the box. */
const R_RING = 196;
const R_BAND = 182;
const R_LABEL = 158;
const R_DAY_OUTER = 146;
const R_DAY_INNER = 92;
const R_MARKER = 118;
const R_SUN = 146;
const R_HAND_INNER = 72;

const pct = (units: number) => `${(units / SIZE) * 100}%`;
/** Noon at the top, midnight at the bottom, clockwise. */
const hourAngle = (hours: number) => (hours - 12) * 15;
const polar = (radius: number, degrees: number) => {
  const rad = (degrees * Math.PI) / 180;
  return [C + radius * Math.sin(rad), C - radius * Math.cos(rad)] as const;
};
const point = (radius: number, degrees: number) =>
  polar(radius, degrees)
    .map((n) => n.toFixed(2))
    .join(' ');

/** Shortest-path angle: keeps rotating through 180° instead of unwinding a full turn at midnight. */
function unwrap(previous: number, target: number) {
  return previous + ((((target - previous) % 360) + 540) % 360) - 180;
}

function arcSpan(city: CityView, from: number, to: number) {
  const start = hourAngle(from);
  // A polar day or night has no edges: stop a hair short of a full circle so the path stays valid.
  const span = Math.min((((hourAngle(to) - start) % 360) + 360) % 360 || 360, 359.9);
  return { start, end: start + span, large: span > 180 ? 1 : 0, key: city.id };
}

function daySector(city: CityView) {
  const { start, end, large } = arcSpan(city, city.sunrise, city.sunset);
  if (city.dayLength <= 0.01) return '';
  return [
    `M ${point(R_DAY_OUTER, start)}`,
    `A ${R_DAY_OUTER} ${R_DAY_OUTER} 0 ${large} 1 ${point(R_DAY_OUTER, end)}`,
    `L ${point(R_DAY_INNER, end)}`,
    `A ${R_DAY_INNER} ${R_DAY_INNER} 0 ${large} 0 ${point(R_DAY_INNER, start)}`,
    'Z',
  ].join(' ');
}

function nightBand(city: CityView) {
  const { start, end, large } = arcSpan(city, city.sunset, city.sunrise + 24);
  if (city.dayLength >= 23.99) return '';
  return `M ${point(R_BAND, start)} A ${R_BAND} ${R_BAND} 0 ${large} 1 ${point(R_BAND, end)}`;
}

const TICKS = Array.from({ length: 24 }, (_, hour) => ({
  hour,
  major: hour % 6 === 0,
}));

const LABELS = [
  { hour: 12, text: 'Noon' },
  { hour: 18, text: '6 PM' },
  { hour: 0, text: '12 AM' },
  { hour: 6, text: '6 AM' },
];

const MARKER_MOVE =
  'transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none';

function Marker({
  city,
  selected,
  onSelect,
}: {
  city: CityView;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const angle = useRef(hourAngle(city.hours));
  angle.current = unwrap(angle.current, hourAngle(city.hours));

  return (
    <div
      aria-hidden={selected || undefined}
      className={cn('pointer-events-none absolute inset-0', MARKER_MOVE)}
      style={{ transform: `rotate(${angle.current}deg)` }}
    >
      <button
        aria-label={`${city.name}, ${formatTime(city)}. Show on the dial`}
        className={cn(
          'pointer-events-auto absolute flex size-[7.5%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full outline-none after:absolute after:top-1/2 after:left-1/2 after:size-[max(100%,1.5rem)] after:-translate-1/2',
          'transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:ring-2 focus-visible:ring-[color:var(--wc-focus)]',
          selected && 'pointer-events-none scale-50 opacity-0',
          MARKER_MOVE,
        )}
        onClick={() => onSelect(city.id)}
        style={{
          left: '50%',
          top: pct(C - R_MARKER),
          transform: `translate(-50%, -50%) rotate(${-angle.current}deg)`,
        }}
        tabIndex={selected ? -1 : 0}
        type="button"
      >
        <span
          className={cn(
            'block size-[0.6rem] rounded-full border transition-colors duration-300',
            city.isDay
              ? 'border-[color:var(--wc-day)] bg-[color:var(--wc-day)]'
              : 'border-[color:var(--wc-text)] bg-transparent',
          )}
        />
        <span className="pointer-events-none absolute top-[78%] text-[0.625rem] leading-none font-semibold tracking-wide text-[color:var(--wc-text)]/85">
          {city.short}
        </span>
      </button>
    </div>
  );
}

export function Dial({
  views,
  selected,
  onSelect,
  onScrub,
  sound,
  children,
}: {
  views: CityView[];
  selected: CityView;
  onSelect: (id: string) => void;
  /** Dragging or arrow-keying the sun asks the clock to move by this many minutes. */
  onScrub: (deltaMinutes: number) => void;
  /** Click while the sun moves. */
  sound: boolean;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const target = hourAngle(selected.hours);
  const rotate = useMotionValue(0);
  const upright = useTransform(rotate, (value) => -value);
  const seeded = useRef(false);
  const box = useRef<HTMLDivElement>(null);
  const current = useRef(selected);
  current.current = selected;
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const next = unwrap(rotate.get(), target);
    // While the sun is under the finger the hand must be glued to it: no spring.
    if (reduceMotion || dragging) {
      rotate.set(next);
      return;
    }
    // First paint sweeps in from noon; later changes retarget from wherever the hand is now.
    seeded.current = true;
    const controls = animate(rotate, next, HAND);
    return () => controls.stop();
  }, [target, reduceMotion, dragging, rotate]);

  const MINUTES_PER_DAY = 1440;
  const SNAP = 5;

  /** Moves the clock so the selected city's time matches the pointer's angle on the dial. */
  const scrubTo = (event: PointerEvent<HTMLElement>) => {
    const rect = box.current?.getBoundingClientRect();
    if (!rect) return;
    const degrees =
      ((Math.atan2(
        event.clientX - (rect.left + rect.width / 2),
        rect.top + rect.height / 2 - event.clientY,
      ) *
        180) /
        Math.PI +
        360) %
      360;
    const wanted = (Math.round(((degrees / 15 + 12) % 24) * (60 / SNAP)) * SNAP) % MINUTES_PER_DAY;
    const now = current.current.hour * 60 + current.current.minute;
    const delta =
      ((((wanted - now) % MINUTES_PER_DAY) + 1.5 * MINUTES_PER_DAY) % MINUTES_PER_DAY) -
      MINUTES_PER_DAY / 2;
    if (!delta) return;
    onScrub(delta);
    if (sound) playTick(wanted % 60 === 0);
  };

  const onSunKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const step = {
      ArrowRight: SNAP,
      ArrowUp: SNAP,
      ArrowLeft: -SNAP,
      ArrowDown: -SNAP,
      PageUp: 60,
      PageDown: -60,
    }[event.key];
    if (!step) return;
    event.preventDefault();
    event.stopPropagation();
    onScrub(step);
    if (sound) {
      primeSound();
      const next =
        (((current.current.hour * 60 + current.current.minute + step) % 1440) + 1440) % 1440;
      playTick(next % 60 === 0);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = views.findIndex((view) => view.id === selected.id);
    const step =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : 0;
    if (!step) return;
    event.preventDefault();
    onSelect(views[(index + step + views.length) % views.length].id);
  };

  return (
    <div
      ref={box}
      className="relative aspect-square w-full select-none"
      onKeyDown={onKeyDown}
      role="group"
      aria-label="24-hour dial"
    >
      <svg aria-hidden className="absolute inset-0 size-full" viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <circle
          cx={C}
          cy={C}
          fill="var(--wc-face)"
          r={R_RING}
          stroke="var(--wc-line)"
          strokeWidth={1.5}
        />
        {[100, R_MARKER, 136].map((radius) => (
          <circle
            key={radius}
            cx={C}
            cy={C}
            fill="none"
            r={radius}
            stroke="var(--wc-text)"
            strokeDasharray="0.5 5"
            strokeLinecap="round"
            strokeOpacity={0.22}
            strokeWidth={1.5}
          />
        ))}

        {views.map((view) => (
          <g
            key={view.id}
            className="transition-opacity duration-300 ease-out motion-reduce:transition-none"
            opacity={view.id === selected.id ? 1 : 0}
          >
            <path
              d={daySector(view)}
              fill="var(--wc-day)"
              fillOpacity={0.14}
              stroke="var(--wc-day)"
              strokeLinejoin="round"
              strokeOpacity={0.3}
              strokeWidth={1}
            />
            <path
              d={nightBand(view)}
              fill="none"
              stroke="var(--wc-text)"
              strokeLinecap="round"
              strokeOpacity={0.14}
              strokeWidth={7}
            />
          </g>
        ))}

        {TICKS.map(({ hour, major }) => {
          const angle = hourAngle(hour);
          const [x1, y1] = polar(R_RING, angle);
          const [x2, y2] = polar(R_RING - (major ? 8 : 4.5), angle);
          return (
            <line
              key={hour}
              stroke="var(--wc-text)"
              strokeLinecap="round"
              strokeOpacity={major ? 0.7 : 0.32}
              strokeWidth={major ? 1.6 : 1.2}
              x1={x1}
              x2={x2}
              y1={y1}
              y2={y2}
            />
          );
        })}
        {LABELS.map(({ hour, text }) => {
          const [x, y] = polar(R_LABEL, hourAngle(hour));
          return (
            <text
              key={text}
              dominantBaseline="central"
              fill="var(--wc-muted)"
              fontSize={12}
              textAnchor="middle"
              x={x}
              y={y}
            >
              {text}
            </text>
          );
        })}
      </svg>

      {views.map((view) => (
        <Marker key={view.id} city={view} onSelect={onSelect} selected={view.id === selected.id} />
      ))}

      {/* Hand and sun: one rotating layer, the sun counter-rotates to stay upright. */}
      <m.div aria-hidden className="pointer-events-none absolute inset-0" style={{ rotate }}>
        <span
          className="absolute left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-[color:var(--wc-hand)]"
          style={{ top: pct(C - R_SUN + 14), height: pct(R_SUN - 14 - R_HAND_INNER) }}
        />
        <span
          aria-label={`${selected.name} time`}
          aria-orientation="horizontal"
          aria-valuemax={1439}
          aria-valuemin={0}
          aria-valuenow={selected.hour * 60 + selected.minute}
          aria-valuetext={formatTime(selected)}
          className={cn(
            'pointer-events-auto absolute flex size-[11%] -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center rounded-full bg-[color:var(--wc-hand)] text-[color:var(--wc-bg)] shadow-[0_6px_20px_rgb(0_0_0/0.45)] outline-none',
            'cursor-grab transition-transform duration-150 ease-out focus-visible:ring-2 focus-visible:ring-[color:var(--wc-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--wc-face)]',
            dragging ? 'scale-110 cursor-grabbing' : 'can-hover:hover:scale-105',
          )}
          onKeyDown={onSunKeyDown}
          onLostPointerCapture={() => setDragging(false)}
          onPointerDown={(event) => {
            primeSound();
            event.currentTarget.setPointerCapture(event.pointerId);
            setDragging(true);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) scrubTo(event);
          }}
          role="slider"
          style={{ left: '50%', top: pct(C - R_SUN) }}
          tabIndex={0}
        >
          <span
            className={cn(
              'absolute inset-0 rounded-full bg-[color:var(--wc-hand)]/40',
              !dragging &&
                'motion-safe:animate-[wc-pulse_2.4s_cubic-bezier(0.23,1,0.32,1)_infinite]',
            )}
          />
          <m.span
            className="relative grid size-[52%] place-items-center"
            style={{ rotate: upright }}
          >
            <Sun
              className={cn(
                'col-start-1 row-start-1 size-full transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]',
                !selected.isDay && 'scale-75 opacity-0',
              )}
              strokeWidth={2}
            />
            <Moon
              className={cn(
                'col-start-1 row-start-1 size-full transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]',
                selected.isDay && 'scale-75 opacity-0',
              )}
              strokeWidth={2}
            />
          </m.span>
        </span>
      </m.div>

      <div className="pointer-events-none absolute top-1/2 left-1/2 w-[34%] -translate-x-1/2 -translate-y-1/2 text-center">
        {children}
      </div>
    </div>
  );
}
