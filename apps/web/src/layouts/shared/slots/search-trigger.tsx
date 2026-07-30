'use client';
import { type ButtonProps, buttonVariants } from '@portfolio-v0/shadcn/components/button';
import { cn } from '@portfolio-v0/shadcn/utils';

import { Dialog } from '@base-ui/react/dialog';
import { useTranslations } from '@fuma-translate/react';
import { useSearchContext } from '@fumadocs/base-ui/contexts/search';
import { Search } from 'lucide-react';
import type { ComponentProps } from 'react';

export type SearchTriggerProps = Omit<ComponentProps<'button'>, 'variant' | 'className'> &
  ButtonProps & {
    hideIfDisabled?: boolean;
  };

export function SearchTrigger({
  hideIfDisabled,
  size = 'icon-sm',
  variant = 'ghost',
  ...props
}: SearchTriggerProps) {
  const { enabled, dialogHandle } = useSearchContext();
  const t = useTranslations({ note: 'search trigger' });
  if (hideIfDisabled && !enabled) return null;

  return (
    <Dialog.Trigger
      handle={dialogHandle}
      type="button"
      className={cn(
        buttonVariants({
          size,
          variant,
        }),
        props.className,
      )}
      data-search=""
      aria-label={t('Open Search', { note: 'aria-label' })}
    >
      <Search />
    </Dialog.Trigger>
  );
}

export interface FullSearchTriggerProps extends ComponentProps<'button'> {
  hideIfDisabled?: boolean;
}

export function FullSearchTrigger({ hideIfDisabled, ...props }: FullSearchTriggerProps) {
  const { enabled, hotKey, dialogHandle } = useSearchContext();
  const t = useTranslations({ note: 'search trigger' });
  if (hideIfDisabled && !enabled) return null;

  return (
    <Dialog.Trigger
      handle={dialogHandle}
      type="button"
      data-search-full=""
      {...props}
      className={cn(
        'bg-fd-secondary/50 text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground inline-flex items-center gap-2 rounded-lg border p-1.5 ps-2 text-sm transition-colors',
        props.className,
      )}
    >
      <Search className="size-4" />
      {t('Search')}
      <div className="ms-auto inline-flex gap-0.5">
        {hotKey.map((k, i) => (
          <kbd key={i} className="bg-fd-background rounded-md border px-1.5">
            {k.display}
          </kbd>
        ))}
      </div>
    </Dialog.Trigger>
  );
}
