'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import Link from 'next/link';
import type { ReactNode } from 'react';

import { useTranslation } from '~/components/i18n/i18n-provider';
import type { RegistryItem } from '~/lib/registry';

type RegistryCardProps = {
  item: RegistryItem;
  preview?: ReactNode;
};

export const RegistryCard = ({ item, preview }: RegistryCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="group relative flex flex-col overflow-hidden">
      <div className="relative rounded-xl border bg-card">
        <div className={cn('border-blur h-40 shrink-0', preview && 'p-2')}>
          {preview ?? (
            <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
              {t('registry.card.previewComingSoon')}
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

      <Link className="py-2 text-center text-sm font-medium hover:underline" href={item.href}>
        {item.title}
      </Link>
    </div>
  );
};
