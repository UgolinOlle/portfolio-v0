'use client';

import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';
import * as React from 'react';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import { AppSidebar } from './app-sidebar';
import { getTrail } from './nav';
import type { NavGroup, ShellUser, Workspace } from './nav';
import { SiteHeader } from './site-header';

export type { Crumb, NavGroup, NavItem, NavSubItem, ShellUser, Workspace } from './nav';
export { getTrail } from './nav';
export { AppSidebar } from './app-sidebar';
export { ContentSkeleton } from './content-skeleton';
export { SiteHeader } from './site-header';
export { ThemeToggle } from './theme-toggle';

export interface AppShellProps {
  workspaces: Workspace[];
  nav: NavGroup[];
  user: ShellUser;
  /** Controlled active nav id (an item, or a sub-item). */
  activeId?: string;
  /** Uncontrolled initial active id. Defaults to the first item. */
  defaultActiveId?: string;
  onNavigate?: (id: string) => void;
  onWorkspaceChange?: (workspace: Workspace) => void;
  onSignOut?: () => void;
  /** Initial sidebar state. */
  defaultOpen?: boolean;
  /**
   * Fill the parent (which must have a height) instead of the viewport. For embedding the shell
   * in a frame, e.g. docs previews; leave off for a real app.
   */
  contained?: boolean;
  className?: string;
  /** The page content, rendered below the sticky header. */
  children?: React.ReactNode;
}

export function AppShell({
  workspaces,
  nav,
  user,
  activeId: controlledId,
  defaultActiveId,
  onNavigate,
  onWorkspaceChange,
  onSignOut,
  defaultOpen = true,
  contained = false,
  className,
  children,
}: AppShellProps) {
  const [internalId, setInternalId] = React.useState(defaultActiveId ?? nav[0]?.items[0]?.id ?? '');
  const activeId = controlledId ?? internalId;

  const handleNavigate = React.useCallback(
    (id: string) => {
      setInternalId(id);
      onNavigate?.(id);
    },
    [onNavigate],
  );

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <SidebarProvider
          className={cn(contained && 'relative h-full min-h-0 overflow-hidden', className)}
          defaultOpen={defaultOpen}
          style={
            {
              '--sidebar-width': '16.5rem',
              '--header-height': 'calc(var(--spacing) * 14)',
            } as React.CSSProperties
          }
        >
          <AppSidebar
            activeId={activeId}
            contained={contained}
            nav={nav}
            onNavigate={handleNavigate}
            onSignOut={onSignOut}
            onWorkspaceChange={onWorkspaceChange}
            user={user}
            workspaces={workspaces}
          />
          <SidebarInset className={cn(contained && 'min-h-0 overflow-y-auto overscroll-contain')}>
            <SiteHeader trail={getTrail(nav, activeId)} />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
