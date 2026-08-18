'use client';

import { buttonVariants } from '@portfolio-v0/shadcn/components/button';
import { cn } from '@portfolio-v0/shadcn/utils';

import type { ComponentProps } from 'react';

import { SidebarIcon } from '~/components/icons/ui';

import { useDocsLayout } from '../client';

export function Header(props: ComponentProps<'header'>) {
  const {
    isNavTransparent,
    slots,
    props: { nav },
  } = useDocsLayout();

  if (nav?.component) return nav.component;
  return (
    <header
      id="nd-subnav"
      data-transparent={isNavTransparent}
      {...props}
      className={cn(
        'max-md:layout:[--fd-header-height:--spacing(14)] data-[transparent=false]:bg-fd-background/80 sticky top-(--fd-docs-row-1) z-30 flex h-(--fd-header-height) items-center border-b ps-4 pe-2.5 backdrop-blur-sm transition-colors [grid-area:header] md:hidden',
        props.className,
      )}
    >
      {slots.navTitle && (
        <slots.navTitle className="inline-flex items-center gap-2.5 font-semibold" />
      )}
      <div className="flex-1">{nav?.children}</div>
      {slots.searchTrigger && <slots.searchTrigger.sm hideIfDisabled className="p-2" />}
      {slots.sidebar && (
        <slots.sidebar.trigger
          className={cn(
            buttonVariants({
              variant: 'ghost',
              size: 'icon-sm',
              className: 'p-2',
            }),
          )}
        >
          <SidebarIcon />
        </slots.sidebar.trigger>
      )}
    </header>
  );
}
