'use client';

import { Button } from '@portfolio-v0/shadcn/components/button';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { blocksSource, componentsSource } from '~/lib/source';
import { cn } from '~/lib/utils';

import { GitHub } from './github';
import { Links } from './links';
import { Logo } from './logo';
import { MobileMenu } from './mobile-menu';
import { MobileSearch } from './mobile-search';
import { Search } from './search';

const componentsCount = componentsSource.getPages().length;
const blocksCount = blocksSource.getPages().length;

function Navbar() {
  const router = useRouter();

  return (
    <div
      className={cn(
        'bg-fd-background/80 fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 py-3',
        'backdrop-blur-sm transition-colors',
      )}
    >
      <div className="flex items-center gap-3">
        <Link
          className="rounded-md px-3 py-1.5 hover:bg-accent hover:text-accent-foreground"
          href="/"
        >
          <Logo />
        </Link>
        <Links
          blocksCount={blocksCount}
          className="hidden gap-1 md:flex"
          componentsCount={componentsCount}
        />
      </div>

      <div className="hidden items-center gap-3 md:flex">
        <Search />
        <Button
          className="h-8 rounded-lg shadow-none"
          size="sm"
          variant="outline"
          onClick={() => router.push('/')}
        >
          Portfolio-v0
        </Button>

        <GitHub />
      </div>

      <div className="flex items-center gap-3 md:hidden">
        <MobileSearch />
        <MobileMenu />
      </div>
    </div>
  );
}

export { Navbar };
