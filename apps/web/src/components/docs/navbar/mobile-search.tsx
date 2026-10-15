'use client';

import { Button } from '@portfolio-v0/shadcn/components/button';

import { useSearchContext } from 'fumadocs-ui/contexts/search';

import { SearchIcon } from '~/components/icons/ui';

const MobileSearch = () => {
  const { setOpenSearch } = useSearchContext();

  return (
    <Button
      aria-label="Rechercher"
      className="h-full w-(--nav-height) rounded-none border-s border-foreground/5"
      onClick={() => setOpenSearch(true)}
      size="icon"
      variant="ghost"
    >
      <SearchIcon className="size-4" />
    </Button>
  );
};

export { MobileSearch };
