# 003 — Honour `prefers-reduced-motion` across the Activity block

- **Status**: TODO
- **Commit**: 632a9fe
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file (`packages/activity/index.tsx`), ~5 lines

## Problem

Nothing in `packages/activity` reads `prefers-reduced-motion`: the tab body slides 24–32px, the
shared-layout pill travels, the tooltip scales/shifts, the refresh icon spins 360°, and the heatmap
reveals as a scale-in wave. Reduced motion should mean fewer and gentler animations, not zero:
keep opacity changes, drop position/scale/rotation.

```tsx
// packages/activity/index.tsx:128-131 — current (root of the component's return)
  return (
    <div
      className={cn('w-full max-w-4xl rounded-3xl border border-border/60 bg-muted p-3', className)}
    >
```

## Target

Wrap the component's whole tree in Motion's `MotionConfig` with `reducedMotion="user"`. Under that
setting Motion keeps opacity/colour animations but skips transform (including `transform` strings,
`x`/`y`/`scale`/`rotate`) and layout animations for every `motion.*` descendant: tab body, tooltip,
refresh icon and the tab pill's `layoutId` move.

```tsx
// target
import { AnimatePresence, motion, MotionConfig, type Variants } from 'motion/react';
// …
return (
  <MotionConfig reducedMotion="user">
    <div
      className={cn('w-full max-w-4xl rounded-3xl border border-border/60 bg-muted p-3', className)}
    >
      {/* …existing children unchanged… */}
    </div>
  </MotionConfig>
);
```

The heatmap cells are NOT Motion components after plan 002 — they already branch on
`window.matchMedia('(prefers-reduced-motion: reduce)')` inside the WAAPI effect (opacity-only,
200ms, no stagger). This plan only verifies that, it does not re-implement it.

## Repo conventions to follow

- Motion imports come from `'motion/react'` only.
- `MotionConfig` wraps at the top-level component export; `ActivityHeader`, `ActivityTabs`,
  `ActivityHeatmap`, `ActivityTooltip` stay unaware of it.
- Before editing, `rg -n "reduced" docs/` — update docs if they list a11y behaviour.

## Steps

1. **Precondition**: plans 001 and 002 are DONE (this plan's feel check depends on them). If
   `activity-heatmap.tsx` still contains `motion.div` for cells, STOP and report.
2. In `packages/activity/index.tsx`, add `MotionConfig` to the `motion/react` import.
3. Wrap the returned root `<div>` in `<MotionConfig reducedMotion="user">…</MotionConfig>`
   (re-indent; no other change). The early `return null` stays as is.
4. Run `bun run --cwd packages/ui registry:generate`.

## Boundaries

- Do NOT add per-component `useReducedMotion` branches unless the feel check below fails for a
  specific element; if it fails, STOP and report which one instead of improvising.
- Do NOT remove the `animated` prop or change its meaning.
- Do NOT touch `activity-heatmap.tsx` (plan 002 owns its reduced-motion branch).
- Do NOT add dependencies.

## Verification

- **Mechanical**: `bun run check-types`, `bun run check` pass; registry regenerated.
- **Feel check**: DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion:
  reduce", then reload:
  - Tab switch: body cross-fades (opacity) with NO horizontal slide or scale; the active pill moves
    instantly (no travelling) — selection is still clearly indicated.
  - Hover a cell: tooltip fades in/out without scaling or shifting.
  - Click refresh: the icon does not spin (the `onRefresh` callback still fires).
  - Heatmap on load/tab switch: cells fade in simultaneously, no scale, no wave.
  - Switch emulation back to "no preference": all original motion returns.
- **Done when**: with reduced motion emulated, nothing in the block translates, scales or rotates,
  opacity feedback is intact, and with it off nothing changed.
