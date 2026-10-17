# 005 — (Conditional) Replace the `layoutId` tab pill with a CSS-transition indicator

- **Status**: TODO (gated — see Step 0)
- **Commit**: 632a9fe
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file (`packages/activity/activity-tabs.tsx`), ~50 lines

## Problem

The active-tab pill is a Motion shared-layout animation (`layoutId`), driven by a main-thread
spring. It plays at the same instant the new heatmap mounts (336 nodes) and the card body swaps.
Main-thread layout animations that coincide with navigation-like work are the classic cause of
dropped frames. This is NOT confirmed: plans 001–004 remove most of the competing main-thread
work, so this plan only proceeds if a recording still shows jank.

```tsx
// packages/activity/activity-tabs.tsx:38-44 — current
{
  isActive && (
    <motion.span
      layoutId="activity-tabs-active-pill"
      className="absolute inset-0 rounded-full bg-card shadow-sm"
      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
    />
  );
}
```

## Target

A single always-mounted indicator whose position is a measured `translateX` driven by a CSS
transition (runs off the main thread, interruptible — a new transition retargets from the current
position). Width is set directly and snaps (animating width would be a layout property); with
near-equal tab widths this is not noticeable.

- Transition: `transform 250ms cubic-bezier(0.77, 0, 0.175, 1)` (strong ease-in-out — it is
  on-screen movement), disabled with `motion-reduce:transition-none`.
- Before the first measurement (SSR / first paint) the active button renders the static pill
  itself, so there is no moment without a selected background.

```tsx
// target — activity-tabs.tsx
export function ActivityTabs({ tabs, activeTab, onChange, className }: ActivityTabsProps) {
  const buttonRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const [indicator, setIndicator] = React.useState<{ x: number; width: number } | null>(null);

  React.useLayoutEffect(() => {
    const measure = () => {
      const button = buttonRefs.current.get(activeTab);

      if (button) setIndicator({ x: button.offsetLeft, width: button.offsetWidth });
    };

    measure();

    const observer = new ResizeObserver(measure);

    buttonRefs.current.forEach((button) => observer.observe(button));

    return () => observer.disconnect();
  }, [activeTab, tabs]);

  return (
    <div
      role="tablist"
      className={cn(
        'relative flex items-center gap-1 overflow-x-auto rounded-full bg-foreground/5 p-1',
        className,
      )}
    >
      {indicator && (
        <span
          aria-hidden
          className="pointer-events-none absolute top-1 bottom-1 left-0 rounded-full bg-card shadow-sm transition-transform duration-[250ms] ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none"
          style={{ width: indicator.width, transform: `translateX(${indicator.x}px)` }}
        />
      )}

      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            ref={(node) => {
              if (node) buttonRefs.current.set(tab.id, node);
              else buttonRefs.current.delete(tab.id);
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className="relative flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
          >
            {!indicator && isActive && (
              <span aria-hidden className="absolute inset-0 rounded-full bg-card shadow-sm" />
            )}

            {/* existing label <span className="relative z-10 …"> unchanged */}
          </button>
        );
      })}
    </div>
  );
}
```

Remove the now-unused `motion` import from `activity-tabs.tsx`; keep `import * as React`.

## Repo conventions to follow

- Easing curve `cubic-bezier(0.77, 0, 0.175, 1)` is the repo's `--ease-in-out-strong`
  (`apps/web/src/app/global.css:16`). Registry items cannot depend on app CSS variables, so it is
  inlined as a Tailwind arbitrary value.
- `'use client'` already at top of file; shared imports only via `@/lib/utils`.
- After the change: `bun run --cwd packages/ui registry:generate`.

## Steps

0. **Gate**: plans 001–004 must be DONE. Record a DevTools Performance trace (4x CPU throttle,
   and a real mid-range phone via remote debugging if available) of switching tabs 5 times. If the
   pill's travel shows no dropped frames and no long task overlapping it, set this plan's
   Status to `WONTFIX (not needed after 001–004)` in this file and in `plans/README.md`, and STOP.
1. Replace the body of `activity-tabs.tsx` with the target above (keep the existing label
   `<span>` block — icon/dot, `tab.label`, `style={isActive ? { color: tab.color } : undefined}` —
   inside each button exactly as it is today).
2. Delete `import { motion } from 'motion/react';`.
3. Run `bun run --cwd packages/ui registry:generate`.

## Boundaries

- Do NOT change tab semantics (`role`, `aria-selected`, `onChange`), colours, or the label markup.
- Do NOT animate `width`/`left`; only `transform` has a transition.
- Do NOT touch other files; do NOT add dependencies.
- If the file differs from the excerpt (drift since 632a9fe), STOP and report.

## Verification

- **Mechanical**: `bun run check-types`, `bun run check` pass; registry regenerated.
- **Feel check**:
  - Click tabs in both directions: the pill slides to the new tab, no overshoot (this is not a
    spring), and spamming tabs retargets smoothly from wherever the pill currently is.
  - Hard reload: the active tab has its pill background immediately (static fallback), then the
    moving pill takes over without a visible flash/jump.
  - Resize the window / change font size so tab widths change: the pill follows with no drift.
  - Scroll the tablist horizontally on a narrow viewport (it is `overflow-x-auto`): the pill stays
    aligned with the active tab.
  - Reduced-motion emulation: the pill jumps instantly.
  - Re-record the Performance trace from Step 0: the pill's transform is compositor-driven and no
    main-thread frame budget overruns coincide with the tab switch.
- **Done when**: no `motion`/`layoutId` remains in `activity-tabs.tsx` and the checks pass.
