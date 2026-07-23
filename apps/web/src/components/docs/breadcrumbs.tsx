'use client';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@portfolio-v0/shadcn/components/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@portfolio-v0/shadcn/components/dropdown-menu';
import { cn } from '@portfolio-v0/shadcn/utils';

import { motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, type ReactNode, useMemo } from 'react';

const SEGMENT_LABELS: Record<string, string> = {
  ui: 'UI',
};

const prettifySegment = (segment: string) =>
  segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export type BreadcrumbMenuItem = {
  label: ReactNode;
  href: string;
  /** Optional group heading the item is listed under in the ellipsis menu. */
  group?: string;
};

export type BreadcrumbEntry =
  | {
      label: ReactNode;
      /** Omit for a non-clickable crumb (e.g. a category with no page of its own). */
      href?: string;
      ellipsisItems?: undefined;
    }
  | {
      /** Renders as a "..." trigger opening a menu of every page in the section. */
      ellipsisItems: BreadcrumbMenuItem[];
      label?: undefined;
      href?: undefined;
    };

const useAutoBreadcrumbs = (): BreadcrumbEntry[] => {
  const pathname = usePathname();

  return useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);

    return segments.map((segment, index) => ({
      label: SEGMENT_LABELS[segment] ?? prettifySegment(segment),
      href: `/${segments.slice(0, index + 1).join('/')}`,
    }));
  }, [pathname]);
};

type BreadcrumbsProps = {
  className?: string;
  containerClassName?: string;
  items?: BreadcrumbEntry[];
};

export function Breadcrumbs({
  className,
  containerClassName = 'max-w-4xl px-4',
  items,
}: BreadcrumbsProps) {
  const autoItems = useAutoBreadcrumbs();
  const crumbs = items ?? autoItems;

  if (crumbs.length === 0) {
    return null;
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex h-11 w-full items-center border-b border-border/60 bg-background/70 backdrop-blur-md',
        className,
      )}
      initial={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className={cn(containerClassName)}>
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;
              const key = crumb.ellipsisItems ? 'ellipsis' : (crumb.href ?? String(crumb.label));

              return (
                <Fragment key={key}>
                  <BreadcrumbItem>
                    {crumb.ellipsisItems ? (
                      <BreadcrumbEllipsisMenu items={crumb.ellipsisItems} />
                    ) : isLast ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : crumb.href ? (
                      <BreadcrumbLink render={<Link href={crumb.href} />}>
                        {crumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <span className="cursor-default">{crumb.label}</span>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </motion.div>
  );
}

type BreadcrumbEllipsisMenuProps = {
  items: BreadcrumbMenuItem[];
};

function BreadcrumbEllipsisMenu({ items }: BreadcrumbEllipsisMenuProps) {
  const groups = useMemo(() => {
    const map = new Map<string, BreadcrumbMenuItem[]>();

    for (const item of items) {
      const key = item.group ?? '';
      const group = map.get(key) ?? [];
      group.push(item);
      map.set(key, group);
    }

    return [...map.entries()];
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Afficher les autres pages de cette section"
        className={cn(
          'flex size-6 items-center justify-center rounded-md text-muted-foreground',
          'transition-colors duration-150 hover:bg-accent hover:text-accent-foreground',
          'data-popup-open:bg-accent data-popup-open:text-accent-foreground',
        )}
        closeDelay={150}
        delay={150}
        openOnHover
      >
        <BreadcrumbEllipsis className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-80 w-56 bg-secondary">
        {groups.map(([group, groupItems], index) => (
          <Fragment key={group || '_root'}>
            {index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuGroup>
              {group && <DropdownMenuLabel>{group}</DropdownMenuLabel>}
              {groupItems.map((item) => (
                <DropdownMenuItem key={item.href} render={<Link href={item.href} />}>
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
