import type {
  KanbanCard,
  KanbanColumn,
  KanbanData,
  KanbanLabel,
  KanbanMember,
  KanbanPriority,
} from './types';

export const DEFAULT_LABELS: KanbanLabel[] = [
  { id: 'design', name: 'Design', color: '#9a84c4' },
  { id: 'frontend', name: 'Frontend', color: '#6f97b8' },
  { id: 'backend', name: 'Backend', color: '#c9a15e' },
  { id: 'research', name: 'Research', color: '#6fae98' },
  { id: 'bug', name: 'Bug', color: '#c9707a' },
  { id: 'ops', name: 'Ops', color: '#8c8fb8' },
];

export const DEFAULT_MEMBERS: KanbanMember[] = [
  { id: 'maya', name: 'Maya', color: '#b98466' },
  { id: 'theo', name: 'Theo', color: '#6f8fb0' },
  { id: 'isla', name: 'Isla', color: '#9a84c4' },
  { id: 'kenji', name: 'Kenji', color: '#5f9c88' },
  { id: 'noor', name: 'Noor', color: '#b99a55' },
];

export const PRIORITIES: Record<KanbanPriority, { name: string; color: string }> = {
  low: { name: 'Low', color: '#6fae98' },
  medium: { name: 'Medium', color: '#d3a55f' },
  high: { name: 'High', color: '#c96a74' },
};
export const PRIORITY_IDS = Object.keys(PRIORITIES) as KanbanPriority[];

/** Accent choices offered in the column settings. */
export const ACCENTS = [
  '#8f86c9',
  '#d9985f',
  '#c9788f',
  '#6fae98',
  '#7fa6c4',
  '#c9b063',
  '#c98a74',
  '#9db26f',
];

const pad = (n: number) => String(n).padStart(2, '0');

function offsetDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

type SeedCard = [
  id: string,
  title: string,
  description: string,
  labelId: string,
  priority: KanbanPriority,
  dueInDays: number | null,
  assigneeId: string | null,
  checklist?: [text: string, done: boolean][],
];

const SEED_CARDS: SeedCard[] = [
  [
    'c1',
    'Audit onboarding emails',
    'Map every touchpoint in the first 14 days and flag the drop-off moments.',
    'research',
    'low',
    9,
    'noor',
  ],
  [
    'c2',
    'Dark-mode illustration set',
    'Six spot illustrations that hold up on both light and dark surfaces.',
    'design',
    'medium',
    6,
    'isla',
    [
      ['Sketch concepts', true],
      ['Pick a palette', true],
      ['Export SVGs', false],
    ],
  ],
  [
    'c3',
    'Webhook retry policy',
    'Exponential backoff with jitter, dead-letter queue after 8 attempts.',
    'backend',
    'medium',
    null,
    'theo',
  ],
  [
    'c4',
    'Move icons to an SVG sprite',
    'Cut ~40 requests from the dashboard first paint.',
    'frontend',
    'low',
    14,
    'kenji',
  ],
  [
    'c5',
    'Redesign the pricing page',
    'Three tiers, one clear recommendation, and a calmer comparison table.',
    'design',
    'high',
    2,
    'maya',
    [
      ['Wireframes', true],
      ['Copy review', false],
      ['Handoff', false],
    ],
  ],
  [
    'c6',
    'Rate-limit middleware',
    'Token bucket per API key, with a friendly 429 payload.',
    'backend',
    'high',
    1,
    'theo',
  ],
  [
    'c7',
    'Command palette v2',
    'Fuzzy search, recent items and keyboard-first navigation.',
    'frontend',
    'medium',
    4,
    'kenji',
  ],
  [
    'c8',
    'Fix Safari scroll jank',
    'Sticky headers repaint on every frame inside the activity feed.',
    'bug',
    'high',
    -1,
    'isla',
  ],
  [
    'c9',
    'Billing portal copy',
    'Replace jargon in the invoice and refund screens.',
    'research',
    'low',
    3,
    'noor',
  ],
  [
    'c10',
    'Staging deploy pipeline',
    'Preview environments per pull request, torn down on merge.',
    'ops',
    'medium',
    5,
    'theo',
  ],
  [
    'c11',
    'Brand colour tokens',
    'Single source of truth shared by web, email and slides.',
    'design',
    'low',
    -3,
    'maya',
  ],
  [
    'c12',
    'Set up error tracking',
    'Source maps uploaded on release, alerts routed to on-call.',
    'ops',
    'medium',
    -5,
    'kenji',
  ],
  [
    'c13',
    'Customer interviews, round 1',
    'Eight calls synthesised into a one-page insight brief.',
    'research',
    'medium',
    -7,
    'noor',
  ],
];

/**
 * A realistic board to start from. Dates are relative to today, so call it at render time
 * (e.g. in a `useState` initialiser), not at module scope.
 */
export function createSampleBoard(): KanbanData {
  const cards: KanbanCard[] = SEED_CARDS.map(
    ([id, title, description, labelId, priority, dueInDays, assigneeId, checklist]) => ({
      id,
      title,
      description,
      labelId,
      priority,
      due: dueInDays === null ? null : offsetDate(dueInDays),
      assigneeId,
      checklist: (checklist ?? []).map(([text, done], i) => ({ id: `${id}-t${i}`, text, done })),
    }),
  );

  const column = (
    id: string,
    title: string,
    accent: string,
    art: KanbanColumn['art'],
    wip: number | null,
    cardIds: string[],
    done = false,
  ): KanbanColumn => ({ id, title, accent, wip, collapsed: false, done, art, cardIds });

  const columns = [
    column('backlog', 'Backlog', '#8f86c9', 'inbox', null, ['c1', 'c2', 'c3', 'c4']),
    column('doing', 'In progress', '#d9985f', 'rocket', 3, ['c5', 'c6', 'c7']),
    column('review', 'Review', '#c9788f', 'lens', 4, ['c8', 'c9', 'c10']),
    column('done', 'Done', '#6fae98', 'flag', null, ['c11', 'c12', 'c13'], true),
  ];

  return {
    cards: Object.fromEntries(cards.map((c) => [c.id, c])),
    columns: Object.fromEntries(columns.map((c) => [c.id, c])),
    columnOrder: columns.map((c) => c.id),
  };
}
