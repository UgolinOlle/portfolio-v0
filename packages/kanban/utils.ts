import type { KanbanCard, KanbanLabel, KanbanMember } from './types';

/* ------------------------------ due dates ------------------------------ */

const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

export type DueTone = 'overdue' | 'soon' | 'later';

export function dueInfo(iso: string): { label: string; tone: DueTone } {
  const [y, m, d] = iso.split('-').map(Number);
  const due = new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((due.getTime() - today.getTime()) / 86_400_000);
  if (diff === 0) return { label: 'Today', tone: 'soon' };
  if (diff === 1) return { label: 'Tomorrow', tone: 'soon' };
  if (diff === -1) return { label: 'Yesterday', tone: 'overdue' };
  return { label: shortDate.format(due), tone: diff < 0 ? 'overdue' : 'later' };
}

/* -------------------------------- search -------------------------------- */

export interface ParsedQuery {
  text: string[];
  labels: string[];
  priorities: string[];
  people: string[];
  active: boolean;
}

/** `#design` filters by label, `!high` by priority, `@maya` by assignee; the rest is free text. */
export function parseQuery(query: string): ParsedQuery {
  const parsed: ParsedQuery = { text: [], labels: [], priorities: [], people: [], active: false };
  for (const raw of query.toLowerCase().split(/\s+/)) {
    if (!raw) continue;
    const body = raw.slice(1);
    if (raw[0] === '#' && body) parsed.labels.push(body);
    else if (raw[0] === '!' && body) parsed.priorities.push(body);
    else if (raw[0] === '@' && body) parsed.people.push(body);
    else if (!'#!@'.includes(raw)) parsed.text.push(raw);
  }
  parsed.active =
    parsed.text.length + parsed.labels.length + parsed.priorities.length + parsed.people.length > 0;
  return parsed;
}

const anyPrefix = (needles: string[], hay: string) => needles.some((n) => hay.startsWith(n));

export function matchesQuery(
  card: KanbanCard,
  q: ParsedQuery,
  labels: KanbanLabel[],
  members: KanbanMember[],
): boolean {
  if (!q.active) return true;
  if (q.labels.length) {
    const label = labels.find((l) => l.id === card.labelId)?.name.toLowerCase();
    if (!label || !anyPrefix(q.labels, label)) return false;
  }
  if (q.priorities.length && !anyPrefix(q.priorities, card.priority)) return false;
  if (q.people.length) {
    const name = members.find((m) => m.id === card.assigneeId)?.name.toLowerCase();
    if (!name || !anyPrefix(q.people, name)) return false;
  }
  const hay = `${card.title} ${card.description}`.toLowerCase();
  return q.text.every((t) => hay.includes(t));
}

export const uid = () => Math.random().toString(36).slice(2, 10);
