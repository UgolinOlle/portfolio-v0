'use client';
import { useTranslations } from '@fuma-translate/react';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { Search } from 'lucide-react';
import type { ComponentProps } from 'react';

import { type ButtonProps, buttonVariants } from '../../../components/ui/button';
import { cn } from '../../../lib/cn';

export interface SearchTriggerProps extends Omit<ComponentProps<'button'>, 'color'>, ButtonProps {
  hideIfDisabled?: boolean;
}

export function SearchTrigger({
  hideIfDisabled,
  size = 'icon-sm',
  color = 'ghost',
  ...props
}: SearchTriggerProps) {
  const { setOpenSearch, enabled } = useSearchContext();
  const t = useTranslations({ note: 'search trigger' });
  if (hideIfDisabled && !enabled) return null;

  return (
    <button
      type="button"
      className={cn(
        buttonVariants({
          size,
          color,
        }),
        props.className,
      )}
      data-search=""
      aria-label={t('Open Search', { note: 'aria-label' })}
      onClick={() => {
        setOpenSearch(true);
      }}
    >
      <Search />
    </button>
  );
}

export interface FullSearchTriggerProps extends ComponentProps<'button'> {
  hideIfDisabled?: boolean;
}

export function FullSearchTrigger({ hideIfDisabled, ...props }: FullSearchTriggerProps) {
  const { enabled, hotKey, setOpenSearch } = useSearchContext();
  const t = useTranslations({ note: 'search trigger' });
  if (hideIfDisabled && !enabled) return null;

  return (
    <button
      type="button"
      data-search-full=""
      {...props}
      className={cn(
        'bg-fd-secondary/50 text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground inline-flex items-center gap-2 rounded-lg border p-1.5 ps-2 text-sm transition-colors',
        props.className,
      )}
      onClick={() => {
        setOpenSearch(true);
      }}
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
    </button>
  );
}
