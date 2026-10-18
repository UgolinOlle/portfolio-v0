import { cn } from '@portfolio-v0/shadcn/utils';

import { Suspense } from 'react';

import { PreviewThumbnail } from '~/components/docs/preview/preview-thumbnail';
import { RegistryCard } from '~/components/registry/registry-card';
import type { RegistryItem } from '~/lib/registry';

type RegistryGridProps = {
  items: RegistryItem[];
  variant?: 'default' | 'wide';
  className?: string;
};

// Cards share hairlines instead of floating in gaps: each cell draws its own right and
// bottom border, so neighbours never double up.
export const RegistryGrid = ({ items, variant, className }: RegistryGridProps) => {
  return (
    <div className={cn('grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4', className)}>
      {items.map((item, index) => (
        <RegistryCard
          index={index}
          item={item}
          key={item.href}
          variant={variant}
          preview={
            item.preview ? (
              <Suspense fallback={<div className="size-full animate-pulse bg-foreground/3" />}>
                <PreviewThumbnail
                  className="thumbnail-in"
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
