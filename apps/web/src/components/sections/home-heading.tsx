import { cn } from '@portfolio-v0/shadcn/utils';

import type { ReactNode } from 'react';

type HomeHeadingProps = {
  readonly children: ReactNode;
  /** Optional trailing element (e.g. a "see all" link), aligned to the baseline on the right. */
  readonly action?: ReactNode;
  readonly className?: string;
};

/** Home-only section title: large, tightly tracked, no rule. Hierarchy comes from size and space. */
export function HomeHeading({ children, action, className }: HomeHeadingProps) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1',
        className,
      )}
    >
      <h2 className="fluid-heading font-semibold text-balance text-zinc-950 dark:text-zinc-50">
        {children}
      </h2>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
