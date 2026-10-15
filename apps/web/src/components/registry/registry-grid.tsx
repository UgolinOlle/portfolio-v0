import { cn } from '@portfolio-v0/shadcn/utils';

import { Suspense } from 'react';

import { PreviewThumbnail } from '~/components/docs/preview/preview-thumbnail';
import { RegistryCard } from '~/components/registry/registry-card';
import type { RegistryItem } from '~/lib/registry';

type RegistryGridProps = {
  items: RegistryItem[];
  className?: string;
};

// Cards share hairlines instead of floating in gaps: each cell draws its own right and
// bottom border, so neighbours never double up.
export const RegistryGrid = ({ items, className }: RegistryGridProps) => {
  return (
    <div className={cn('grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4', className)}>
      {items.map((item) => (
        <RegistryCard
          item={item}
          key={item.href}
          preview={
            item.preview ? (
              <Suspense fallback={<div className="size-full animate-pulse bg-foreground/3" />}>
                <PreviewThumbnail
                  path={item.preview}
                  type={item.category}
                  virtualWidth={item.previewWidth}
                  wide={item.featured}
                />
              </Suspense>
            ) : undefined
          }
        />
      ))}
    </div>
  );
};
