'use client';

import * as React from 'react';

import type { KanbanCardDraft, KanbanColumn, KanbanData, KanbanLabel, KanbanMember } from './types';

export interface KanbanActions {
  addCard: (columnId: string, draft: Partial<KanbanCardDraft> & { title: string }) => void;
  updateCard: (id: string, patch: Partial<KanbanCardDraft>) => void;
  deleteCard: (id: string) => void;
  addColumn: () => void;
  updateColumn: (
    id: string,
    patch: Partial<Pick<KanbanColumn, 'title' | 'accent' | 'wip' | 'collapsed'>>,
  ) => void;
  deleteColumn: (id: string) => void;
  moveCard: (id: string, toColumnId: string, toIndex: number) => void;
  moveColumn: (id: string, toIndex: number) => void;
  undo: () => void;
  redo: () => void;
  /** Record a finished drag as one undo step. */
  commitDrag: (base: KanbanData) => void;
  restore: (data: KanbanData) => void;
}

export interface KanbanContextValue {
  labels: KanbanLabel[];
  members: KanbanMember[];
  actions: KanbanActions;
  openCard: (id: string) => void;
}

export const KanbanContext = React.createContext<KanbanContextValue | null>(null);

export function useKanban(): KanbanContextValue {
  const ctx = React.useContext(KanbanContext);
  if (!ctx) throw new Error('Kanban parts must be rendered inside <Kanban>');
  return ctx;
}
