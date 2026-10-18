'use client';

import {
  BookOpenIcon,
  BotIcon,
  BuildingIcon,
  FrameIcon,
  LifeBuoyIcon,
  MapIcon,
  PieChartIcon,
  RocketIcon,
  Settings2Icon,
  SquareTerminalIcon,
} from 'lucide-react';

import { AppShell, ContentSkeleton } from '@/components/blocks/app-shell-1';
import type { NavGroup, ShellUser, Workspace } from '@/components/blocks/app-shell-1';

const workspaces: Workspace[] = [
  { id: 'acme', name: 'Acme Inc.', plan: 'Enterprise', icon: BuildingIcon },
  { id: 'launch', name: 'Launchpad', plan: 'Startup', icon: RocketIcon },
];

const nav: NavGroup[] = [
  {
    id: 'platform',
    label: 'Platform',
    items: [
      {
        id: 'playground',
        title: 'Playground',
        icon: SquareTerminalIcon,
        items: [
          { id: 'history', title: 'History' },
          { id: 'starred', title: 'Starred' },
        ],
      },
      { id: 'models', title: 'Models', icon: BotIcon, badge: '12' },
      { id: 'docs', title: 'Documentation', icon: BookOpenIcon },
      {
        id: 'settings',
        title: 'Settings',
        icon: Settings2Icon,
        items: [
          { id: 'general', title: 'General' },
          { id: 'team', title: 'Team' },
        ],
      },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    items: [
      { id: 'design', title: 'Design Engineering', icon: FrameIcon },
      { id: 'sales', title: 'Sales & Marketing', icon: PieChartIcon },
      { id: 'travel', title: 'Travel', icon: MapIcon },
      { id: 'support', title: 'Support', icon: LifeBuoyIcon },
    ],
  },
];

const user: ShellUser = { name: 'Ada Lovelace', email: 'ada@acme.com' };

export default function AppShell1Demo() {
  return (
    <AppShell contained nav={nav} user={user} workspaces={workspaces}>
      <ContentSkeleton />
    </AppShell>
  );
}
