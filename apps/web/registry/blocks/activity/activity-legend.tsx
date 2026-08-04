import { cn } from '@/lib/utils';

import { getIntensityColor } from './utils';

export interface ActivityLegendProps {
  color: string;
  levels?: number;
  lessLabel?: string;
  moreLabel?: string;
  cellSize?: number;
  cellRadius?: number;
  className?: string;
}

export function ActivityLegend({
  color,
  levels = 5,
  lessLabel = 'Less',
  moreLabel = 'More',
  cellSize = 10,
  cellRadius = 3,
  className,
}: ActivityLegendProps) {
  return (
    <div className={cn('flex items-center gap-1.5 text-xs text-muted-foreground', className)}>
      <span>{lessLabel}</span>

      <div className="flex items-center gap-1">
        {Array.from({ length: levels }).map((_, level) => {
          const intensity = level > 0 ? getIntensityColor(color, level, levels) : undefined;

          return (
            <div
              key={level}
              className={cn(!intensity && 'bg-foreground/[0.06]')}
              style={{
                width: cellSize,
                height: cellSize,
                borderRadius: cellRadius,
                backgroundColor: intensity,
              }}
            />
          );
        })}
      </div>

      <span>{moreLabel}</span>
    </div>
  );
}
