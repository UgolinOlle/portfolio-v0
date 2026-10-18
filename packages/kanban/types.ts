export type KanbanPriority = 'low' | 'medium' | 'high';

export type KanbanArt = 'inbox' | 'rocket' | 'lens' | 'flag' | 'spark';

export interface KanbanLabel {
  id: string;
  name: string;
  /** Any CSS colour. Tints the chip; text stays readable in light and dark. */
  color: string;
}

export interface KanbanMember {
  id: string;
  name: string;
  color: string;
}

export interface KanbanChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  labelId: string | null;
  priority: KanbanPriority;
  /** ISO date (yyyy-mm-dd). */
  due: string | null;
  assigneeId: string | null;
  checklist: KanbanChecklistItem[];
}

export type KanbanCardDraft = Omit<KanbanCard, 'id'>;

export interface KanbanColumn {
  id: string;
  title: string;
  /** Any CSS colour: header dot, WIP meter and drop highlight. */
  accent: string;
  /** Maximum cards before the column is flagged. `null` for no limit. */
  wip: number | null;
  collapsed: boolean;
  /** Cards in a "done" column count towards progress and never read as overdue. */
  done: boolean;
  art: KanbanArt;
  cardIds: string[];
}

export interface KanbanData {
  cards: Record<string, KanbanCard>;
  columns: Record<string, KanbanColumn>;
  columnOrder: string[];
}
