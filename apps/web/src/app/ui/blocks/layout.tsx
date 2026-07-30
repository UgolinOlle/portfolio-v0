import type { ReactNode } from 'react';

import { Navbar } from '~/components/docs/navbar';
import { DocsLayout } from '~/layouts/docs';
import { Sidebar, SidebarProvider, SidebarTrigger, useSidebar } from '~/layouts/docs/slots/sidebar';
import { blocksSource } from '~/lib/source';

type LayoutProps = {
  readonly children: ReactNode;
};

function BlocksLayout({ children }: LayoutProps) {
  return (
    <DocsLayout
      containerProps={{
        className: '[--fd-layout-width:1900px] [--fd-banner-height:3.5rem]',
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
      tree={blocksSource.pageTree}
    >
      {children}
    </DocsLayout>
  );
}

export default BlocksLayout;
