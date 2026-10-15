'use client';

import { motion, type Variants } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { ActivityTooltip } from './activity-tooltip';
import type { ActivityDataPoint } from './types';
import { buildHeatmapWeeks, getIntensityColor, type HeatmapDay } from './utils';

export interface ActivityHeatmapProps {
  data: ActivityDataPoint[];
  color: string;

  /** Category name shown in the hover tooltip, e.g. "Writing". */
  categoryLabel: string;

  /** Unit shown next to the value in the hover tooltip, e.g. "words". */
  unit?: string;

  levels?: number;
  cellSize?: number;
  cellGap?: number;
  cellRadius?: number;
  weeks?: number;

  /** Labels for each weekday row (index 0 = week start), `undefined` hides the label. */
  dayLabels?: (string | undefined)[];

  showMonthLabels?: boolean;
  weekStartsOn?: 0 | 1;
  className?: string;
}

interface HoverPosition {
  left: number;
  top: number;
  flip: boolean;
}

const TOOLTIP_WIDTH = 180;
const FLIP_THRESHOLD = 76;

// Kept intentionally cheap: opacity + scale are compositor-only (no paint/layout), so the wave
// reveal stays smooth even with a full grid animating at once. `filter: blur()` was dropped from
// per-cell animation — it forces expensive repaints at this element count — the wave shape (each
// cell delayed by its distance from the top-left corner) is unchanged.
const cellVariants: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.26, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

interface ActivityCellProps {
  weekIndex: number;
  dayIndex: number;
  visible: boolean;
  intensity: string | undefined;
  size: number;
  radius: number;
  delay: number;
}

// Memoized so hovering the grid (which updates state on the parent) never re-renders — let alone
// re-animates — the ~300+ sibling cells: only the props of the cell that actually changed matter,
// and none of a cell's own props ever change after mount.
const ActivityCell = React.memo(function ActivityCell({
  weekIndex,
  dayIndex,
  visible,
  intensity,
  size,
  radius,
  delay,
}: ActivityCellProps) {
  return (
    <motion.div
      data-week={weekIndex}
      data-day={dayIndex}
      custom={delay}
      variants={cellVariants}
      initial="hidden"
      animate="visible"
      className={cn('shrink-0', !intensity && 'bg-foreground/[0.06]')}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: intensity,
        visibility: visible ? 'visible' : 'hidden',
      }}
    />
  );
});

export function ActivityHeatmap({
  data,
  color,
  categoryLabel,
  unit,
  levels = 5,
  cellSize = 11,
  cellGap = 3,
  cellRadius = 3,
  weeks = 48,
  dayLabels = ['Mon', undefined, 'Wed', undefined, 'Fri', undefined, undefined],
  showMonthLabels = true,
  weekStartsOn = 1,
  className,
}: ActivityHeatmapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Position is intentionally never cleared on pointer-leave: only `hoveredDay` (which controls
  // visibility) goes back to null. If `position` reset too, the tooltip would jump to (0, 0) and
  // play its fade-out there instead of shrinking back in place next to the last hovered cell.
  const [hoveredDay, setHoveredDay] = React.useState<HeatmapDay | null>(null);
  const [position, setPosition] = React.useState<HoverPosition>({ left: 0, top: 0, flip: false });

  const { columns, monthLabels } = React.useMemo(
    () => buildHeatmapWeeks(data, { weeks, weekStartsOn }),
    [data, weeks, weekStartsOn],
  );

  // Precomputed once per grid (not on every render, e.g. not on hover): each cell's intensity
  // color and wave delay, so re-renders from hover state never redo this work.
  const cellGrid = React.useMemo(
    () =>
      columns.map((column, weekIndex) =>
        column.map((day, dayIndex) => {
          const intensity =
            day && day.level > 0 ? getIntensityColor(color, day.level, levels) : undefined;
          const distance = Math.sqrt(weekIndex ** 2 + dayIndex ** 2);
          const delay = Math.min(distance * 0.012, 0.5);

          return { day, intensity, delay };
        }),
      ),
    [columns, color, levels],
  );

  // A single delegated listener on the grid (instead of one onMouseEnter/onMouseLeave pair per
  // cell) keeps cells prop-stable for `React.memo` and avoids attaching ~300+ handlers.
  const handlePointerOver = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('[data-week]');
      const container = containerRef.current;

      if (!target || !container) return;

      const weekIndex = Number(target.dataset.week);
      const dayIndex = Number(target.dataset.day);
      const day = columns[weekIndex]?.[dayIndex];

      if (!day) return;

      const cellRect = target.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const containerWidth = container.offsetWidth;
      const half = TOOLTIP_WIDTH / 2;

      const rawLeft = cellRect.left - containerRect.left + cellRect.width / 2;
      const left = Math.min(
        Math.max(rawLeft, half + 4),
        Math.max(containerWidth - half - 4, half + 4),
      );
      const top = cellRect.top - containerRect.top;

      setPosition({ left, top, flip: top < FLIP_THRESHOLD });
      setHoveredDay(day);
    },
    [columns],
  );

  const handlePointerLeave = React.useCallback(() => setHoveredDay(null), []);

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div className="overflow-x-auto">
        <div className="flex w-fit items-start gap-2">
          <div
            className="flex shrink-0 flex-col text-[11px] leading-none text-muted-foreground"
            style={{ gap: cellGap, paddingTop: showMonthLabels ? 18 : 0 }}
          >
            {dayLabels.map((label, index) => (
              <div key={index} style={{ height: cellSize }} className="flex items-center">
                {label}
              </div>
            ))}
          </div>

          <div>
            {showMonthLabels && (
              <div
                className="mb-1 flex text-[11px] leading-none text-muted-foreground"
                style={{ gap: cellGap }}
              >
                {columns.map((_, weekIndex) => (
                  <div key={weekIndex} className="shrink-0" style={{ width: cellSize }}>
                    {monthLabels.get(weekIndex)}
                  </div>
                ))}
              </div>
            )}

            <div
              className="flex"
              style={{ gap: cellGap }}
              onPointerOver={handlePointerOver}
              onPointerLeave={handlePointerLeave}
            >
              {cellGrid.map((column, weekIndex) => (
                <div key={weekIndex} className="flex flex-col" style={{ gap: cellGap }}>
                  {column.map((cell, dayIndex) => (
                    <ActivityCell
                      key={cell.day?.date ?? `${weekIndex}-${dayIndex}`}
                      weekIndex={weekIndex}
                      dayIndex={dayIndex}
                      visible={cell.day !== null}
                      intensity={cell.intensity}
                      size={cellSize}
                      radius={cellRadius}
                      delay={cell.delay}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ActivityTooltip
        day={hoveredDay}
        left={position.left}
        top={position.top}
        flip={position.flip}
        color={color}
        categoryLabel={categoryLabel}
        unit={unit}
      />
    </div>
  );
}
