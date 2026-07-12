'use client';

import { cva } from 'class-variance-authority';
import { usePathname } from 'fumadocs-core/framework';
import Link from 'fumadocs-core/link';
import type * as PageTree from 'fumadocs-core/page-tree';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { TreeContextProvider, useTreeContext } from 'fumadocs-ui/contexts/tree';
import { type ComponentProps, createContext, type ReactNode, use, useMemo, useState } from 'react';

import { cn } from '../../lib/cn';

interface SidebarContext {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContext | null>(null);

export interface DocsLayoutProps {
  tree: PageTree.Root;
  children: ReactNode;
}

export function DocsLayout({ tree, children }: DocsLayoutProps) {
  return (
    <TreeContextProvider tree={tree}>
      <SidebarProvider>
        <header className="bg-fd-background sticky top-0 z-20 h-14">
          <nav className="flex size-full flex-row items-center gap-2 px-4">
            <Link href="/" className="mr-auto font-medium">
              My Docs
            </Link>

            <SearchToggle />
            <NavbarSidebarTrigger className="md:hidden" />
          </nav>
        </header>
        <main id="nd-docs-layout" className="flex flex-1 flex-row [--fd-nav-height:56px]">
          <Sidebar />
          {children}
        </main>
      </SidebarProvider>
    </TreeContextProvider>
  );
}

function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <SidebarContext
      value={useMemo(
        () => ({
          open,
          setOpen,
        }),
        [open],
      )}
    >
      {children}
    </SidebarContext>
  );
}

function SearchToggle(props: ComponentProps<'button'>) {
  const { enabled, setOpenSearch } = useSearchContext();
  if (!enabled) return;

  return (
    <button
      {...props}
      className={cn('text-sm', props.className)}
      onClick={() => setOpenSearch(true)}
    >
      Search
    </button>
  );
}

function NavbarSidebarTrigger(props: ComponentProps<'button'>) {
  const { open, setOpen } = use(SidebarContext)!;

  return (
    <button {...props} className={cn('text-sm', props.className)} onClick={() => setOpen(!open)}>
      Sidebar
    </button>
  );
}

function Sidebar() {
  const { root } = useTreeContext();
  const { open } = use(SidebarContext)!;

  const children = useMemo(() => {
    function renderItems(items: PageTree.Node[]) {
      return items.map((item) => (
        <SidebarItem key={item.$id} item={item}>
          {item.type === 'folder' ? renderItems(item.children) : null}
        </SidebarItem>
      ));
    }

    return renderItems(root.children);
  }, [root]);

  return (
    <aside
      className={cn(
        'fixed top-14 z-20 flex shrink-0 flex-col overflow-auto p-4 text-sm md:sticky md:h-[calc(100dvh-56px)] md:w-[300px]',
        'max-md:bg-fd-background max-md:inset-x-0 max-md:bottom-0',
        !open && 'max-md:invisible',
      )}
    >
      {children}
    </aside>
  );
}

const linkVariants = cva(
  'flex items-center gap-2 w-full py-1.5 rounded-lg text-fd-foreground/80 [&_svg]:size-4',
  {
    variants: {
      active: {
        true: 'text-fd-primary font-medium',
        false: 'hover:text-fd-accent-foreground',
      },
    },
  },
);

function SidebarItem({ item, children }: { item: PageTree.Node; children: ReactNode }) {
  const pathname = usePathname();

  if (item.type === 'page') {
    return (
      <Link
        href={item.url}
        className={linkVariants({
          active: pathname === item.url,
        })}
      >
        {item.icon}
        {item.name}
      </Link>
    );
  }

  if (item.type === 'separator') {
    return (
      <p className="text-fd-muted-foreground mt-6 mb-2 first:mt-0">
        {item.icon}
        {item.name}
      </p>
    );
  }

  return (
    <div>
      {item.index ? (
        <Link
          className={linkVariants({
            active: pathname === item.index.url,
          })}
          href={item.index.url}
        >
          {item.index.icon}
          {item.index.name}
        </Link>
      ) : (
        <p className={cn(linkVariants(), 'text-start')}>
          {item.icon}
          {item.name}
        </p>
      )}
      <div className="flex flex-col border-l pl-4">{children}</div>
    </div>
  );
}
