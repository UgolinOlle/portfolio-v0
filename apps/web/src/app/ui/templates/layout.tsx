import type { ReactNode } from 'react';

import { RegistryLayout } from '~/components/docs/registry-layout';
import { templatesSource } from '~/lib/source';

type LayoutProps = {
  readonly children: ReactNode;
};

export default function TemplatesLayout({ children }: LayoutProps) {
  return <RegistryLayout tree={templatesSource.pageTree}>{children}</RegistryLayout>;
}
