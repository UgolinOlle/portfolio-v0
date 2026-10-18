'use client';

import { BellIcon, CircleHelpIcon, SearchIcon } from 'lucide-react';
import * as React from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import type { Crumb } from './nav';
import { ThemeToggle } from './theme-toggle';

export interface SiteHeaderProps {
  trail: Crumb[];
  className?: string;
}

export function SiteHeader({ trail, className }: SiteHeaderProps) {
  const searchRef = React.useRef<HTMLInputElement>(null);

  // Cmd/Ctrl+K focuses the search field.
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const current = trail[trail.length - 1];
  const parents = trail.slice(0, -1);

  return (
    <header
      className={cn(
        '@container/header sticky top-0 z-20 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur-md sm:px-4',
        'rounded-t-[inherit]',
        className,
      )}
    >
      <SidebarTrigger className="-ml-1 active:scale-95" />
      <Separator className="mx-1 data-[orientation=vertical]:h-4" orientation="vertical" />

      <Breadcrumb className="hidden min-w-0 @2xl/header:block">
        <BreadcrumbList className="flex-nowrap">
          {parents.map((crumb) => (
            <React.Fragment key={crumb.id}>
              <BreadcrumbItem className="hidden @4xl/header:inline-flex">
                <BreadcrumbLink
                  className="transition-colors duration-[var(--duration-fast,120ms)] ease-[cubic-bezier(0.23,1,0.32,1)]"
                  href="#"
                  onClick={(event) => event.preventDefault()}
                >
                  {crumb.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden @4xl/header:block" />
            </React.Fragment>
          ))}
          {current && (
            <BreadcrumbItem className="min-w-0">
              <BreadcrumbPage className="truncate font-medium tracking-tight">
                {current.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-1 @2xl/header:flex-none">
        {/* The field stays put on focus: only colour, ring and the shortcut hint change. */}
        <div className="group/search relative min-w-0 flex-1 @2xl/header:w-64 @2xl/header:flex-none @5xl/header:w-72">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-[var(--duration-fast,120ms)] ease-[cubic-bezier(0.23,1,0.32,1)] group-focus-within/search:text-foreground" />
          <Input
            aria-label="Search"
            className="h-8 border-transparent bg-muted/60 pr-3 pl-8 shadow-none transition-[background-color,border-color,box-shadow] duration-[var(--duration-base,180ms)] ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-muted focus-visible:bg-background @lg/header:pr-14"
            placeholder="Search…"
            ref={searchRef}
            type="search"
          />
          <KbdGroup className="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 transition-opacity duration-[var(--duration-base,180ms)] ease-[cubic-bezier(0.23,1,0.32,1)] group-focus-within/search:opacity-0 @lg/header:inline-flex">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </div>

        <Button
          aria-label="Notifications"
          className="relative active:scale-95"
          size="icon-sm"
          variant="ghost"
        >
          <BellIcon />
          <span
            aria-hidden
            className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-destructive ring-2 ring-background"
          />
        </Button>
        <Button
          aria-label="Help"
          className="hidden active:scale-95 @xl/header:inline-flex"
          size="icon-sm"
          variant="ghost"
        >
          <CircleHelpIcon />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
