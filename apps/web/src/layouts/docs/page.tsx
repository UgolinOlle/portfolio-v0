'use client';

import { getBreadcrumbItems } from 'fumadocs-core/breadcrumb';
import { Link, usePathname } from 'fumadocs-core/framework';
import type * as PageTree from 'fumadocs-core/page-tree';
import { AnchorProvider, type TOCItemType, useActiveAnchors } from 'fumadocs-core/toc';
import { useTreeContext } from 'fumadocs-ui/contexts/tree';
import { type ComponentProps, type ReactNode, useMemo } from 'react';

import {
  Breadcrumbs,
  type BreadcrumbEntry,
  type BreadcrumbMenuItem,
} from '~/components/docs/breadcrumbs';

import { cn } from '../../lib/cn';

export interface DocsPageProps {
  toc?: TOCItemType[];

  children: ReactNode;
}

export function DocsPage({ toc = [], ...props }: DocsPageProps) {
  const breadcrumbItems = useDocsBreadcrumbItems();

  return (
    <AnchorProvider toc={toc}>
      <Breadcrumbs
        className="fixed inset-x-0 top-14 z-30"
        containerClassName="max-w-215 px-4 md:px-6"
        items={breadcrumbItems}
      />
      <main className="flex w-full min-w-0 flex-col pt-(--fd-banner-height)">
        <article className="flex w-full max-w-215 flex-1 flex-col gap-6 px-4 py-8 md:mx-auto md:px-6">
          {props.children}
          <Footer />
        </article>
      </main>
      {toc.length > 0 && (
        <div
          className={cn(
            'sticky top-(--fd-banner-height) h-[calc(100dvh-var(--fd-banner-height))] w-71.5 shrink-0 overflow-auto',
            'px-4 pt-[calc(var(--fd-banner-height)+--spacing(4))] pb-4 max-xl:hidden',
          )}
        >
          <p className="text-fd-muted-foreground mb-2 text-sm">On this page</p>
          <div className="flex flex-col">
            {toc.map((item) => (
              <TocItem key={item.url} item={item} />
            ))}
          </div>
        </div>
      )}
    </AnchorProvider>
  );
}

/**
 * Flattens a page tree into every navigable page, tagged with its immediate folder
 * name as a group (e.g. "Hero Sections"), for the breadcrumb's "..." menu.
 */
function flattenSectionItems(nodes: PageTree.Node[], group?: string): BreadcrumbMenuItem[] {
  const items: BreadcrumbMenuItem[] = [];

  for (const node of nodes) {
    if (node.type === 'page') {
      items.push({ label: node.name, href: node.url, group });
    } else if (node.type === 'folder') {
      const folderGroup = typeof node.name === 'string' ? node.name : group;

      if (node.index) {
        items.push({ label: node.index.name, href: node.index.url, group: folderGroup });
      }

      items.push(...flattenSectionItems(node.children, folderGroup));
    }
  }

  return items;
}

/**
 * Builds breadcrumb items from the current page tree, prefixed with the shared "UI" root.
 * Category folders without their own page (e.g. "Hero Sections") render as plain,
 * non-clickable labels instead of dead links. When the current page is nested under
 * a category, the intermediate levels collapse into a single "..." menu listing every
 * page in the section instead of being spelled out.
 */
function useDocsBreadcrumbItems(): BreadcrumbEntry[] {
  const pathname = usePathname();
  const { root } = useTreeContext();

  return useMemo(() => {
    const [, section] = pathname.split('/').filter(Boolean);
    const sectionHref = `/ui/${section}`;
    const hasSectionRootPage = root.children.some(
      (node) => node.type === 'page' && node.url === sectionHref,
    );

    const treeItems = getBreadcrumbItems(pathname, root, { includePage: true });
    const leaf = treeItems.at(-1);

    // We're on the section's own root/index page: it doubles as the active crumb.
    if (leaf && leaf.url === sectionHref) {
      return [{ label: 'UI', href: '/ui' }, { label: root.name }];
    }

    const items: BreadcrumbEntry[] = [
      { label: 'UI', href: '/ui' },
      { label: root.name, href: hasSectionRootPage ? sectionHref : undefined },
    ];

    if (!leaf) {
      return items;
    }

    // More than one node in the path (folder(s) + page) means the page is nested
    // under a category: collapse those categories behind a "..." menu.
    if (treeItems.length > 1) {
      items.push({ ellipsisItems: flattenSectionItems(root.children) });
    }

    items.push({ label: leaf.name, href: leaf.url });

    return items;
  }, [pathname, root]);
}

export function DocsBody(props: ComponentProps<'div'>) {
  return (
    <div {...props} className={cn('prose', props.className)}>
      {props.children}
    </div>
  );
}

export function DocsDescription(props: ComponentProps<'p'>) {
  // don't render if no description provided
  if (props.children === undefined) return null;

  return (
    <p {...props} className={cn('text-fd-muted-foreground mb-8 text-lg', props.className)}>
      {props.children}
    </p>
  );
}

export function DocsTitle(props: ComponentProps<'h1'>) {
  return (
    <h1 {...props} className={cn('text-3xl font-semibold', props.className)}>
      {props.children}
    </h1>
  );
}

function TocItem({ item }: { item: TOCItemType }) {
  const isActive = useActiveAnchors().includes(item.url.slice(1));

  return (
    <a
      href={item.url}
      className={cn('text-fd-foreground/80 py-1 text-sm', isActive && 'text-fd-primary')}
      style={{
        paddingLeft: Math.max(0, item.depth - 2) * 16,
      }}
    >
      {item.title}
    </a>
  );
}

function Footer() {
  const { root } = useTreeContext();
  const pathname = usePathname();
  const flatten = useMemo(() => {
    const result: PageTree.Item[] = [];

    function scan(items: PageTree.Node[]) {
      for (const item of items) {
        if (item.type === 'page') result.push(item);
        else if (item.type === 'folder') {
          if (item.index) result.push(item.index);
          scan(item.children);
        }
      }
    }

    scan(root.children);
    return result;
  }, [root]);

  const { previous, next } = useMemo(() => {
    const idx = flatten.findIndex((item) => item.url === pathname);

    if (idx === -1) return {};
    return {
      previous: flatten[idx - 1],
      next: flatten[idx + 1],
    };
  }, [flatten, pathname]);

  return (
    <div className="flex flex-row items-center justify-between gap-2 font-medium">
      {previous ? <Link href={previous.url}>{previous.name}</Link> : null}
      {next ? <Link href={next.url}>{next.name}</Link> : null}
    </div>
  );
}
