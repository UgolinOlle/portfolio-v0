# Creating components, blocks and templates

Three kinds of registry item, three different pipelines. The mechanics of the generated registry are in [architecture.md](architecture.md); the short contributor checklist is in [`CONTRIBUTING.md`](../CONTRIBUTING.md). This file is the full recipe, including the design and motion rules every item must follow.

| Kind          | Lives in                                   | Registry                                          | Installed to                              | Docs page in                   |
| ------------- | ------------------------------------------ | ------------------------------------------------- | ----------------------------------------- | ------------------------------ |
| **Component** | `packages/<name>/index.tsx` (single file)  | `packages/ui/registry.json` (generated), `ui`     | `components/ui/ugolin/<name>.tsx`         | `apps/web/content/components/` |
| **Block**     | `packages/<name>/` (`index.tsx` + modules) | `packages/ui/registry.json` (generated), `block`  | `components/blocks/<name>/`               | `apps/web/content/blocks/`     |
| **Template**  | `packages/templates/registry/<name>/`      | `packages/templates/registry.json` (hand-written) | `components/blocks/<name>/` (via the CLI) | `apps/web/content/templates/`  |

A template is a full page-level composition (app shell, dashboard); a block is a self-contained section or card; a component is one reusable element.

## Mandatory: design + animate + motion

**Never write a component, block or template without going through the three skills below, in this order.** They are not optional polish: an item that ships without them is not finished.

1. **Design: `frontend-design` skill** (distinctive visual direction, typography, spacing, no templated defaults). For public marketing pages and landing blocks, also use `design-taste-frontend`; for dashboard / app screens do **not** (it is for public pages only). Pick the direction (palette, density, type scale, surface style) _before_ writing JSX and keep it consistent across the whole item.
2. **Animate: `animate` skill.** Decide, per element, whether it should animate at all, why, with which tool, which properties, curve, duration, how it interrupts and how it exits. High-frequency UI (tables, command palettes, keyboard-driven actions) usually gets none or almost none. Audit afterwards with `review-animations`.
3. **Motion: `motion` skill** (Motion / Framer Motion for React). Use it when CSS cannot do the job: staggered entrances, `layoutId` indicators, `AnimatePresence`, springs, count-ups, gestures, charts.

### Motion rules (shared with `packages/shadcn`, see [ui-animation-plan.md](ui-animation-plan.md))

- **CSS first, Motion where CSS cannot.** Hover, press, focus, state toggles and Base UI overlays (`data-starting-style` / `data-ending-style`) are CSS transitions on the tokens (`--duration-fast|base|slow`, `--ease-out-strong`). Never `AnimatePresence` on top of a Base UI popup.
- **Animate `transform` and `opacity` only.** No `transition-all`, no animating `width` / `height` / `top` / `left`, never `scale(0)` (start at `0.95` + opacity).
- **Curves and durations:** entrances use `cubic-bezier(0.23, 1, 0.32, 1)` (`EASE_OUT_STRONG`), on-screen movement `cubic-bezier(0.77, 0, 0.175, 1)`; UI stays ≤ 300 ms, exit ≈ 60 % of enter; never `ease-in`; no bounce on utility UI.
- **Stagger** list/grid entrances by ~40 ms (`staggerChildren: 0.04`); keep a block's variants in a sibling `motion.ts` (see `packages/templates/registry/app-shell-1/motion.ts`) so all files share one vocabulary.
- **Reduced motion is mandatory.** Wrap the item's root in `<LazyMotion features={domAnimation} strict><MotionConfig reducedMotion="user">…</MotionConfig></LazyMotion>` and use the `m.*` components (not `motion.*`) so the bundle stays small and transforms are dropped for users who ask for less motion. Standalone components that use `motion.*` directly must call `useReducedMotion()`.
- **Interruptible:** transitions, not keyframes that restart from zero; springs for gesture hand-off.
- Looping or predetermined effects (spinners, skeletons) are CSS keyframes, not Motion.
- Import from `motion/react` and list `motion` in the item's `dependencies`.

Before calling an item done: check it in a real browser (the preview pane throttles frames) in light **and** dark mode, at phone width, with `prefers-reduced-motion` on, and with the worst-case data (`break-ui` skill).

## Creating a component (`type: ui`)

A single `index.tsx`, one export per concern, no sibling modules.

