import type { ReactNode } from 'react';

import { DocsLayout } from '~/layouts/docs';
import { blocksSource } from '~/lib/source';

type LayoutProps = {
  readonly children: ReactNode;
};

function BlocksLayout({ children }: LayoutProps) {
  return (
    <DocsLayout
      // slots={{
      //   sidebar: {
      //     provider: SidebarProvider,
      //     root: Sidebar,
      //     trigger: SidebarTrigger,
      //     useSidebar: useSidebar,
      //   },
      // }}
      // containerProps={{ className: "[--fd-layout-width:1900px]" }}
      // nav={{ component: <Navbar /> }}
      // searchToggle={{ enabled: false }}
      // sidebar={{ collapsible: false, tabs: false, className: "border-none" }}
      // themeSwitch={{ enabled: false }}
      tree={blocksSource.pageTree}
    >
      {children}
    </DocsLayout>
  );
}

export default BlocksLayout;
