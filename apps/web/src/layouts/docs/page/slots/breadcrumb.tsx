'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { useTreePath, useTreeContext } from '@fumadocs/base-ui/contexts/tree';
import { type BreadcrumbOptions, getBreadcrumbItemsFromPath } from 'fumadocs-core/breadcrumb';
import Link from 'fumadocs-core/link';
import { type ComponentProps, useMemo, Fragment } from 'react';

import { SlashIcon } from '~/components/icons/ui';

export type BreadcrumbProps = BreadcrumbOptions & ComponentProps<'div'>;

export function Breadcrumb({
  includeRoot,
  includeSeparator,
  includePage,
  ...props
}: BreadcrumbProps) {
  const path = useTreePath();
  const { root } = useTreeContext();
  const items = useMemo(() => {
    return getBreadcrumbItemsFromPath(root, path, {
      includePage,
      includeSeparator,
      includeRoot,
    });
  }, [includePage, includeRoot, includeSeparator, path, root]);

  if (items.length === 0) return null;

  return (
    <div
      {...props}
      className={cn('text-fd-muted-foreground flex items-center gap-1.5 text-sm', props.className)}
    >
      {items.map((item, i) => {
        const className = cn('truncate', i === items.length - 1 && 'text-fd-primary font-medium');

        return (
          <Fragment key={i}>
            {i !== 0 && <SlashIcon className="size-3.5 shrink-0" />}
            {item.url ? (
              <Link
                href={item.url}
                className={cn(className, 'transition-opacity hover:opacity-80')}
              >
                {item.name}
              </Link>
            ) : (
              <span className={className}>{item.name}</span>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
