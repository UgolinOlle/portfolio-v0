import { Suspense } from 'react';

import { PreviewThumbnail } from '~/components/docs/preview/preview-thumbnail';
import { RegistryCard } from '~/components/registry/registry-card';
import type { RegistryItem } from '~/lib/registry';

type RegistryGridProps = {
  items: RegistryItem[];
};

export const RegistryGrid = ({ items }: RegistryGridProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <RegistryCard
          item={item}
          key={item.href}
          preview={
            item.preview ? (
              <Suspense fallback={<div className="size-full animate-pulse bg-muted/40" />}>
                <PreviewThumbnail path={item.preview} type={item.category} />
              </Suspense>
            ) : undefined
          }
        />
      ))}
    </div>
  );
};
