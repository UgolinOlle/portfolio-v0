'use client';

import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from 'lucide-react';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

import type { Workspace } from './nav';

export interface TeamSwitcherProps {
  workspaces: Workspace[];
  defaultWorkspaceId?: string;
  onWorkspaceChange?: (workspace: Workspace) => void;
}

export function TeamSwitcher({
  workspaces,
  defaultWorkspaceId,
  onWorkspaceChange,
}: TeamSwitcherProps) {
  const { isMobile } = useSidebar();
  const [activeId, setActiveId] = React.useState(defaultWorkspaceId ?? workspaces[0]?.id);
  const active = workspaces.find((workspace) => workspace.id === activeId) ?? workspaces[0];

  if (!active) return null;

  const ActiveIcon = active.icon;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                className="active:scale-[0.98] data-open:bg-sidebar-accent"
                size="lg"
                tooltip={active.name}
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-xs ring-1 ring-foreground/10 ring-inset">
              <ActiveIcon className="size-4" />
            </div>
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate text-sm font-semibold tracking-tight">{active.name}</span>
              <span className="truncate text-xs text-sidebar-foreground/60">{active.plan}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto text-sidebar-foreground/50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-64 min-w-56"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={8}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
              {workspaces.map((workspace) => {
                const Icon = workspace.icon;

                return (
                  <DropdownMenuItem
                    className="gap-2 p-2"
                    key={workspace.id}
                    onClick={() => {
                      setActiveId(workspace.id);
                      onWorkspaceChange?.(workspace);
                    }}
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                      <Icon className="size-3.5" />
                    </div>
                    <span className="flex-1 truncate">{workspace.name}</span>
                    {workspace.id === active.id && <CheckIcon className="size-4" />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border border-dashed bg-transparent">
                <PlusIcon className="size-3.5" />
              </div>
              <span className="text-muted-foreground">Add workspace</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
