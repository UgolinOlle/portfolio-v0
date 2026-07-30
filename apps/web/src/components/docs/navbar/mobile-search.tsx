'use client';

import { Button } from '@portfolio-v0/shadcn/components/button';

import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { SearchIcon } from 'lucide-react';

const MobileSearch = () => {
  const { setOpenSearch } = useSearchContext();

  return (
    <Button className="h-8" onClick={() => setOpenSearch(true)} size="icon" variant="ghost">
      <SearchIcon className="size-4" />
    </Button>
  );
};

export { MobileSearch };
