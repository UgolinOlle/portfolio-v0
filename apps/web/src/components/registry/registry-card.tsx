'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import Link from 'next/link';
import type { ReactNode } from 'react';

import { useTranslation } from '~/components/core/i18n-provider';
import { ArrowUpRightIcon } from '~/components/icons/ui';
import type { RegistryItem } from '~/lib/registry';

type RegistryCardProps = {
  item: RegistryItem;
  preview?: ReactNode;
};

// A cell of the hairline grid (see RegistryGrid): square, borderless on top/left, with the
// title link stretched over the whole cell so it's a single tab stop.
export const RegistryCard = ({ item, preview }: RegistryCardProps) => {
  const { t } = useTranslation();

  return (
    <article
      className={cn(
        'group relative flex flex-col border-e border-b border-foreground/5 transition-colors [content-visibility:auto]',
        'hover:bg-foreground/2 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:-outline-offset-2 has-[a:focus-visible]:outline-ring',
      )}
    >
      <div
        className={cn(
          'relative aspect-[4/3] overflow-hidden',
          'bg-[radial-gradient(color-mix(in_oklch,var(--color-foreground)_10%,transparent)_1px,transparent_1px)] bg-size-[16px_16px]',
        )}
      >
        {preview ? (
          <div className="size-full transition-transform duration-300 group-hover:scale-[1.015]">
            {preview}
          </div>
        ) : (
          <div className="label-mono flex size-full items-center justify-center text-foreground/40">
            {t('registry.card.previewComingSoon')}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 border-t border-foreground/5 px-4 py-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 className="truncate text-sm font-medium">
            <Link
              className="after:absolute after:inset-0 focus-visible:outline-none"
              href={item.href}
            >
              {item.title}
            </Link>
          </h3>
          {item.description && (
            <p className="line-clamp-1 text-xs text-foreground/50">{item.description}</p>
          )}
        </div>
        <span
          aria-hidden="true"
          className={cn(
            'flex size-7 shrink-0 items-center justify-center border border-foreground/10 text-foreground/50 transition-colors',
            'group-hover:border-foreground group-hover:bg-foreground group-hover:text-background',
          )}
        >
          <ArrowUpRightIcon className="size-3.5" />
        </span>
      </div>
    </article>
  );
};
