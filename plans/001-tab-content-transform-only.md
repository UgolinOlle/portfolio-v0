# 001 — Make the tab-content swap transform + opacity only (no blur)

- **Status**: TODO
- **Commit**: 632a9fe
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file (`packages/activity/index.tsx`), ~20 lines

## Problem

When the active tab changes, the whole card body (summary, 336-cell heatmap, stats, legend) animates
in while the previous body animates out, at the same time (`AnimatePresence` default `sync` mode,
both stacked in one CSS grid cell). Three performance causes stack up:

1. `filter: blur(8px)` on a large parent whose children are themselves animating (the heatmap
   cells). Every frame the blurred layer must be re-rasterised and re-blurred. Done twice (enter +
   exit) at once.
2. `x` and `scale` are Motion shorthands: they are NOT hardware accelerated and run on the main
   thread (rAF). That is exactly the moment React is mounting ~336 new nodes (the new heatmap), so
   the first frames of the slide are dropped.
3. 350ms is over the 300ms UI budget, and the exit takes as long as the enter although the exiting
   content should just get out of the way.

```tsx
// packages/activity/index.tsx:48-67 — current
const contentVariants: Variants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? 32 : -32,
    opacity: 0,
    scale: 0.98,
    filter: 'blur(8px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
  },
  exit: (direction: number) => ({
    x: direction >= 0 ? -32 : 32,
    opacity: 0,
    scale: 0.98,
    filter: 'blur(8px)',
  }),
};
```

```tsx
// packages/activity/index.tsx:153 — current
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
```

## Target

Animate a single full `transform` string plus `opacity` (both can be handed to WAAPI, so the motion
survives the main-thread mount work). No `filter`. Enter 250ms, exit 150ms. Keep the package's
existing curve `[0.16, 1, 0.3, 1]` (a strong ease-out already used by every motion in this package;
do not introduce a second curve here).

```tsx
// target
const contentVariants: Variants = {
  enter: (direction: number) => ({
    transform: `translateX(${direction >= 0 ? 24 : -24}px) scale(0.98)`,
    opacity: 0,
  }),
  center: {
    transform: 'translateX(0px) scale(1)',
    opacity: 1,
  },
  exit: (direction: number) => ({
    transform: `translateX(${direction >= 0 ? -24 : 24}px) scale(0.98)`,
    opacity: 0,
    transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};

// and on the motion.div:
transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
```

The `animated` prop (`variants={animated ? contentVariants : undefined}`) and
`AnimatePresence initial={false}` stay exactly as they are.

## Repo conventions to follow

- Motion is imported from `'motion/react'`; variants are typed `Variants` (already imported in
  `index.tsx`).
- Exemplar of "string transform + opacity, no blur": the intent of the comment at
  `packages/activity/activity-heatmap.tsx:45-48` (blur was deliberately dropped for cost). Mirror
  that decision here.
- Before editing, run `rg -n "activity" docs/` — if a doc describes the tab-switch motion, update
  it in the same change (repo rule in `CLAUDE.md`).

## Steps

1. In `packages/activity/index.tsx`, replace the `contentVariants` object (lines 48–67) with the
   target above.
2. In the same file, change the `transition` prop on the `motion.div` (line 153) from
   `{{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}` to `{{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}`.
3. Run `bun run --cwd packages/ui registry:generate` and keep the regenerated output (never hand-edit
   `packages/ui/registry.json`).

## Boundaries

- Do NOT touch `activity-heatmap.tsx`, `activity-tooltip.tsx`, `activity-tabs.tsx`,
  `activity-header.tsx` (other plans own them).
- Do NOT change the `AnimatePresence` mode, the grid stacking, `custom={direction}` or the
  direction logic.
- Do NOT add `will-change`.
- Do NOT add dependencies.
- If the code does not match the excerpts above (drift since commit 632a9fe), STOP and report.

## Verification

- **Mechanical**: `bun run check-types` passes; `bun run check` passes (it rewrites files — review
  the diff afterwards); `git diff --stat` shows `packages/activity/index.tsx` plus the regenerated
  registry output only.
- **Feel check**: `bun run dev`, open a page that renders `<Activity>`:
  - Click through the tabs left→right and right→left: content slides in from the direction of travel
    and the old content leaves visibly faster than the new arrives.
  - Click tabs rapidly 5+ times: no snapping or restart from zero artefacts, no leftover ghost body.
  - Animations panel at 10%: no blur halo around the card body at any point, no `filter` in the
    computed styles of the moving wrapper.
  - DevTools Performance recording with 4x CPU throttle while switching tabs: the slide of the
    wrapper stays on the compositor (no long main-thread gap at the start of the slide). Compare
    against a recording of the old code if available; if frames still drop at the very start, that
    is the cell mount cost — plan 002 addresses it.
  - Toggle `prefers-reduced-motion` — covered by plan 003, not this one.
- **Done when**: no `filter` and no `x`/`scale` shorthand remains in `contentVariants`, the enter
  duration is 0.25 and the exit 0.15, and the tab switch visually matches the above.
