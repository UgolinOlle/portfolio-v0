export type ApprovalIcon = 'cart' | 'calendar' | 'lighting' | 'truck';
export type ApprovalStatus = 'due-today' | 'overdue' | 'open';
export type ApprovalSection = 'you' | 'team';

export interface Approval {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  icon: ApprovalIcon;
  section: ApprovalSection;
  status: ApprovalStatus;
  /** Who raised it (section "you") or who it is waiting on (section "team"). */
  person: string;
  /** Relative time, "you" section only. */
  ago?: string;
}

export type StepState = 'done' | 'current' | 'upcoming';

export interface WorkflowStep {
  id: string;
  kind: 'cart' | 'avatar';
  /** Avatar name when `kind` is "avatar". */
  person?: string;
  title: string;
  caption: string;
  state: StepState;
}

export interface EvidenceItem {
  id: string;
  icon: 'cart' | 'document' | 'calendar' | 'warehouse';
  title: string;
  agent: string;
  detail: string;
}

export interface ApprovalDetailData {
  id: string;
  title: string;
  status: ApprovalStatus;
  meta: string;
  amount: string;
  amountCaption: string;
  steps: WorkflowStep[];
  budget: {
    title: string;
    caption: string;
    limit: number;
    committed: number;
    purchase: number;
    forecast: number;
  };
  evidence: EvidenceItem[];
  comment: { author: string; role: string; context: string; body: string };
  nextStep: string;
  approveLabel: string;
}

export interface Stat {
  label: string;
  value: string;
}

export const currentUser = 'Alex Morgan';

export const stats: Stat[] = [
  { label: 'On you', value: '2' },
  { label: 'Value', value: '$199,200' },
  { label: 'Past 2 days', value: '1' },
];

export const navItems = [
  'Home',
  'Command',
  'Projects',
  'Procurement',
  'Inventory',
  'Approvals',
  'Reports',
] as const;

export const approvals: Approval[] = [
  {
    id: 'BC-0193',
    title: 'Wire and cable budget',
    subtitle: 'St. Clare · unblocks REQ-3108 · MC cable',
    amount: '+$12,800',
    icon: 'cart',
    section: 'you',
    status: 'due-today',
    person: 'Evan Brooks',
    ago: '4h ago',
  },
  {
    id: 'PO-10427',
    title: 'Switchgear lineup',
    subtitle: 'Front Range DH2 · Eaton · 16 week lead',
    amount: '$186,400',
    icon: 'cart',
    section: 'you',
    status: 'overdue',
    person: 'Marcus Reyes',
    ago: '2 days ago',
  },
  {
    id: 'REQ-3110',
    title: 'Ladder cable tray',
    subtitle: 'St. Clare · new supplier for tray',
    amount: '$7,350',
    icon: 'cart',
    section: 'team',
    status: 'open',
    person: 'Marcus Reyes',
  },
  {
    id: 'REQ-3111',
    title: 'Horn strobes',
    subtitle: 'St. Clare · Firelink Supply',
    amount: '$4,560',
    icon: 'cart',
    section: 'team',
    status: 'open',
    person: 'Evan Brooks',
  },
  {
    id: 'SC-0042',
    title: 'Lighting moves 3 days',
    subtitle: 'Civic Annex · Planner proposal',
    amount: '+3 d',
    icon: 'lighting',
    section: 'team',
    status: 'open',
    person: 'Dana Ortiz',
  },
  {
    id: 'TR-0877',
    title: 'EMT transfer',
    subtitle: 'WH-01 to Larkspur · 1,200 ft',
    amount: '$588',
    icon: 'truck',
    section: 'team',
    status: 'open',
    person: 'Priya Shah',
  },
];

export const details: Record<string, ApprovalDetailData> = {
  'BC-0193': {
    id: 'BC-0193',
    title: 'Wire and cable budget',
    status: 'due-today',
    meta: 'St. Clare Medical Pavilion · cost code 26 05 19 · requested by Evan Brooks 7:52 AM · drafted by Cost Controller',
    amount: '+$12,800',
    amountCaption: 'Line budget $274,000 to $286,800',
    steps: [
      { id: 's1', kind: 'cart', title: 'REQ-3108 drafted', caption: 'Buyer 7:44', state: 'done' },
      {
        id: 's2',
        kind: 'avatar',
        person: 'Evan Brooks',
        title: 'Evan approved PO',
        caption: 'PM limit · 8:05',
        state: 'done',
      },
      {
        id: 's3',
        kind: 'avatar',
        person: currentUser,
        title: 'You: budget change',
        caption: 'Waiting on you',
        state: 'current',
      },
      {
        id: 's4',
        kind: 'cart',
        title: 'PO-10462 issued',
        caption: 'After approval',
        state: 'upcoming',
      },
    ],
    budget: {
      title: 'Budget line 26 05 19',
      caption: 'USD · committed, this purchase and forecast to complete',
      limit: 274000,
      committed: 261860,
      purchase: 8940,
      forecast: 16000,
    },
    evidence: [
      {
        id: 'e1',
        icon: 'cart',
        title: 'REQ-3108 · draft requisition',
        agent: 'Buyer',
        detail: '6,000 ft MC cable 12/2 AL · need Oct 30 · L2 imaging',
      },
      {
        id: 'e2',
        icon: 'document',
        title: 'RFQ-0412 · 3 quotes',
        agent: 'Sourcing',
        detail: 'Rampart $8,940 · 5 d · Front Range $8,610 · 12 d · Mile High $9,380 · 3 d',
      },
      {
        id: 'e3',
        icon: 'calendar',
        title: 'Lookahead · L2 branch rough in',
        agent: 'Planner',
        detail: 'Starts Oct 30 · crew of 6 · 8,400 ft required',
      },
      {
        id: 'e4',
        icon: 'warehouse',
        title: 'Stock check · WH-01',
        agent: 'Allocator',
        detail: '2,400 ft available after reservations · reel R-114',
      },
    ],
    comment: {
      author: 'Evan Brooks',
      role: 'PM',
      context: 'note on REQ-3108 · 7:58',
      body: 'Rampart is the only supplier that makes Oct 30. Mile High is cheaper but lands Nov 2, after L2 rough in starts, so the crew would sit for three days.',
    },
    nextStep: 'Buyer issues PO-10462 to Rampart for $8,940, arriving at WH-01 on Oct 23.',
    approveLabel: 'Approve $12,800',
  },
};
