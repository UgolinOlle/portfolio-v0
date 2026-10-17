# `@whoa-studio/ui` animation system — Stage 2 plan

Status: **implemented** on `feats/ui-animations` (batches 1–6), with the deviations listed below. The sections that follow are the original plan.

## Implementation notes (what differs from the plan)

- **Motion is used in one component only (`FieldError`).** `TabsIndicator` uses Base UI's `--active-tab-*` variables, and `Alert` / `Empty` use CSS `@starting-style` (`animated` prop, opt-in): cheaper than Motion and still interruptible.
- **Not done:** `calendar` month slide (react-day-picker's `animate` needs its own keyframe classes, untestable without visual checks), `toggle-group` sliding background (no pressed-state hook without restructuring), `drawer` (vaul runs its own animation), `lib/motion` as a separate registry item (the registry generator only accepts single-file items; the code ships bundled through tsup).
- **`progress`** still transitions `width`: Base UI sets it inline, so a transform needs a rewrite.
- **`Alert` / `Empty`** are opt-in rather than on by default, so existing pages do not start moving.
- **Chart:** Recharts animates in JS, so consumers spread `useChartAnimation()` on each series.
- **Not verified visually:** frame timing, interruption and reduced-motion behaviour were not measured in a browser (the preview pane throttles frames). Check them in a real browser before release.

## 0. What the inventory showed (changes the brief)

- The components are **not in `packages/ui/src`**. They live in `packages/shadcn/components/ui/*.tsx` (51 files, ~6k lines, Base UI + Tailwind v4, `base-nova` style). `packages/ui` only bundles them (`tsup.config.ts`, one entry per component) and generates `registry.json`. Plan targets `packages/shadcn`; `motion` is declared on `packages/ui` because that is what gets published.
- **Overlays already animate**, through `tw-animate-css` keyframes (`animate-in fade-in-0 zoom-in-95`, `duration-100`). Problems: keyframes restart from zero when interrupted (open/close spam), durations are ad hoc (`100`, `150`, `200`, `ease-in-out` on sheet, `ease-linear` on sidebar, `transition-all` on button/toggle/progress/switch), `ease-in-out` and `ease-linear` used for enter/exit, no reduced-motion handling anywhere in `packages/shadcn`.
- **Base UI already owns mount/unmount** (`data-starting-style` / `data-ending-style`, `--transform-origin`, `--accordion-panel-height`, …). Overlay enter/exit therefore needs **CSS transitions, not Motion**. `AnimatePresence` on top of Base UI popups fights its unmount logic.
- `apps/web` already has the right vocabulary (`--ease-out-strong`, `--ease-in-out-strong`, `Reveal`, `useReducedMotion`). The system must **reuse these curves, not fork them**.
- A 51-file library used in dashboards and command palettes is mostly _high-frequency_ UI. The honest outcome of the animate-gate is that **most components get a token cleanup, a few get Motion, several get nothing.**

## 1. Strategy: CSS first, Motion where CSS cannot

| Need                                                                                                                                                                           | Tool                                                             | Where                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Overlay enter/exit, hover/press/focus, accordion height, switch/checkbox state                                                                                                 | **CSS transitions** on Base UI data attributes, driven by tokens | ~80% of components                                                                     |
| Sliding indicator that follows the active item (`layoutId`), mount/unmount of arbitrary content (field errors, alerts), directional slide on content swap, springs on gestures | **Motion** (`m` + `LazyMotion`, `domAnimation`, ~4.6 KB)         | Tabs, toggle-group, field, calendar, alert/empty (rare tier), progress (indeterminate) |
| Looping / predetermined                                                                                                                                                        | **CSS keyframes** (off main thread)                              | Spinner, skeleton                                                                      |
| Chart intro                                                                                                                                                                    | Recharts' own animation, gated by reduced motion                 | Chart                                                                                  |

Net effect on bundle: components that need no Motion keep zero JS cost; Motion is only imported by the ~6 files that use it, so each tsup entry stays tree-shakeable (`motion` is a dependency, externalised).

## 2. Motion foundations (tokens)

Defined once in `packages/shadcn/styles/globals.css` inside `@theme inline` so Tailwind generates utilities (`duration-fast`, `ease-out-strong`), plus a mirrored TS module for Motion.

### Duration scale

| Token                | Value | Use                                                     |
| -------------------- | ----- | ------------------------------------------------------- |
| `--duration-instant` | 0ms   | keyboard-driven, subsequent tooltips                    |
| `--duration-fast`    | 120ms | press, hover, color, toggles, tooltip                   |
| `--duration-base`    | 180ms | popover, dropdown, select, hover-card                   |
| `--duration-slow`    | 240ms | dialog, accordion, sheet/drawer enter, layout/indicator |
| `--duration-slower`  | 320ms | page-level / rare delight only                          |

Rule: **exit = ~60% of enter** (e.g. dialog 240 in / 150 out). UI stays ≤ 300ms.

### Easing

| Token                  | Value                                                                 | Use                                          |
| ---------------------- | --------------------------------------------------------------------- | -------------------------------------------- |
| `--ease-out-strong`    | `cubic-bezier(0.23, 1, 0.32, 1)` (already in `apps/web`)              | all entrances/exits, default                 |
| `--ease-in-out-strong` | `cubic-bezier(0.77, 0, 0.175, 1)` (already in `apps/web`)             | on-screen movement (indicator, sidebar)      |
| `--ease-drawer`        | `cubic-bezier(0.32, 0.72, 0, 1)`                                      | sheet / drawer                               |
| springs (Motion only)  | `snappy {duration:.28, bounce:0}`, `gentle {duration:.4, bounce:.15}` | indicator, gestures. No bounce on utility UI |

Never `ease-in`, never `transition-all`, never `scale(0)` (min `scale(0.95)` + opacity), popovers use `origin-(--transform-origin)`, modals stay centered.

### When to animate / when not

| Frequency                 | Rule                     | Examples                                                                                                  |
| ------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------- |
| 100+/day, keyboard-driven | **No animation**         | command palette open/close, select/combobox item highlight, menu item navigation, sidebar toggle shortcut |
| Tens/day                  | Near-imperceptible, fast | hover/press, tabs, toggles, tooltips (skip when a neighbour is open)                                      |
| Occasional                | Standard                 | dialog, sheet, popover, accordion, alerts                                                                 |
| Rare                      | Delight allowed          | empty state, success states, alert entrance                                                               |

Also **don't** animate: table rows, long lists (>~20 items), data the user is reading (chart values on update), anything in `prefers-reduced-motion` that moves position.

### `prefers-reduced-motion` (mandatory, ships with every change)

1. **CSS**: one global block in `globals.css` — under `reduce`, transform-based transitions on our tokens collapse (`--motion-distance: 0`, scale offsets → 1) while opacity/color transitions stay (reduced ≠ none). Components consume `--motion-scale` / distance variables rather than literal `scale-95`.
2. **Motion**: every Motion component sits under `MotionConfig reducedMotion="user"` (disables transform/layout, keeps opacity), plus `useReducedMotion()` where we need to pick a different variant (e.g. skip the slide, keep the fade).
3. **Hover gating**: all hover motion wrapped in `@media (hover: hover) and (pointer: fine)` (Tailwind: a `can-hover:` custom variant defined once).
4. Verified by checklist item per component batch (DevTools → Rendering → emulate reduced motion).

### Performance budget

- Animate `transform` and `opacity` only. Allowed exceptions: accordion/collapsible `height` (no transform equivalent, via Base UI's `--accordion-panel-height`), `clip-path`, color.
- No `transition-all`; always list properties. Remove `transition-all` from button/toggle/navigation-menu/progress.
- Motion: use the **full `transform` string** (not `x`/`y`/`scale` shorthands) for animations that must survive main-thread load; `layoutId` only for the 2–3 indicators; no `layout` on list rows.
- Imports: `import { m, LazyMotion, domAnimation } from 'motion/react'`; never the full `motion` component inside the library; `"use client"` already handled by the tsup `CLIENT_PACKAGES` list (add `motion` there).
- No blur above 2px; no animated box-shadow; no CSS-variable-driven child transforms.
- Budget: **0 JS for all overlay animation; ≤ 5 KB gz added** across the library (LazyMotion + `domAnimation`), shared across entries.

## 3. Reusable primitives

New folder `packages/shadcn/lib/motion/` (shipped to registry as one `motion` item that components depend on):

| File                                                          | Contents                                                                                                                                                                               |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tokens.ts`                                                   | `duration`, `ease`, `spring` objects mirroring the CSS tokens (single source of truth documented in both)                                                                              |
| `transitions.ts`                                              | `transition.fast/base/slow`, `transition.indicator` (spring), `transition.exit` (60% rule)                                                                                             |
| `variants.ts`                                                 | `fade`, `rise` (4–8px + fade), `pop` (scale .96 + fade), `collapse` (opacity + height for field errors), `slideX(direction)`                                                           |
| `provider.tsx`                                                | `<Motion>`: `LazyMotion(domAnimation, strict) + MotionConfig(reducedMotion="user", transition)`; thin, optional at app level, components embed it locally so no provider is _required_ |
| `use-motion-safe.ts`                                          | `useMotionSafe()` returns `{ reduce, distance(n) }` for choosing variant                                                                                                               |
| `globals.css` additions                                       | tokens, `can-hover` variant, reduced-motion block, `animate-shimmer` for skeleton                                                                                                      |
| `overlay` class recipes (in `lib/utils` or a `motion.ts` cva) | `popup-pop`, `popup-slide(side)`, `backdrop-fade` strings built from `data-starting-style/ending-style` + tokens, replacing `animate-in/out` strings across 12 files                   |

## 4. Per-component plan

Legend — **Kind**: I interactive · M mounts/unmounts · L renders lists · O overlay. **Tool**: CSS = token transitions on Base UI attributes · Motion · — = no change.

| Component                                      | Kind  | Frequency     | Opportunity                                                                                                                                                    | Tool                                             | Notes                                                                          |
| ---------------------------------------------- | ----- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------ |
| accordion                                      | I M   | occasional    | Panel height + chevron rotate                                                                                                                                  | CSS                                              | `--accordion-panel-height`, 240ms out-strong; `data-[panel-open]` rotate 120ms |
| alert                                          | M     | rare          | Entrance rise+fade when inserted                                                                                                                               | Motion (opt-in `animated` prop)                  | Off by default; `rise` variant                                                 |
| alert-dialog                                   | O M   | occasional    | Backdrop fade, popup pop (scale .96, centered origin), exit 150ms                                                                                              | CSS                                              | No dismiss on outside click means no extra feedback needed                     |
| aspect-ratio                                   | —     | —             | —                                                                                                                                                              | —                                                | Layout only                                                                    |
| avatar                                         | I     | tens          | Image fade-in on load (opacity 180ms), fallback swap                                                                                                           | CSS                                              | Prevents pop-in                                                                |
| badge                                          | —     | —             | Nothing (static); link-badge hover colour only                                                                                                                 | CSS                                              | Colour transition list only                                                    |
| breadcrumb                                     | I     | tens          | Link colour                                                                                                                                                    | CSS                                              | Token duration-fast                                                            |
| button                                         | I     | tens          | Press `scale(.97)` + colour; **remove `transition-all`, `translate-y-px` active**                                                                              | CSS                                              | Properties: `color, background-color, border-color, box-shadow, transform`     |
| button-group                                   | —     | —             | —                                                                                                                                                              | —                                                | Inherits button                                                                |
| calendar                                       | I L   | occasional    | Month change directional slide+fade (not day cells)                                                                                                            | Motion                                           | `slideX(direction)`, 180ms; day hover colour only                              |
| card                                           | —     | —             | Optional interactive-card hover lift                                                                                                                           | CSS (opt-in variant)                             | Gated by `can-hover`                                                           |
| carousel                                       | I L   | occasional    | Embla owns movement; add button press, disabled fade                                                                                                           | CSS                                              | No Motion                                                                      |
| chart                                          | M     | rare          | Recharts intro anim; disable when reduced; tooltip fade                                                                                                        | Recharts props + CSS                             | `isAnimationActive={!reduce}`                                                  |
| checkbox                                       | I     | tens          | Check indicator: scale .8→1 + opacity, border/bg colour                                                                                                        | CSS                                              | Replaces `transition-none` indicator                                           |
| collapsible                                    | I M   | occasional    | Height + opacity                                                                                                                                               | CSS                                              | Same recipe as accordion                                                       |
| combobox                                       | I O L | **100+/day**  | Popup: fade only 100ms; **no item animation**; chips enter fade                                                                                                | CSS                                              | Keyboard nav = instant                                                         |
| command                                        | I L   | **100+/day**  | **None** (palette open/close and selection instant)                                                                                                            | —                                                | Mandatory no-animation; document why                                           |
| context-menu                                   | O L   | occasional    | Popup pop from `--transform-origin`, 150ms; items none                                                                                                         | CSS                                              |                                                                                |
| dialog                                         | O M   | occasional    | Backdrop fade 180ms; popup `scale(.96)`+opacity 240ms in / 150 out, centered                                                                                   | CSS                                              | Replace keyframes with transitions (interruptible)                             |
| direction                                      | —     | —             | —                                                                                                                                                              | —                                                | Provider                                                                       |
| drawer (vaul)                                  | O I   | occasional    | Vaul owns spring/drag; align backdrop + duration to tokens, `--ease-drawer`                                                                                    | CSS                                              | No Motion                                                                      |
| dropdown-menu                                  | O L   | tens          | Popup pop 150ms from origin; sub-menus same; items none                                                                                                        | CSS                                              |                                                                                |
| empty                                          | M     | rare          | Icon/title/description staggered rise (40ms)                                                                                                                   | Motion                                           | Delight tier                                                                   |
| field                                          | M     | tens          | Error/description collapse in/out (height+opacity), invalid shake **no**                                                                                       | Motion (`collapse`)                              | Only element with real mount/unmount in forms                                  |
| hover-card                                     | O     | tens          | Popup pop 150ms, 300ms open delay stays                                                                                                                        | CSS                                              |                                                                                |
| input / textarea / input-group / native-select | I     | tens          | Focus ring + border colour only                                                                                                                                | CSS                                              | Already ok; unify duration                                                     |
| input-otp                                      | I     | occasional    | Caret blink (CSS), slot focus ring, slot fill pop (scale .95→1)                                                                                                | CSS                                              | Caret keyframe stops under reduced motion                                      |
| item                                           | I     | tens          | Hover bg only                                                                                                                                                  | CSS                                              |                                                                                |
| kbd                                            | —     | —             | —                                                                                                                                                              | —                                                |                                                                                |
| label                                          | —     | —             | —                                                                                                                                                              | —                                                |                                                                                |
| menubar                                        | O I   | tens          | Same as dropdown; hover handoff instant                                                                                                                        | CSS                                              |                                                                                |
| navigation-menu                                | O I   | tens          | Already has positioner transition; swap hand-rolled `cubic-bezier(.22,1,.36,1)`/0.35s for tokens; content directional slide kept                               | CSS                                              | Fix `data-[ending-style]:easing-[ease]` typo-ish class                         |
| pagination                                     | I     | tens          | Link hover/press only                                                                                                                                          | CSS                                              |                                                                                |
| popover                                        | O     | occasional    | Pop 180ms from origin                                                                                                                                          | CSS                                              | Remove `animate-fd-popover-*` fumadocs coupling                                |
| progress                                       | I     | occasional    | Value width→`scaleX` transform; indeterminate loop                                                                                                             | CSS (determinate), CSS keyframes (indeterminate) | Removes `transition-all`                                                       |
| radio-group                                    | I     | tens          | Dot scale+opacity, border colour                                                                                                                               | CSS                                              |                                                                                |
| resizable                                      | I     | tens          | Handle hover/focus colour; **no** panel animation (drag)                                                                                                       | CSS                                              |                                                                                |
| scroll-area                                    | I     | tens          | Scrollbar fade on idle                                                                                                                                         | CSS                                              |                                                                                |
| select                                         | O I L | tens          | Popup fade+scale .98 120ms, item none; chevron rotate                                                                                                          | CSS                                              |                                                                                |
| separator                                      | —     | —             | —                                                                                                                                                              | —                                                |                                                                                |
| sheet                                          | O M   | occasional    | Slide from side (`translate 100%`), `--ease-drawer`, 240ms in / 180 out; replace `ease-in-out`                                                                 | CSS                                              | Backdrop fade matches                                                          |
| sidebar                                        | I M   | **tens–100+** | Collapse width `ease-linear 200ms` → `ease-in-out-strong`; width transition kept (only exception), label opacity; **no animation on keyboard shortcut toggle** | CSS                                              | 688 lines — largest, needs its own batch                                       |
| skeleton                                       | —     | loop          | `animate-pulse` → opacity shimmer token, reduced = static                                                                                                      | CSS keyframes                                    |                                                                                |
| slider                                         | I     | tens          | Thumb ring on hover/focus; **never** animate value/range                                                                                                       | CSS                                              | Direct manipulation stays 1:1                                                  |
| sonner                                         | O M L | occasional    | Sonner owns motion; only theme tokens/duration via props                                                                                                       | —                                                | Don't wrap                                                                     |
| spinner                                        | loop  | —             | `animate-spin`, 800ms, stops → pulse under reduced motion                                                                                                      | CSS                                              |                                                                                |
| switch                                         | I     | tens          | Thumb translate 160ms out-strong, track colour; press stretch                                                                                                  | CSS                                              |                                                                                |
| table                                          | L     | tens          | Row hover colour only                                                                                                                                          | CSS                                              | No row enter/exit                                                              |
| tabs                                           | I     | tens          | Sliding active indicator (`layoutId`), content cross-fade 150ms                                                                                                | Motion (indicator) + CSS                         | One of two main Motion wins                                                    |
| textarea                                       | I     | —             | See inputs                                                                                                                                                     | CSS                                              |                                                                                |
| toggle                                         | I     | tens          | Press + pressed colour; remove `transition-all`                                                                                                                | CSS                                              |                                                                                |
| toggle-group                                   | I     | tens          | Sliding pressed background (`layoutId`) for `spacing=0`                                                                                                        | Motion                                           | Optional                                                                       |
| tooltip                                        | O     | tens          | Pop 125ms from origin; **instant for adjacent tooltips** (`data-instant`)                                                                                      | CSS                                              |                                                                                |

Counts: ~34 CSS-only, 6 Motion (tabs, toggle-group, field, calendar, alert, empty), 7 deliberately no change or library-owned (command, sonner, drawer internals, carousel, slider value, resizable, scroll-area), rest static.

## 5. Page / route transitions

Out of scope for the library (the UI package is not a router). Documented recipe only: `Reveal`/`Presence` primitives from `apps/web`, optionally View Transitions API in Next.js — not shipped here.

## 6. Delivery plan (Stage 3, after approval)

Each batch ends green with `bun run check-types`, `bun run check`, `bun --cwd packages/ui run build`, and a reduced-motion check.

1. **Foundations**: tokens + reduced-motion block + `can-hover` variant in `globals.css`; `lib/motion/*`; add `motion` to tsup `CLIENT_PACKAGES`; registry item + `registry:generate`.
2. **Overlay recipes**: dialog, alert-dialog, sheet, popover, hover-card, tooltip, dropdown-menu, context-menu, menubar, select, combobox, navigation-menu, drawer (keyframes → interruptible transitions).
3. **Controls**: button, toggle, switch, checkbox, radio-group, input family, progress, accordion, collapsible, avatar.
4. **Motion components**: tabs, toggle-group, field, calendar, alert, empty.
5. **Sidebar** and **loops** (skeleton, spinner, input-otp caret, chart).
6. Docs: update `docs/` architecture page + a "Motion" docs page in `apps/web` with the tokens and rules; changeset for `@whoa-studio/ui`.

## 7. Decisions needed

1. **Scope of Motion**: confirm CSS-first (above) rather than wrapping every component in `motion.*`. Recommended: yes — it keeps overlay animation interruptible, zero-JS and compatible with Base UI's unmount handling.
2. **Local `LazyMotion` vs an app-level `<Motion>` provider**: recommended local (no required setup for consumers; optional provider for app-wide `reducedMotion`).
3. **Breaking visual change**: durations/curves change on every overlay; ship as a minor changeset (pre-1.0 `0.0.0`) — acceptable?
4. **Registry**: the `packages/<item>` registry items import `@/components/ui/*`; `lib/motion` becomes a new shared registry dependency. OK to add it as a registry item?
