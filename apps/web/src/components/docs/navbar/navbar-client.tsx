'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { useMotionValueEvent, useScroll } from 'motion/react';
import Link from 'next/link';
import { type ReactNode, useState } from 'react';

import { Links } from './links';
import { Logo } from './logo';
import { MobileMenu } from './mobile-menu';
import { MobileSearch } from './mobile-search';
import { Search } from './search';
import { ThemeToggle } from './theme-toggle';

type NavbarClientProps = {
  componentsCount: number;
  blocksCount: number;
  templatesCount: number;
  github: ReactNode;
};

export function NavbarClient({
  componentsCount,
  blocksCount,
  templatesCount,
  github,
}: NavbarClientProps) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 8);
  });

  return (
    <div
      className={cn(
        'fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between px-4',
        'bg-background/70 backdrop-blur-md transition-[background-color,border-color,box-shadow]',
        scrolled && 'border-border bg-background/85 shadow-[0_1px_12px_-4px_rgba(0,0,0,0.08)]',
        'border-b-fd-accent border-b duration-300',
      )}
    >
      <div className="flex items-center gap-3">
        <Link
          className="rounded-md px-3 py-1.5 transition-colors hover:bg-accent hover:text-accent-foreground"
          href="/"
        >
          <Logo />
        </Link>
        <Links
          blocksCount={blocksCount}
          className="hidden md:flex"
          componentsCount={componentsCount}
          templatesCount={templatesCount}
        />
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <Search />
        <div className="mx-1 h-5 w-px bg-border" />
        <ThemeToggle />
        {github}
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <MobileSearch />
        <MobileMenu />
      </div>
    </div>
  );
}
