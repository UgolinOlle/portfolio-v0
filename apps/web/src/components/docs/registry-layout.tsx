import type * as PageTree from 'fumadocs-core/page-tree';
import type { ReactNode } from 'react';

import { Navbar } from '~/components/docs/navbar';
import { DocsLayout } from '~/layouts/docs';
import { Sidebar, SidebarProvider, SidebarTrigger, useSidebar } from '~/layouts/docs/slots/sidebar';

type RegistryLayoutProps = {
  readonly tree: PageTree.Root;
  readonly children: ReactNode;
};

// Shared shell for /ui/components, /ui/blocks and /ui/templates. The fixed navbar
// stands in for fumadocs' banner row, so `--fd-banner-height` is the navbar height. A full
// viewport layout width keeps the sidebar flush left, aligned with the navbar's logo cell.
export function RegistryLayout({ tree, children }: RegistryLayoutProps) {
  return (
    <DocsLayout
      containerProps={{
        className: '[--fd-banner-height:var(--nav-height)] [--fd-layout-width:100vw]',
      }}
      nav={{ component: <Navbar /> }}
      searchToggle={{ enabled: false }}
      slots={{
        sidebar: {
          provider: SidebarProvider,
          root: Sidebar,
          trigger: SidebarTrigger,
          useSidebar,
        },
      }}
      themeSwitch={{ enabled: false }}
      tree={tree}
    >
      {children}
    </DocsLayout>
  );
}
