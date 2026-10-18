'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import type { NavGroup, ShellUser, Workspace } from './nav';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { TeamSwitcher } from './team-switcher';

export interface AppSidebarProps {
  workspaces: Workspace[];
  nav: NavGroup[];
  user: ShellUser;
  activeId: string;
  onNavigate: (id: string) => void;
  onWorkspaceChange?: (workspace: Workspace) => void;
  onSignOut?: () => void;
  /** Pin the rail inside its positioned parent instead of the viewport (see `AppShell`). */
  contained?: boolean;
}

export function AppSidebar({
  workspaces,
  nav,
  user,
  activeId,
  onNavigate,
  onWorkspaceChange,
  onSignOut,
  contained,
}: AppSidebarProps) {
  return (
    <Sidebar className={cn(contained && 'absolute h-full')} collapsible="icon" variant="inset">
      <SidebarHeader>
        <TeamSwitcher onWorkspaceChange={onWorkspaceChange} workspaces={workspaces} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain activeId={activeId} groups={nav} onNavigate={onNavigate} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser onSignOut={onSignOut} user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
