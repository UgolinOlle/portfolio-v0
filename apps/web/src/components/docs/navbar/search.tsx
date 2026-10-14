'use client';

import { Kbd } from '@portfolio-v0/shadcn/components/kbd';
import { cn } from '@portfolio-v0/shadcn/utils';

import { useSearchContext } from 'fumadocs-ui/contexts/search';

import { SearchIcon } from '~/components/icons/ui';
import { useModifierKey } from '~/hooks/use-modifier-key';

type SearchProps = {
  className?: string;
};

export const Search = ({ className }: SearchProps) => {
  const { setOpenSearch } = useSearchContext();
  const modKey = useModifierKey();

  return (
    // Icon-only below `lg` so the header fits between 768px and 1024px.
    <button
      aria-label="Rechercher"
      className={cn(
        'group flex items-center gap-2 border-s border-foreground/5 px-4 text-sm text-foreground/55 transition-colors lg:w-64',
        'hover:bg-foreground/3 hover:text-foreground/80 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
        className,
      )}
      onClick={() => setOpenSearch(true)}
      type="button"
    >
      <SearchIcon className="size-3.5 shrink-0" />
      <span className="hidden flex-1 text-start lg:inline">Rechercher…</span>
      <span aria-hidden="true" className="hidden items-center gap-0.5 lg:flex">
        <Kbd className="h-5 rounded-none border bg-transparent text-[0.6875rem]">{modKey}</Kbd>
        <Kbd className="h-5 rounded-none border bg-transparent text-[0.6875rem]">K</Kbd>
      </span>
    </button>
  );
};
