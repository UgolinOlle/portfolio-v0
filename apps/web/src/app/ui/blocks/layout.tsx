import type { ReactNode } from 'react';

import { RegistryLayout } from '~/components/docs/registry-layout';
import { blocksSource } from '~/lib/source';

type LayoutProps = {
  readonly children: ReactNode;
};

export default function BlocksLayout({ children }: LayoutProps) {
  return <RegistryLayout tree={blocksSource.pageTree}>{children}</RegistryLayout>;
}
