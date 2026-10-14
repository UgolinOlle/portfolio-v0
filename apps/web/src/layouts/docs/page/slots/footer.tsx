'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { useTranslations } from '@fuma-translate/react';
import { useFooterItems } from '@fumadocs/base-ui/utils/use-footer-items';
import { usePathname } from 'fumadocs-core/framework';
import Link from 'fumadocs-core/link';
import type * as PageTree from 'fumadocs-core/page-tree';
import { type ComponentProps, useMemo } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from '~/components/icons/ui';
import { isActive } from '~/lib/urls';

type Item = Pick<PageTree.Item, 'name' | 'description' | 'url'>;

export interface FooterProps extends ComponentProps<'div'> {
  /**
   * Items including information for the next and previous page
   */
  items?: {
    previous?: Item;
    next?: Item;
  };
}

export function Footer({ items, children, className, ...props }: FooterProps) {
  const footerList = useFooterItems();
  const pathname = usePathname();
  const { previous, next } = useMemo(() => {
    if (items) return items;

    const idx = footerList.findIndex((item) => isActive(item.url, pathname));

    if (idx === -1) return {};
    return {
      previous: footerList[idx - 1],
      next: footerList[idx + 1],
    };
  }, [footerList, items, pathname]);

  if (!previous && !next) return children;

  return (
    <>
      <nav
        aria-label="Pagination"
        className={cn(
          'not-prose @container grid border border-foreground/10',
          'grid-cols-2',
          className,
        )}
        {...props}
      >
        {previous ? (
          <FooterItem item={previous} index={0} />
        ) : (
          <span aria-hidden="true" className="@max-lg:hidden" />
        )}
        {next && <FooterItem item={next} index={1} />}
      </nav>
      {children}
    </>
  );
}

function FooterItem({ item, index }: { item: Item; index: 0 | 1 }) {
  const t = useTranslations({ note: 'pagination' });
  const Icon = index === 0 ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <Link
      href={item.url}
      className={cn(
        'group flex flex-col gap-1.5 p-4 transition-colors @max-lg:col-span-full',
        'hover:bg-foreground/3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
        index === 1 &&
          'items-end border-s border-foreground/10 text-end @max-lg:border-s-0 @max-lg:border-t @lg:col-start-2',
      )}
    >
      <span
        className={cn(
          'inline-flex items-center gap-1 font-mono text-[0.6875rem] tracking-widest text-foreground/45 uppercase',
          index === 1 && 'flex-row-reverse',
        )}
      >
        <Icon
          aria-hidden="true"
          className={cn(
            'size-3.5 shrink-0 transition-transform rtl:rotate-180',
            index === 0 ? 'group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5',
          )}
        />
        {index === 0 ? t('Previous Page') : t('Next Page')}
      </span>
      <span className="text-sm font-medium">{item.name}</span>
    </Link>
  );
}
