import type { LucideIcon } from 'lucide-react';

export type SearchItemType = 'chat' | 'agent' | 'document' | 'knowledge';
export type SearchItemStatus = 'active' | 'archived' | 'draft';
export type SearchTone = 'blue' | 'orange' | 'violet' | 'rose' | 'emerald' | 'sky' | 'amber';
export type SearchTab = 'all' | 'chats' | 'agents' | 'documents';
export type SearchUpdated = 'any' | 'today' | 'yesterday' | 'week' | 'month' | 'year';

export interface SearchItem {
  id: string;
  type: SearchItemType;
  title: string;
  description?: string;
  icon: LucideIcon;
  /** Icon tile colour. Defaults to `blue`. */
  tone?: SearchTone;
  /** 0 = today, 1 = yesterday… Drives the "Last updated" filter and the sort order. */
  updatedDaysAgo: number;
  status?: SearchItemStatus;
  /** Created by the current user. Drives the "Owner" filter. */
  mine?: boolean;
}

export interface SearchFilters {
  updated: SearchUpdated;
  types: SearchItemType[];
  statuses: SearchItemStatus[];
  mineOnly: boolean;
}

export interface CommandSearchLabels {
  placeholder?: string;
  tabs?: Record<SearchTab, string>;
  sections?: Record<SearchItemType, string>;
  lastUpdated?: string;
  updated?: Record<SearchUpdated, string>;
  type?: string;
  types?: Record<SearchItemType, string>;
  status?: string;
  statuses?: Record<SearchItemStatus, string>;
  owner?: string;
  createdByMe?: string;
  reset?: string;
  navigate?: string;
  select?: string;
  quit?: string;
  clear?: string;
  empty?: (query: string) => string;
  emptyHint?: string;
  results?: (count: number) => string;
}
