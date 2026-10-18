'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { flushSync } from 'react-dom';

import { Button } from '@/components/ui/button';

// Old and new snapshots are stacked: the new theme is revealed by a growing circle.
const VIEW_TRANSITION_CSS = `
::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
::view-transition-old(root) { z-index: 0; }
::view-transition-new(root) { z-index: 1; }
`;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || typeof document.startViewTransition !== 'function') {
      setTheme(next);
      return;
    }

    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });

    transition.ready
      .then(() =>
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 420,
            easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        ),
      )
      .catch(() => {});
  };

  return (
    <Button
      aria-label="Toggle theme"
      className="relative active:scale-95"
      onClick={toggle}
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      <style href="app-shell-theme-transition" precedence="low">
        {VIEW_TRANSITION_CSS}
      </style>
      {/* Both icons are always mounted: the swap is CSS-only, so it never waits for hydration. */}
      <SunIcon className="scale-100 rotate-0 transition-[transform,opacity] duration-[var(--duration-slow,240ms)] ease-[cubic-bezier(0.23,1,0.32,1)] dark:scale-50 dark:-rotate-90 dark:opacity-0" />
      <MoonIcon className="absolute scale-50 rotate-90 opacity-0 transition-[transform,opacity] duration-[var(--duration-slow,240ms)] ease-[cubic-bezier(0.23,1,0.32,1)] dark:scale-100 dark:rotate-0 dark:opacity-100" />
    </Button>
  );
}
