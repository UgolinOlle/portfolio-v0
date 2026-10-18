import {
  BriefcaseIcon,
  Building2Icon,
  CircleDollarSignIcon,
  ClipboardListIcon,
  ContactIcon,
  HeartHandshakeIcon,
  InboxIcon,
  LayoutGridIcon,
  ListChecksIcon,
  RefreshCwIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavItem = { id: string; label: string; icon: LucideIcon; badge?: string };
export type Pipeline = {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  count: number;
};

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: LayoutGridIcon },
  { id: 'inbox', label: 'Inbox', icon: InboxIcon, badge: '6' },
  { id: 'contacts', label: 'Contacts', icon: ContactIcon },
  { id: 'companies', label: 'Companies', icon: Building2Icon },
  { id: 'deals', label: 'Deals', icon: CircleDollarSignIcon },
  { id: 'tasks', label: 'Tasks', icon: ListChecksIcon },
  { id: 'reports', label: 'Reports', icon: ClipboardListIcon },
];

export const pipelines: Pipeline[] = [
  { id: 'enterprise', label: 'Enterprise', icon: Building2Icon, color: '#f0532d', count: 12 },
  { id: 'mid-market', label: 'Mid-market', icon: BriefcaseIcon, color: '#4f8cff', count: 21 },
  {
    id: 'partnerships',
    label: 'Partnerships',
    icon: HeartHandshakeIcon,
    color: '#34d399',
    count: 8,
  },
  { id: 'renewals', label: 'Renewals', icon: RefreshCwIcon, color: '#a78bfa', count: 5 },
];

export const recents = ['Acme renewal — call notes', 'Q3 forecast review'];

export const tabs = ['Overview', 'Pipeline', 'Activity', 'Forecast'] as const;

export type Kpi = {
  id: string;
  label: string;
  value: number;
  /** Formats the animated value, e.g. `$1.84M`. */
  format: (n: number) => string;
  delta: number;
  caption: string;
  /** Twelve recent points for the sparkline. */
  trend: number[];
};

export const kpis: Kpi[] = [
  {
    id: 'pipeline',
    label: 'Open pipeline',
    value: 1.84,
    format: (n) => `$${n.toFixed(2)}M`,
    delta: 12.4,
    caption: 'vs last month',
    trend: [1.2, 1.3, 1.25, 1.42, 1.5, 1.47, 1.6, 1.58, 1.66, 1.72, 1.7, 1.84],
  },
  {
    id: 'won',
    label: 'Won this month',
    value: 312,
    format: (n) => `$${Math.round(n)}K`,
    delta: 8.1,
    caption: '24 deals closed',
    trend: [210, 240, 228, 260, 255, 280, 270, 295, 288, 301, 306, 312],
  },
  {
    id: 'win-rate',
    label: 'Win rate',
    value: 27,
    format: (n) => `${Math.round(n)}%`,
    delta: -2.3,
    caption: 'vs last month',
    trend: [31, 30, 32, 31, 29, 30, 28, 29, 28, 27.5, 28, 27],
  },
];

export type Task = { id: string; title: string; meta: string; overdue?: boolean; done?: boolean };

export const tasks: Task[] = [
  { id: 't1', title: 'Call Priya at Lumen', meta: 'Discovery follow-up', overdue: true },
  { id: 't2', title: 'Send proposal to Northwind', meta: 'Proposal · 13:00' },
  { id: 't3', title: 'Review Acme renewal terms', meta: 'Contract · 15:30' },
  { id: 't4', title: 'Update Q3 forecast notes', meta: 'Forecast · yesterday', overdue: true },
  { id: 't5', title: 'Intro call with Helix', meta: 'Prospecting · 17:00' },
];

/** Monthly figures in $K. `forecast` is stage-weighted, `won` is closed-won. */
export type MonthPoint = { id: string; label: string; long: string; forecast: number; won: number };

export const months: MonthPoint[] = [
  { id: 'nov', label: 'Nov', long: 'November', forecast: 335, won: 301 },
  { id: 'dec', label: 'Dec', long: 'December', forecast: 548, won: 502 },
  { id: 'jan', label: 'Jan', long: 'January', forecast: 296, won: 262 },
  { id: 'feb', label: 'Feb', long: 'February', forecast: 318, won: 290 },
  { id: 'mar', label: 'Mar', long: 'March', forecast: 341, won: 316 },
  { id: 'apr', label: 'Apr', long: 'April', forecast: 352, won: 327 },
  { id: 'may', label: 'May', long: 'May', forecast: 360, won: 322 },
  { id: 'jun', label: 'Jun', long: 'June', forecast: 395, won: 371 },
  { id: 'jul', label: 'Jul', long: 'July', forecast: 420, won: 398 },
  { id: 'aug', label: 'Aug', long: 'August', forecast: 440, won: 405 },
  { id: 'sep', label: 'Sep', long: 'September', forecast: 455, won: 441 },
  { id: 'oct', label: 'Oct', long: 'October', forecast: 390, won: 312 },
];

