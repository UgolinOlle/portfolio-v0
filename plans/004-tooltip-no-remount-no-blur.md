# 004 — Keep one hover tooltip mounted; drop animated + backdrop blur

- **Status**: DONE
- **Commit**: 632a9fe
- **Severity**: HIGH
- **Category**: Frequency + Performance
- **Estimated scope**: 1 file (`packages/activity/activity-tooltip.tsx`), ~15 lines

## Problem

The heatmap tooltip is shown on every cell the cursor crosses (hundreds of times per session). The
`motion.div` is keyed by `day.date`, so moving from one cell to the next unmounts one tooltip (exit
animation) and mounts another (enter animation) at once: sweeping across the grid stacks 2–3
overlapping tooltips. Each animates `filter: blur(4px)` over a `backdrop-blur-md` surface, so two
blurs are re-evaluated every frame against the 336-cell grid underneath. `scale`/`y` are Motion
shorthands (main thread). After the first tooltip is visible, moving to a neighbouring cell should
just swap its content instantly — only appearing/disappearing deserves motion.

```tsx
// packages/activity/activity-tooltip.tsx:50-62 — current
      <AnimatePresence>
        {day && (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, scale: 0.9, y: flip ? -4 : 4, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: flip ? -4 : 4, filter: 'blur(4px)' }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'w-max rounded-xl border border-border/50 bg-card/80 px-3 py-2 text-xs whitespace-nowrap shadow-lg backdrop-blur-md',
              className,
            )}
          >
```

## Target

- Constant key (`key="tooltip"`), so a day→day change updates content in place with no animation.
  When `day` becomes `null`, `AnimatePresence` keeps rendering the last content during the exit —
  the existing "position is never cleared" behaviour in `activity-heatmap.tsx` is unchanged.
- Open/close animates `opacity` and a single `transform` string (hardware-accelerated, one
  element), 180ms, curve `[0.16, 1, 0.3, 1]` (package curve, unchanged). No `filter`.
- Scale from the cell, not the centre: `transform-origin` is the edge facing the hovered cell
  (`bottom center` when the tooltip sits above the cell, `top center` when flipped below it).
- Remove `backdrop-blur-md` and raise the surface opacity `bg-card/80` → `bg-card/95` so it stays
  legible without a live blur.

```tsx
// target
      <AnimatePresence>
        {day && (
          <motion.div
            key="tooltip"
            initial={{
              opacity: 0,
              transform: `translateY(${flip ? -4 : 4}px) scale(0.9)`,
            }}
            animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
            exit={{
              opacity: 0,
              transform: `translateY(${flip ? -4 : 4}px) scale(0.9)`,
            }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: flip ? 'top center' : 'bottom center' }}
            className={cn(
              'w-max rounded-xl border border-border/50 bg-card/95 px-3 py-2 text-xs whitespace-nowrap shadow-lg',
              className,
            )}
          >
```

## Repo conventions to follow

- Component/prop shapes in this file stay as they are (`ActivityTooltipProps` unchanged); the
  heatmap keeps owning position/flip state (`activity-heatmap.tsx:117-121`).
- Motion imports from `'motion/react'`; Tailwind classes via `cn`.
- Before editing, `rg -n "tooltip" docs/` and update any doc describing it.

## Steps

1. In `packages/activity/activity-tooltip.tsx` replace the `motion.div` opening block shown above
   with the target block (props `key`, `initial`, `animate`, `exit`, `transition`, new `style`,
   `className` string). Leave the two `<p>` children and the closing tags untouched.
2. Run `bun run --cwd packages/ui registry:generate`.

## Boundaries

- Do NOT add animated position changes (a glide between cells is a separate, optional idea, not
  part of this plan).
- Do NOT change `activity-heatmap.tsx` (pointer handlers, state shape).
- Do NOT reintroduce `filter` or `backdrop-filter` anywhere in the tooltip.
- Do NOT add dependencies.
- If the file differs from the excerpt (drift since 632a9fe), STOP and report.

## Verification

- **Mechanical**: `bun run check-types`, `bun run check` pass; registry regenerated.
- **Feel check** (`bun run dev`):
  - Move the cursor slowly across several cells: the tooltip appears once (fade + slight rise +
    scale from its bottom edge), then on each new cell its text changes instantly and its position
    jumps to the new cell — no re-fade, no second tooltip ghosting.
  - Leave the grid: it fades out in place near the last cell (does not jump to the top-left).
  - Leave and re-enter quickly (before 180ms passes): it reverses smoothly from its current state,
    no restart from zero.
  - Hover a cell in the top row (flipped tooltip below the cell): it scales from its top edge.
  - Text and border remain clearly legible over the coloured cells with `bg-card/95` in both light
    and dark themes.
  - Animations panel at 10%: no `filter` or `backdrop-filter` in the tooltip's computed style
    during the transition.
  - Performance recording while sweeping across 20+ cells at 4x CPU throttle: no style-recalc /
    paint spikes proportional to the number of cells crossed.
- **Done when**: only one tooltip element exists in the DOM at any moment (check in Elements while
  sweeping) and the checks above pass.
