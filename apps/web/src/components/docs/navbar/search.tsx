'use client';

import { Button } from '@portfolio-v0/shadcn/components/button';
import { Kbd } from '@portfolio-v0/shadcn/components/kbd';
import { cn } from '@portfolio-v0/shadcn/utils';

import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { SearchIcon } from 'lucide-react';

type SearchProps = {
  className?: string;
};

export const Search = ({ className }: SearchProps) => {
  const { setOpenSearch } = useSearchContext();

  return (
    <Button
      className={cn('relative text-muted-foreground has-[>svg]:pr-19', className)}
      onClick={() => setOpenSearch(true)}
      size="sm"
      variant="secondary"
    >
      <SearchIcon className="size-4" />
      <p className="font-normal">Search...</p>
      <span className="absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center gap-0.5">
        <Kbd className="border bg-background">⌘</Kbd>
        <Kbd className="border bg-background">K</Kbd>
      </span>
    </Button>
  );
};
