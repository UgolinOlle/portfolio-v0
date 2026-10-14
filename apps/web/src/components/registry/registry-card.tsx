'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import Link from 'next/link';
import type { ReactNode } from 'react';

import { useTranslation } from '~/components/core/i18n-provider';
import { ArrowRightIcon } from '~/components/icons/ui';
import type { RegistryItem } from '~/lib/registry';

type RegistryCardProps = {
  item: RegistryItem;
  preview?: ReactNode;
};

export const RegistryCard = ({ item, preview }: RegistryCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="group relative flex flex-col gap-3 [content-visibility:auto]">
      <div
        className={cn(
          'relative overflow-hidden rounded-xl border bg-card transition-[border-color,box-shadow] duration-200',
          'group-hover:border-foreground/20 group-hover:shadow-sm',
          'group-has-[a:focus-visible]:ring-2 group-has-[a:focus-visible]:ring-ring group-has-[a:focus-visible]:ring-offset-2',
        )}
      >
        <div
          className={cn('border-blur aspect-[4/3] min-h-40 shrink-0 sm:min-h-48', preview && 'p-2')}
        >
          {preview ?? (
            <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
              {t('registry.card.previewComingSoon')}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start justify-between gap-3 px-0.5">
        <div className="min-w-0">
          {/* Stretched link: the whole card is the hit area, the title stays the accessible name. */}
          <Link
            className="text-sm font-medium outline-none after:absolute after:inset-0 after:content-['']"
            href={item.href}
          >
            {item.title}
          </Link>
          {item.description && (
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{item.description}</p>
          )}
        </div>

        <ArrowRightIcon
          aria-hidden="true"
          className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:text-foreground"
        />
      </div>
    </div>
  );
};
