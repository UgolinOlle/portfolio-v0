'use client';

import {
  BadgeDollarSignIcon,
  Building2Icon,
  CircleCheckBigIcon,
  UserRoundIcon,
} from 'lucide-react';
import * as React from 'react';

import { CommandSearch } from '@/components/blocks/command-search';
import type { CommandSearchLabels, SearchItem } from '@/components/blocks/command-search';

/* CommandSearch has four item types. Here they stand for deals, people, companies and tasks. */
export const defaultSearchItems: SearchItem[] = [
  {
    id: 'deal-orbit',
    type: 'chat',
    title: 'Orbit Labs · Platform rollout',
    description: '$120K · Closing · closes Oct 17',
    icon: BadgeDollarSignIcon,
    tone: 'emerald',
    updatedDaysAgo: 0,
    status: 'active',
    mine: true,
  },
  {
    id: 'deal-acme',
    type: 'chat',
    title: 'Acme Corp · Annual renewal',
    description: '$84K · Negotiation · closes Oct 18',
    icon: BadgeDollarSignIcon,
    tone: 'orange',
    updatedDaysAgo: 0,
    status: 'active',
    mine: true,
  },
  {
    id: 'deal-northwind',
    type: 'chat',
    title: 'Northwind · Team expansion',
    description: '$62K · Proposal · closes Oct 22',
    icon: BadgeDollarSignIcon,
    tone: 'blue',
    updatedDaysAgo: 1,
    status: 'active',
  },
  {
    id: 'deal-lumen',
    type: 'chat',
    title: 'Lumen · Pilot program',
    description: '$48K · Qualified · closes Oct 29',
    icon: BadgeDollarSignIcon,
    tone: 'violet',
    updatedDaysAgo: 2,
    status: 'active',
    mine: true,
  },
  {
    id: 'deal-vertex',
    type: 'chat',
    title: 'Vertex · Team plan',
    description: '$40K · Won on Monday',
    icon: BadgeDollarSignIcon,
    tone: 'emerald',
    updatedDaysAgo: 4,
    status: 'archived',
  },
  {
    id: 'p-priya',
    type: 'agent',
    title: 'Priya Nair',
    icon: UserRoundIcon,
    tone: 'rose',
    updatedDaysAgo: 0,
    status: 'active',
    mine: true,
  },
  {
    id: 'p-jules',
    type: 'agent',
    title: 'Jules Dupont',
    icon: UserRoundIcon,
    tone: 'sky',
    updatedDaysAgo: 1,
    status: 'active',
  },
  {
    id: 'p-mina',
    type: 'agent',
    title: 'Mina Kowalski',
    icon: UserRoundIcon,
    tone: 'amber',
    updatedDaysAgo: 3,
    status: 'active',
  },
  {
    id: 'p-sam',
    type: 'agent',
    title: 'Sam Rivera',
    icon: UserRoundIcon,
    tone: 'violet',
    updatedDaysAgo: 9,
    status: 'draft',
  },
  {
    id: 'c-acme',
    type: 'document',
    title: 'Acme Corp',
    description: 'Enterprise · 4 open deals',
    icon: Building2Icon,
    tone: 'orange',
    updatedDaysAgo: 0,
    status: 'active',
    mine: true,
  },
  {
    id: 'c-northwind',
    type: 'document',
    title: 'Northwind Traders',
    description: 'Mid-market · 2 open deals',
    icon: Building2Icon,
    tone: 'blue',
    updatedDaysAgo: 1,
    status: 'active',
  },
  {
    id: 'c-helix',
    type: 'document',
    title: 'Helix Systems',
    description: 'Mid-market · 1 open deal',
    icon: Building2Icon,
    tone: 'sky',
    updatedDaysAgo: 6,
    status: 'active',
  },
  {
    id: 't-priya',
    type: 'knowledge',
    title: 'Call Priya at Lumen',
    description: 'Discovery follow-up · overdue',
    icon: CircleCheckBigIcon,
    tone: 'rose',
    updatedDaysAgo: 0,
    status: 'active',
    mine: true,
  },
  {
    id: 't-proposal',
    type: 'knowledge',
    title: 'Send proposal to Northwind',
    description: 'Proposal · today 13:00',
    icon: CircleCheckBigIcon,
    tone: 'blue',
    updatedDaysAgo: 0,
    status: 'active',
    mine: true,
  },
  {
    id: 't-forecast',
    type: 'knowledge',
    title: 'Update Q3 forecast notes',
    description: 'Forecast · overdue',
    icon: CircleCheckBigIcon,
    tone: 'amber',
    updatedDaysAgo: 1,
    status: 'active',
  },
];

const labels: CommandSearchLabels = {
  placeholder: 'Search deals, people, companies…',
  tabs: { all: 'All', chats: 'Deals', agents: 'People', documents: 'Companies' },
  sections: { chat: 'Deals', agent: 'People', document: 'Companies', knowledge: 'Tasks' },
  types: { chat: 'Deals', agent: 'People', document: 'Companies', knowledge: 'Tasks' },
  statuses: { active: 'Open', archived: 'Closed', draft: 'Lead' },
  createdByMe: 'Assigned to me',
};

/** CommandSearch re-themed to the template's dark palette (it reads the shadcn tokens). */
const darkTokens = {
  '--card': '#161616',
  '--card-foreground': '#f5f5f5',
  '--foreground': '#f5f5f5',
  '--popover': '#161616',
  '--popover-foreground': '#f5f5f5',
  '--muted': '#262626',
  '--muted-foreground': '#9a9a9a',
  '--accent': '#262626',
  '--accent-foreground': '#f5f5f5',
  '--border': 'rgba(255,255,255,0.1)',
  '--input': 'rgba(255,255,255,0.14)',
  '--ring': 'rgba(255,255,255,0.4)',
  '--primary': '#f5f5f5',
  '--primary-foreground': '#0a0a0a',
  '--color-card': '#161616',
  '--color-card-foreground': '#f5f5f5',
  '--color-foreground': '#f5f5f5',
  '--color-muted': '#262626',
  '--color-muted-foreground': '#9a9a9a',
  '--color-accent': '#262626',
  '--color-border': 'rgba(255,255,255,0.1)',
  '--color-input': 'rgba(255,255,255,0.14)',
  '--color-ring': 'rgba(255,255,255,0.4)',
  '--color-primary': '#f5f5f5',
  '--color-primary-foreground': '#0a0a0a',
  colorScheme: 'dark',
} as React.CSSProperties;

/**
 * ⌘K overlay around `CommandSearch`. Opened from the keyboard, so it appears without animation:
 * an action repeated all day should not make the user wait for a transition.
 */
export function CommandPalette({
  open,
  items = defaultSearchItems,
  onSelect,
  onClose,
}: {
  open: boolean;
  items?: SearchItem[];
  onSelect: (item: SearchItem) => void;
  onClose: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  // `autoFocus` fires before CommandSearch's onFocus is attached, so its panel would stay shut.
  React.useEffect(() => {
    if (!open) return;
    const input = ref.current?.querySelector('input');
    input?.blur();
    input?.focus();
    // CommandSearch also opens on click, which covers browsers that skip focus events.
    input?.click();
  }, [open]);

  if (!open) return null;
  return (
    <div
      ref={ref}
      aria-label="Search"
      aria-modal="true"
      className="dark absolute inset-0 z-50 flex items-start justify-center bg-black/65 px-4 pt-[10vh]"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      style={darkTokens}
    >
      <CommandSearch
        autoFocus
        className="max-w-[660px]"
        items={items}
        labels={labels}
        onQuit={onClose}
        onSelect={onSelect}
      />
    </div>
  );
}
