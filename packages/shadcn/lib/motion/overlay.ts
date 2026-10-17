/*
  Class recipes for Base UI overlays. Base UI keeps the element mounted until its exit transition
  ends and flags the first/last frame with `data-starting-style` / `data-ending-style`, so a
  plain CSS transition does the whole job: it is interruptible (keyframes restart from zero),
  costs no JS, and stays on the compositor.

  Tailwind v4 maps `scale-*` / `translate-*` to the individual `scale` / `translate` properties,
  hence `transition-[opacity,scale]` rather than `transform`. `--motion-pop-scale` and
  `--motion-offset` become neutral under `prefers-reduced-motion` (see `styles/globals.css`), which
  leaves a plain fade.
*/

// Dimmed layer behind a modal.
export const backdrop =
  'transition-opacity duration-(--duration-base) ease-out-strong data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-(--duration-fast)';

// Modal content: centered in the viewport, so it keeps the default transform-origin.
export const popupCentered =
  'transition-[opacity,scale] duration-(--duration-slow) ease-out-strong data-starting-style:scale-(--motion-pop-scale) data-starting-style:opacity-0 data-ending-style:scale-(--motion-pop-scale) data-ending-style:opacity-0 data-ending-style:duration-(--duration-base)';

// Popover, hover card, menu: grows out of the trigger.
export const popupAnchored =
  'origin-(--transform-origin) transition-[opacity,scale] duration-(--duration-base) ease-out-strong data-starting-style:scale-(--motion-pop-scale) data-starting-style:opacity-0 data-ending-style:scale-(--motion-pop-scale) data-ending-style:opacity-0 data-ending-style:duration-(--duration-fast)';

// Combobox, command palette: opened constantly while typing, so opacity only, no movement.
export const popupFade =
  'transition-opacity duration-(--duration-fast) ease-out-strong data-starting-style:opacity-0 data-ending-style:opacity-0';

// Tooltip: shorter, and skipped entirely when another tooltip was just open (`data-instant`).
export const popupTooltip =
  'origin-(--transform-origin) transition-[opacity,scale] duration-(--duration-fast) ease-out-strong data-starting-style:scale-(--motion-pop-scale) data-starting-style:opacity-0 data-ending-style:scale-(--motion-pop-scale) data-ending-style:opacity-0 data-instant:transition-none';

// Edge-anchored panel. Pure slide (the offset is a full panel, from its own size); reduced motion
// swaps it for a fade.
export const sheetBase =
  'transition-[opacity,translate] duration-(--duration-slow) ease-drawer data-ending-style:duration-(--duration-base) motion-reduce:data-ending-style:opacity-0 motion-reduce:data-starting-style:opacity-0';

export const sheetSide = {
  top: 'data-ending-style:translate-y-[calc(-100%*var(--motion-offset))] data-starting-style:translate-y-[calc(-100%*var(--motion-offset))]',
  right:
    'data-ending-style:translate-x-[calc(100%*var(--motion-offset))] data-starting-style:translate-x-[calc(100%*var(--motion-offset))]',
  bottom:
    'data-ending-style:translate-y-[calc(100%*var(--motion-offset))] data-starting-style:translate-y-[calc(100%*var(--motion-offset))]',
  left: 'data-ending-style:translate-x-[calc(-100%*var(--motion-offset))] data-starting-style:translate-x-[calc(-100%*var(--motion-offset))]',
} as const;
