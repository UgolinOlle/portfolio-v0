import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';

import { Navbar } from '~/components/docs/navbar';
import { componentsSource } from '~/lib/source';

type LayoutProps = {
  readonly children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <DocsLayout
      containerProps={{ className: '[--fd-layout-width:1900px]' }}
      nav={{ component: <Navbar /> }}
      searchToggle={{ enabled: false }}
      sidebar={{ collapsible: false, tabs: false, className: 'border-none' }}
      themeSwitch={{ enabled: false }}
      tree={componentsSource.pageTree}
    >
      {children}
    </DocsLayout>
  );
}
