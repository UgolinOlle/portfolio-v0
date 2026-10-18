import type { LucideIcon } from 'lucide-react';

export interface NavSubItem {
  id: string;
  title: string;
  href?: string;
}

export interface NavItem {
  id: string;
  title: string;
  icon: LucideIcon;
  href?: string;
  badge?: string;
  /** Submenu. When set, the item discloses its children instead of navigating. */
  items?: NavSubItem[];
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export interface Workspace {
  id: string;
  name: string;
  plan: string;
  icon: LucideIcon;
}

export interface ShellUser {
  name: string;
  email: string;
  avatar?: string;
}

export interface Crumb {
  id: string;
  title: string;
}

/** Group > item > sub-item path of `activeId`, used for the header breadcrumbs. */
export function getTrail(groups: NavGroup[], activeId: string): Crumb[] {
  for (const group of groups) {
    for (const item of group.items) {
      const trail: Crumb[] = [{ id: group.id, title: group.label }];
      if (item.id === activeId) return [...trail, { id: item.id, title: item.title }];

      const child = item.items?.find((sub) => sub.id === activeId);
      if (child) {
        return [...trail, { id: item.id, title: item.title }, { id: child.id, title: child.title }];
      }
    }
  }

  return [];
}
