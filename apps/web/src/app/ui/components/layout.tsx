import type { ReactNode } from 'react';

import { RegistryLayout } from '~/components/docs/registry-layout';
import { componentsSource } from '~/lib/source';

type LayoutProps = {
  readonly children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return <RegistryLayout tree={componentsSource.pageTree}>{children}</RegistryLayout>;
}
