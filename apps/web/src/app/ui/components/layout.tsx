import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';

import { Navbar } from '~/components/docs/navbar';
import { Sidebar, SidebarProvider, SidebarTrigger, useSidebar } from '~/layouts/docs/slots/sidebar';
import { componentsSource } from '~/lib/source';

type LayoutProps = {
  readonly children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <DocsLayout
      containerProps={{
        className: '[--fd-layout-width:1900px] [--fd-banner-height:calc(3.5rem+2.75rem)]',
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
      tree={componentsSource.pageTree}
    >
      {children}
    </DocsLayout>
  );
}
