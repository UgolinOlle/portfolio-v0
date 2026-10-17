# 002 — Reveal heatmap cells with WAAPI instead of 336 `motion.div`s

- **Status**: TODO
- **Commit**: 632a9fe
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file (`packages/activity/activity-heatmap.tsx`), ~60 lines changed

## Problem

Every heatmap cell is its own `motion.div` animating `opacity` and the `scale` shorthand with a
per-cell delay (up to 0.5s) — 336 concurrent JS-driven animations on every mount (and ~670 during
a tab crossfade, because the outgoing grid is still mounted). `scale` is a Motion shorthand: it
runs on the main thread via rAF, and it starts exactly while React is mounting these nodes and the
tab pill spring is playing. Cells whose `day` is `null` (partial first/last week) animate too even
though they are `visibility: hidden`. The comment claiming the animation is "compositor-only" is
true of the properties, not of the driver.

```tsx
// packages/activity/activity-heatmap.tsx:45-56 — current
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
```

```tsx
// packages/activity/activity-heatmap.tsx:71-98 — current
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
```

```tsx
// packages/activity/activity-heatmap.tsx:130-143 — current
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
```

## Target

Cells become plain `div`s. One `useLayoutEffect` on mount plays a WAAPI animation per visible cell
(`element.animate`, compositor-driven, unaffected by main-thread work). Same wave shape (delay =
distance × 12ms, capped at 500ms), same duration (260ms), same curve
`cubic-bezier(0.16, 1, 0.3, 1)`, same `scale(0.4)` → `scale(1)` + opacity 0 → 1.

Hidden-until-revealed: cells render with inline `opacity: 0` (so server HTML and the pre-reveal
frames have no flash of full-opacity cells — the same guarantee `initial="hidden"` gave). The
animation uses `fill: 'both'`; when it finishes the inline opacity is cleared and the animation
cancelled so no forward-filling animation keeps 336 layers alive.

Reduced motion (handled here, since this no longer goes through Motion): opacity-only fade,
200ms, no wave delay, no scale.

```tsx
// target — new module-level helper (replaces cellVariants)
const WAVE_STEP_S = 0.012;
const WAVE_MAX_DELAY_S = 0.5;

// Each cell is delayed by its distance from the top-left corner: a diagonal wave.
function getWaveDelayMs(weekIndex: number, dayIndex: number) {
  return Math.min(Math.sqrt(weekIndex ** 2 + dayIndex ** 2) * WAVE_STEP_S, WAVE_MAX_DELAY_S) * 1000;
}
```

```tsx
// target — ActivityCell (no `delay` prop, no motion)
interface ActivityCellProps {
  weekIndex: number;
  dayIndex: number;
  visible: boolean;
  intensity: string | undefined;
  size: number;
  radius: number;
}

const ActivityCell = React.memo(function ActivityCell({
  weekIndex,
  dayIndex,
  visible,
  intensity,
  size,
  radius,
}: ActivityCellProps) {
  return (
    <div
      data-week={weekIndex}
      data-day={dayIndex}
      data-empty={visible ? undefined : ''}
      className={cn('shrink-0', !intensity && 'bg-foreground/[0.06]')}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: intensity,
        visibility: visible ? 'visible' : 'hidden',
        opacity: 0,
      }}
    />
  );
});
```

```tsx
// target — inside ActivityHeatmap, next to containerRef
const gridRef = React.useRef<HTMLDivElement>(null);

// Mount-only reveal. Runs before paint (no flash); WAAPI keeps the wave on the compositor even
// while React/the tab swap are busy on the main thread. Cells have inline opacity 0 until their
// animation finishes, then the inline value is cleared and the animation cancelled so no
// forward-filling animation holds a layer per cell.
React.useLayoutEffect(() => {
  const grid = gridRef.current;

  if (!grid) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animations: Animation[] = [];

  grid.querySelectorAll<HTMLElement>('[data-week]:not([data-empty])').forEach((cell) => {
    const animation = cell.animate(
      reduceMotion
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [
            { opacity: 0, transform: 'scale(0.4)' },
            { opacity: 1, transform: 'scale(1)' },
          ],
      {
        duration: reduceMotion ? 200 : 260,
        delay: reduceMotion
          ? 0
          : getWaveDelayMs(Number(cell.dataset.week), Number(cell.dataset.day)),
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'both',
      },
    );

    animation.finished.then(
      () => {
        cell.style.opacity = '';
        animation.cancel();
      },
      () => {},
    );
    animations.push(animation);
  });

  return () => animations.forEach((animation) => animation.cancel());
}, []);
```