1. Run the three skills above on the idea, then create `packages/<name>/` with `index.tsx`, `package.json`, `tsconfig.json`.
2. `package.json` follows [`CONTRIBUTING.md`](../CONTRIBUTING.md) step 2 with `"registry": { "title": "…", "type": "ui" }`. `dependencies` must be exactly the npm packages the file imports (usually `motion`, `class-variance-authority`, `react`, `react-dom`).
3. Import only through the aliases: `@/lib/utils` (`cn`), `@/components/ui/<primitive>`, `@/components/ui/ugolin/<other>`. Add `'use client';` for hooks, state, effects, handlers or `motion`.
4. Expose the motion decisions as props where useful (`animated`, `loading`, …) and give hover/press states `can-hover:` guards so touch devices don't stick.
5. Add `apps/web/examples/<name>.tsx` (the demo, becomes `<name>-demo`), then `apps/web/content/components/<folder>/<name>.mdx` with `preview: <name>` and list it in the folder's `meta.json`.
6. Add `"@portfolio-v0/<name>": "workspace:*"` to `devDependencies` in `packages/ui/package.json` (and any new npm dep to its `dependencies`), then `bun install`.
7. `bun run --cwd packages/ui registry:generate`, commit the regenerated `registry.json`, run `bun run check-types` and `bun run check`.

## Creating a block (`type: block`)

Multi-file: `index.tsx` is the entry, the rest are internal modules imported **relatively** (`./motion`, `./data`). Same steps as a component, plus:

- `"registry": { "title": "…", "type": "block" }`; installed under `components/blocks/<name>/`.
- Split by responsibility: `index.tsx` (composition + `LazyMotion` / `MotionConfig` provider), `motion.ts` (variants), `data.ts` (sample data), one file per sub-part. Keep sample data replaceable via props.
- Docs page in `apps/web/content/blocks/<folder>/<name>.mdx`; add `previewWidth` in the frontmatter when the block is designed at a fixed width so the grid thumbnail scales.
- Other registry items are reached through `@/components/ui/ugolin/<x>` / `@/components/blocks/<x>`, never relative paths across packages.

## Creating a template

Templates are page-level blocks distributed by the `@whoa-studio/templates` CLI and listed under `/ui/templates`. They are **not** generated from `packages/*/package.json`: their registry is hand-written.

1. Run the three skills on the whole page, not on each part in isolation: the template needs one visual direction, one motion vocabulary (`motion.ts`), a dark-mode story and a responsive story (sidebar collapses, panes stack).
2. Put the sources in `packages/templates/registry/<name>/` (`index.tsx` exports the shell/page component, plus `motion.ts`, `data.ts`, one file per part). Import shared code through `@/lib/utils` and `@/components/ui/<x>` only; add `'use client';` where needed; wrap the root in `LazyMotion` + `MotionConfig reducedMotion="user"`.
3. Register it in `packages/templates/registry.json`: `type: registry:block`, explicit `dependencies` (npm) and `registryDependencies` (shadcn primitives), and one `files` entry per source with `type: registry:component` and `target: components/blocks/<name>/<file>`. Keep dependency lists exact: nothing is derived here.
4. Add the demo `apps/web/examples/<name>.tsx` (imports the template from `@/components/blocks/<name>`; use realistic data) and the docs page `apps/web/content/templates/<group>/<name>.mdx` with `preview: <name>`; list it in the group's `meta.json`. Document the CLI command `npx @whoa-studio/templates add <name>` and the props the user must pass.
5. List the template in `packages/templates/README.md` (Templates section).
6. `bun run --cwd packages/templates registry:build`, check `apps/web/public/r/<name>.json` and `/r/templates.json`, then `bun run check-types` and `bun run check`. Restart `bun run dev` to pick up registry changes.

## Common mistakes

- Hand-editing `packages/ui/registry.json` (generated) or committing edits in `apps/web/public/r/` (build output).
- Declared npm dependencies that don't match imports, or a new dependency missing from `packages/ui/package.json`.
- Relative imports across packages, or a missing `'use client';`.
- Docs page without `preview`, or not listed in `meta.json`, so it never appears in the tree.
- Motion without a reduced-motion path, `transition-all`, animating layout properties, or `motion.*` instead of `m.*` inside `LazyMotion strict`.