export const ranges = [
  { id: '3M', count: 3 },
  { id: '6M', count: 6 },
  { id: '12M', count: 12 },
] as const;
export type RangeId = (typeof ranges)[number]['id'];

/** Revenue target for six months, in $K. Scales linearly with the range. */
export const TARGET_6M = 2800;

export type Stage = { id: string; label: string; value: number; deals: number };

/** Open pipeline by stage, in $K. Sums to the $1.84M headline. */
export const stages: Stage[] = [
  { id: 'prospecting', label: 'Prospecting', value: 620, deals: 41 },
  { id: 'qualified', label: 'Qualified', value: 480, deals: 28 },
  { id: 'proposal', label: 'Proposal', value: 390, deals: 17 },
  { id: 'negotiation', label: 'Negotiation', value: 260, deals: 9 },
  { id: 'closing', label: 'Closing', value: 90, deals: 4 },
];

export type Source = { id: string; label: string; share: number; color: string };

export const sources: Source[] = [
  { id: 'outbound', label: 'Outbound', share: 38, color: '#ff6b2c' },
  { id: 'inbound', label: 'Inbound', share: 27, color: '#4f8cff' },
  { id: 'referrals', label: 'Referrals', share: 21, color: '#34d399' },
  { id: 'partners', label: 'Partners', share: 14, color: '#a78bfa' },
];

export type Deal = {
  id: string;
  name: string;
  company: string;
  stage: string;
  amount: number;
  close: string;
  probability: number;
  owner: string;
};

export const deals: Deal[] = [
  {
    id: 'd1',
    name: 'Platform rollout',
    company: 'Orbit Labs',
    stage: 'Closing',
    amount: 120,
    close: 'Oct 17',
    probability: 90,
    owner: 'PN',
  },
  {
    id: 'd2',
    name: 'Annual renewal',
    company: 'Acme Corp',
    stage: 'Negotiation',
    amount: 84,
    close: 'Oct 18',
    probability: 75,
    owner: 'JD',
  },
  {
    id: 'd3',
    name: 'Team expansion',
    company: 'Northwind',
    stage: 'Proposal',
    amount: 62,
    close: 'Oct 22',
    probability: 55,
    owner: 'MK',
  },
  {
    id: 'd4',
    name: 'Pilot program',
    company: 'Lumen',
    stage: 'Qualified',
    amount: 48,
    close: 'Oct 29',
    probability: 40,
    owner: 'PN',
  },
  {
    id: 'd5',
    name: 'Starter plan',
    company: 'Helix',
    stage: 'Prospecting',
    amount: 36,
    close: 'Nov 04',
    probability: 20,
    owner: 'AS',
  },
];

/* ----------------------------------------------------------------------------------------------
 * Command search, notifications, activity
 * --------------------------------------------------------------------------------------------*/

export type Notice = { id: string; title: string; body: string; time: string; unread?: boolean };

export const notices: Notice[] = [
  {
    id: 'n1',
    title: 'Acme Corp opened your proposal',
    body: 'Viewed 3 times in the last hour',
    time: '12m',
    unread: true,
  },
  {
    id: 'n2',
    title: 'Priya replied',
    body: '“Thursday works, let’s lock it in.”',
    time: '48m',
    unread: true,
  },
  {
    id: 'n3',
    title: 'Orbit Labs moved to Closing',
    body: 'Platform rollout · $120K',
    time: '2h',
    unread: true,
  },
  {
    id: 'n4',
    title: 'Weekly forecast is ready',
    body: 'You are at 88% of target',
    time: 'Yesterday',
  },
];

export type ActivityKind = 'won' | 'email' | 'call' | 'stage' | 'note';
export type ActivityEntry = {
  id: string;
  kind: ActivityKind;
  who: string;
  text: string;
  target: string;
  time: string;
};

export const activity: ActivityEntry[] = [
  {
    id: 'a1',
    kind: 'won',
    who: 'Amara O.',
    text: 'closed',
    target: 'Orbit Labs · Platform rollout',
    time: '9:42',
  },
  {
    id: 'a2',
    kind: 'email',
    who: 'Priya N.',
    text: 'replied to',
    target: 'Lumen · Pilot program',
    time: '9:15',
  },
  {
    id: 'a3',
    kind: 'stage',
    who: 'Jules D.',
    text: 'moved to Negotiation',
    target: 'Acme Corp · Annual renewal',
    time: '8:50',
  },
  {
    id: 'a4',
    kind: 'call',
    who: 'Mina K.',
    text: 'logged a 25 min call with',
    target: 'Northwind',
    time: 'Yesterday',
  },
  {
    id: 'a5',
    kind: 'note',
    who: 'Amara O.',
    text: 'added a note on',
    target: 'Helix · Starter plan',
    time: 'Yesterday',
  },
  {
    id: 'a6',
    kind: 'won',
    who: 'Jules D.',
    text: 'closed',
    target: 'Vertex · Team plan',
    time: 'Mon',
  },
];
