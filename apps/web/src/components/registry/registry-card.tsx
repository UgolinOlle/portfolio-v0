'use client';

import { Badge } from '@portfolio-v0/shadcn/components/badge';
import { cn } from '@portfolio-v0/shadcn/utils';

import Link from 'next/link';
import type { ReactNode } from 'react';

import { useTranslation } from '~/components/i18n/i18n-provider';
import type { RegistryCategory, RegistryItem } from '~/lib/registry';

const CATEGORY_LABELS: Record<RegistryCategory, string> = {
  component: 'Component',
  block: 'Block',
  template: 'Template',
};

type RegistryCardProps = {
  item: RegistryItem;
  preview?: ReactNode;
};

export const RegistryCard = ({ item, preview }: RegistryCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card">
      {/* Contenu de la card */}
      <div className="h-40 shrink-0 border-b">
        {preview ?? (
          <div className="flex size-full items-center justify-center bg-muted/20 text-xs text-muted-foreground">
            {t('registry.card.previewComingSoon')}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link className="text-sm font-medium hover:underline" href={item.href}>
            {item.title}
          </Link>

          <Badge className="shrink-0" variant="outline">
            {CATEGORY_LABELS[item.category]}
          </Badge>
        </div>

        {item.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
        )}

        {item.dependencies && item.dependencies.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {item.dependencies.map((dependency) => (
              <Badge className="text-[10px]" key={dependency} variant="secondary">
                {dependency}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Overlay hover */}
      <div
        className={cn(
          'absolute inset-0 z-10 flex items-center justify-center bg-background/30 opacity-0',
          'backdrop-blur-md transition-all duration-300 group-hover:opacity-100',
        )}
      >
        <Link
          href={item.href}
          className={cn(
            'rounded-full bg-primary px-5 py-2 text-sm font-medium',
            'text-primary-foreground shadow-lg transition-transform duration-200 hover:scale-105',
          )}
        >
          {t('registry.card.viewDetails')}
        </Link>
      </div>
    </div>
  );
};
