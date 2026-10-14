import { cn } from '@portfolio-v0/shadcn/utils';

import type { ReactNode } from 'react';

type SectionHeadingProps = {
  readonly children: ReactNode;
  /** Optional trailing element (e.g. a "see all" link), placed after the rule. */
  readonly action?: ReactNode;
  readonly className?: string;
};

/** Shared home section title: label + hairline rule, so every section reads the same. */
export function SectionHeading({ children, action, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-6 flex items-center gap-4', className)}>
      <h2 className="text-lg font-medium tracking-tight whitespace-nowrap">{children}</h2>
      <span aria-hidden="true" className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
