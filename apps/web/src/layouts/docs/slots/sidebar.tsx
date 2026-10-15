'use client';
import { Kbd } from '@portfolio-v0/shadcn/components/kbd';
import { cn } from '@portfolio-v0/shadcn/utils';

import { SiGithub } from '@icons-pack/react-simple-icons';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import type { ComponentProps, ReactNode } from 'react';

import { SidebarAccordionTree } from '~/components/docs/sidebar/accordion-tree';
import * as Base from '~/components/docs/sidebar/base';
import { SearchIcon, SidebarIcon } from '~/components/icons/ui';
import { useModifierKey } from '~/hooks/use-modifier-key';
import { ThemeSwitch } from '~/layouts/shared/slots/theme-switch';
import { GITHUB_REPO } from '~/lib/constants';
import { mergeRefs } from '~/lib/merge-refs';

export interface SidebarProps extends ComponentProps<'aside'> {
  banner?: ReactNode;
  footer?: ReactNode;
}

export type SidebarProviderProps = Base.SidebarProviderProps;

export const { useSidebar } = Base;

export function SidebarProvider(props: SidebarProviderProps) {
  return <Base.SidebarProvider {...props} />;
}

export function SidebarTrigger(props: ComponentProps<'button'>) {
  return <Base.SidebarTrigger {...props} />;
}

// Better Auth–style sidebar: search row, single-open accordion tree, and a footer bar,
// all full-bleed and separated by hairline borders (no rounded rows).
export function Sidebar({ footer, banner, ...rest }: SidebarProps) {
  const body = (
    <>
      <SidebarSearch />
      {banner}
      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain pb-3 [scrollbar-width:thin]">
        <SidebarAccordionTree />
      </div>
      <div className="flex items-center gap-1 border-t border-foreground/5 p-2 text-foreground/40">
        <a
          aria-label="GitHub"
          className="flex size-8 items-center justify-center transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
          href={`https://github.com/${GITHUB_REPO}`}
          rel="noreferrer"
          target="_blank"
        >
          <SiGithub aria-hidden="true" className="size-4" />
        </a>
        {footer}
        <ThemeSwitch className="ms-auto rounded-none border-0 hover:text-foreground" />
      </div>
    </>
  );

  return (
    <>
      <SidebarContent {...rest}>{body}</SidebarContent>
      <SidebarDrawer>
        <div className="flex justify-end border-b border-foreground/5 p-2">
          <SidebarTrigger className="flex size-8 items-center justify-center text-foreground/60 hover:text-foreground">
            <SidebarIcon />
          </SidebarTrigger>
        </div>
        {body}
      </SidebarDrawer>
    </>
  );
}

function SidebarSearch() {
  const { enabled, setOpenSearch } = useSearchContext();
  const modifierKey = useModifierKey();

  if (!enabled) return null;

  return (
    <button
      className={cn(
        'group/search flex w-full items-center gap-2 border-b border-foreground/5 px-4 py-2.5 text-sm text-foreground/55 transition-colors',
        'hover:bg-foreground/3 hover:text-foreground/80 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
      )}
      onClick={() => setOpenSearch(true)}
      type="button"
    >
      <SearchIcon aria-hidden="true" className="size-3.5 shrink-0" />
      <span className="flex-1 text-start">Rechercher…</span>
      <span aria-hidden="true" className="flex items-center gap-0.5">
        <Kbd className="h-5 rounded-none border bg-transparent text-[0.6875rem]">{modifierKey}</Kbd>
        <Kbd className="h-5 rounded-none border bg-transparent text-[0.6875rem]">K</Kbd>
      </span>
    </button>
  );
}

function SidebarContent({ ref: refProp, className, children, ...props }: ComponentProps<'aside'>) {
  return (
    <Base.SidebarContent>
      {({ ref: asideRef }) => (
        <div
          data-sidebar-placeholder=""
          className="md:layout:[--fd-sidebar-width:var(--docs-sidebar-width)] pointer-events-none sticky top-(--fd-docs-row-1) z-20 h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] [grid-area:sidebar] *:pointer-events-auto max-md:hidden"
        >
          <aside
            id="nd-sidebar"
            ref={mergeRefs(refProp, asideRef)}
            className={cn(
              // `!` beats the fumadocs shadcn preset, which tints `#nd-sidebar` with `--sidebar`.
              'absolute inset-y-0 inset-s-0 flex w-full flex-col items-end border-e border-foreground/5! bg-background! *:w-(--fd-sidebar-width)',
              className,
            )}
            {...props}
          >
            {children}
          </aside>
        </div>
      )}
    </Base.SidebarContent>
  );
}

function SidebarDrawer({
  children,
  className,
  ...props
}: ComponentProps<typeof Base.SidebarDrawerContent>) {
  return (
    <>
      <Base.SidebarDrawerOverlay className="data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out fixed inset-0 z-40 backdrop-blur-xs" />
      <Base.SidebarDrawerContent
        className={cn(
          'data-[state=open]:animate-fd-sidebar-in data-[state=closed]:animate-fd-sidebar-out fixed inset-y-0 inset-e-0 z-40 flex w-[85%] max-w-95 flex-col border-s bg-background shadow-lg',
          className,
        )}
        {...props}
      >
        {children}
      </Base.SidebarDrawerContent>
    </>
  );
}
