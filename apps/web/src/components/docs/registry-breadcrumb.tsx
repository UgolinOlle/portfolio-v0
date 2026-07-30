'use client';

import { useTreeContext, useTreePath } from '@fumadocs/base-ui/contexts/tree';
import { getBreadcrumbItemsFromPath } from 'fumadocs-core/breadcrumb';
import { usePathname } from 'fumadocs-core/framework';
import type * as PageTree from 'fumadocs-core/page-tree';
import { useMemo } from 'react';

import {
  Breadcrumbs,
  type BreadcrumbEntry,
  type BreadcrumbMenuItem,
} from '~/components/docs/breadcrumbs';

// Flattens a page tree into every navigable page, tagged with its immediate folder
// name as a group (e.g. "Hero Sections"), for the breadcrumb's "..." menu.
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

// Builds breadcrumb items from the current page tree, prefixed with the shared "UI" root.
// Category folders without their own page (e.g. "Hero Sections") render as plain,
// non-clickable labels instead of dead links. When the current page is nested under
// a category, the intermediate levels collapse into a single "..." menu listing every
// page in the section instead of being spelled out.
function useRegistryBreadcrumbItems(): BreadcrumbEntry[] {
  const pathname = usePathname();
  const path = useTreePath();
  const { root } = useTreeContext();

  return useMemo(() => {
    const [, section] = pathname.split('/').filter(Boolean);
    const sectionHref = `/ui/${section}`;
    const hasSectionRootPage = root.children.some(
      (node) => node.type === 'page' && node.url === sectionHref,
    );

    const treeItems = getBreadcrumbItemsFromPath(root, path, { includePage: true });
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
  }, [pathname, path, root]);
}

// Breadcrumb slot for registry docs pages: adapts the shared `Breadcrumbs` component
// (with its "UI" root + "..." section menu) to sit inline in the docs page flow,
// instead of the fixed top bar it uses on the `/ui` index page.
export function RegistryBreadcrumb() {
  const items = useRegistryBreadcrumbItems();

  return (
    <Breadcrumbs
      className="h-auto w-auto border-b-0 bg-transparent px-0 backdrop-blur-none"
      containerClassName="p-0"
      items={items}
    />
  );
}
