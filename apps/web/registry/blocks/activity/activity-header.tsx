import { RotateCw } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export interface ActivityHeaderProps {
  title: string;
  period?: string;
  onRefresh?: () => void;

  /** Full override for the refresh button. */
  refreshButton?: React.ReactNode;

  className?: string;
}

export function ActivityHeader({
  title,
  period,
  onRefresh,
  refreshButton,
  className,
}: ActivityHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-3', className)}>
      <div className="flex flex-wrap items-center gap-2.5">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>

        {period && (
          <span className="rounded-full border border-border/60 bg-card/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {period}
          </span>
        )}
      </div>

      {refreshButton ?? (
        <button
          type="button"
          onClick={onRefresh}
          aria-label="Refresh"
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card/70 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
        >
          <RotateCw className="size-3.5" />
        </button>
      )}
    </div>
  );
}
