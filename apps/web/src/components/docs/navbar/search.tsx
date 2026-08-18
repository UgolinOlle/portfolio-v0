'use client';

import { Kbd } from '@portfolio-v0/shadcn/components/kbd';
import { cn } from '@portfolio-v0/shadcn/utils';

import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { motion } from 'motion/react';

import { SearchIcon } from '~/components/icons/ui';

type SearchProps = {
  className?: string;
};

export const Search = ({ className }: SearchProps) => {
  const { setOpenSearch } = useSearchContext();

  return (
    <motion.button
      className={cn(
        'group flex h-8 w-56 items-center gap-2 rounded-full border bg-muted/40 px-3 text-sm text-muted-foreground',
        'transition-colors hover:border-foreground/15 hover:bg-muted',
        className,
      )}
      onClick={() => setOpenSearch(true)}
      type="button"
      whileTap={{ scale: 0.98 }}
    >
      <SearchIcon className="size-3.5 shrink-0 transition-colors group-hover:text-foreground" />
      <span className="flex-1 text-left font-normal">Search...</span>
      <span className="flex items-center gap-0.5">
        <Kbd className="border bg-background">⌘</Kbd>
        <Kbd className="border bg-background">K</Kbd>
      </span>
    </motion.button>
  );
};
