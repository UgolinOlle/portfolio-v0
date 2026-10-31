import { cn } from '@portfolio-v0/shadcn/utils';

import type { ComponentProps } from 'react';

/**
 * MDX table for writings and projects: one soft rounded surface, hairline row dividers, no
 * vertical rules. `not-prose` opts out of the docs prose table styles, so cells are styled here.
 * It scrolls sideways inside its own surface on narrow screens instead of widening the page.
 */
export function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    <div
      className={cn(
        'not-prose my-8 overflow-x-auto rounded-2xl ring-1 ring-zinc-200/70 ring-inset',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        'dark:ring-zinc-800/70',
      )}
      // Keyboard users need to reach the overflow to scroll it.
      tabIndex={0}
    >
      <table
        className={cn(
          'w-full min-w-[32rem] border-collapse text-left text-sm leading-relaxed',
          '[&_th]:bg-zinc-50/80 [&_th]:px-4 [&_th]:py-3 [&_th]:font-medium [&_th]:whitespace-nowrap [&_th]:text-zinc-500',
          'dark:[&_th]:bg-zinc-900/50 dark:[&_th]:text-zinc-400',
          '[&_td]:px-4 [&_td]:py-3.5 [&_td]:align-top [&_td]:text-zinc-700 dark:[&_td]:text-zinc-300',
          '[&_td:first-child]:font-medium [&_td:first-child]:text-zinc-950 dark:[&_td:first-child]:text-zinc-50',
          '[&_tbody_tr]:border-t [&_tbody_tr]:border-zinc-200/70 dark:[&_tbody_tr]:border-zinc-800/70',
          '[&_a]:underline [&_a]:decoration-zinc-300 [&_a]:underline-offset-2 [&_a]:transition-colors',
          'hover:[&_a]:decoration-zinc-900 dark:[&_a]:decoration-zinc-600 dark:hover:[&_a]:decoration-zinc-100',
          '[&_code]:rounded-md [&_code]:bg-zinc-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]',
          'dark:[&_code]:bg-zinc-800',
          className,
        )}
        {...props}
      />
    </div>
  );
}
