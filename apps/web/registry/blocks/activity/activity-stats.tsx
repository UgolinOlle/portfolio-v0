import { cn } from '@/lib/utils';

import type { ActivityStat } from './types';

export interface ActivityStatsProps {
  color: string;
  active: ActivityStat;
  longest: ActivityStat;
  current: ActivityStat;
  className?: string;
}

export function ActivityStats({ color, active, longest, current, className }: ActivityStatsProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-x-5 gap-y-1 text-sm', className)}>
      {[active, longest, current].map((stat) => (
        <div key={stat.label} className="flex items-center gap-1.5 text-muted-foreground">
          <span>{stat.label}</span>
          <span className="font-semibold" style={{ color }}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
