import { cn } from '@/lib/utils';

import type { UsageMeter } from './types';
import { formatNumber, getUsageTone, TONE_DOT_CLASS } from './utils';

export interface UsageMetersProps {
  meters: UsageMeter[];
  locale: string;
  /** Word between value and limit, e.g. "of". */
  ofLabel?: string;
  className?: string;
}

export function UsageMeters({ meters, locale, ofLabel = 'of', className }: UsageMetersProps) {
  return (
    <dl
      className={cn('grid gap-4', className)}
      style={{ gridTemplateColumns: `repeat(${Math.max(meters.length, 1)}, minmax(0, 1fr))` }}
    >
      {meters.map((meter) => {
        const tone = getUsageTone(meter.value, meter.limit);
        const unlimited = meter.limit === null;
        const ratio = unlimited ? 0 : Math.min(meter.value / (meter.limit || 1), 1);
        const limitLabel = unlimited
          ? '∞'
          : `${formatNumber(meter.limit ?? 0, locale, 1)}${meter.unit ? ` ${meter.unit}` : ''}`;

        return (
          <div key={meter.id} className="min-w-0 space-y-1.5">
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="truncate">{meter.label}</span>
              {tone !== 'ok' && (
                <span
                  aria-hidden="true"
                  className={cn('size-1.5 shrink-0 rounded-full', TONE_DOT_CLASS[tone])}
                />
              )}
            </dt>

            <dd className="space-y-2">
              <p className="text-sm tabular-nums">
                <span className="font-medium">{formatNumber(meter.value, locale, 1)}</span>{' '}
                <span className="text-muted-foreground">
                  {ofLabel} {limitLabel}
                </span>
              </p>

              {unlimited ? (
                <div
                  aria-hidden="true"
                  className="border-t-2 border-dashed border-muted-foreground/25"
                />
              ) : (
                <div
                  role="progressbar"
                  aria-label={meter.label}
                  aria-valuemin={0}
                  aria-valuemax={meter.limit ?? 0}
                  aria-valuenow={meter.value}
                  className="h-0.5 overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className="h-full rounded-full bg-foreground transition-[width] duration-500"
                    style={{ width: `${ratio * 100}%` }}
                  />
                </div>
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