```tsx
// target — cellGrid no longer computes delay
const cellGrid = React.useMemo(
  () =>
    columns.map((column) =>
      column.map((day) => ({
        day,
        intensity: day && day.level > 0 ? getIntensityColor(color, day.level, levels) : undefined,
      })),
    ),
  [columns, color, levels],
);
```

## Repo conventions to follow

- Keep the `React.memo` cell + the single delegated `onPointerOver` listener (they exist so hover
  never re-renders 336 cells) — only the animation driver changes. The `data-week` / `data-day`
  attributes are still what `handlePointerOver` reads (`event.target.closest('[data-week]')`).
- `'use client'` is already at the top of the file. Shared imports stay `@/lib/utils` only.
- Registry item rule: after touching `packages/activity`, run
  `bun run --cwd packages/ui registry:generate` and commit the result; never hand-edit
  `packages/ui/registry.json`.
- Before editing, `rg -n "activity" docs/` and update any doc that describes the cell reveal.

## Steps

1. In `activity-heatmap.tsx`, change the import `import { motion, type Variants } from 'motion/react';`
   → delete it entirely (this file no longer uses Motion; `ActivityTooltip` imports its own).
2. Delete the `cellVariants` constant and its 4-line comment (lines 45–56). Add the
   `WAVE_STEP_S` / `WAVE_MAX_DELAY_S` / `getWaveDelayMs` helper from the target in its place, keeping
   a one-line comment that the per-cell `filter: blur()` stays dropped for cost.
3. Replace `ActivityCellProps` and `ActivityCell` (lines 58–98) with the target versions. Keep (and
   update to match) the comment above `React.memo` (hover never re-renders cells).
4. Replace the `cellGrid` memo (lines 130–143) with the target; update the comment above it
   (now only the intensity colour is precomputed).
5. Add `gridRef` and the `React.useLayoutEffect` block from the target inside `ActivityHeatmap`,
   directly after the `containerRef` declaration.
6. On the grid wrapper `<div className="flex" style={{ gap: cellGap }} onPointerOver=… >` (line
   ~209) add `ref={gridRef}`.
7. In the cell render (line ~218–227) remove the `delay={cell.delay}` prop.
8. Run `bun run --cwd packages/ui registry:generate`.

## Boundaries

- Do NOT touch tooltip, tabs, header or `index.tsx`.
- Do NOT change the wave maths (12ms per unit of distance, 500ms cap), 260ms duration or the
  `[0.16, 1, 0.3, 1]` curve.
- Do NOT add `will-change`, and do NOT use `fill: 'forwards'` permanently — the finished handler
  must cancel the animation.
- Do NOT add a CSS file or `@keyframes` (registry items cannot ship app CSS).
- Do NOT add dependencies.
- If the code does not match the excerpts (drift since 632a9fe), STOP and report.

## Verification

- **Mechanical**: `bun run check-types` and `bun run check` pass (the latter rewrites files —
  review the diff). `rg -n "motion|Variants" packages/activity/activity-heatmap.tsx` returns
  nothing. `bun run dev` logs no hydration mismatch warning for the heatmap.
- **Feel check** (`bun run dev`, page with `<Activity>`):
  - Hard-reload: cells appear as a diagonal wave from the top-left; there is no frame where the
    full grid is visible before the wave starts (record at 10%/screen capture if in doubt).
  - Switch tabs: the new grid replays the same wave; old grid leaves with the container (plan 001).
  - Hover cells during and after the reveal: the tooltip still resolves the right cell/day.
  - DevTools → Animations panel: cell animations are listed during the reveal and none remain
    afterwards (they are cancelled); Elements → computed style of a cell shows `opacity: 1` and no
    inline `opacity`.
  - Performance panel, 4x CPU throttle, tab switch: no long main-thread tasks tied to per-frame
    Motion updates (before this change, ~336 rAF-driven style writes per frame for up to 0.76s).
  - Rendering panel → emulate `prefers-reduced-motion: reduce`: cells fade in with no scale and
    no stagger.
  - React StrictMode (dev) double-invoked effect: the reveal still plays once visibly, cells end
    fully visible.
- **Done when**: no `motion` import remains in `activity-heatmap.tsx`, cells reach opacity 1 with no
  inline `opacity` left, and the wave looks identical to before.
