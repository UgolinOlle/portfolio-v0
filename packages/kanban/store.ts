import type { KanbanCard, KanbanCardDraft, KanbanColumn, KanbanData } from './types';

/** What the last change was, so cards can pick the right enter/exit motion. */
export type KanbanOp = 'move' | 'delete' | 'other';

export interface KanbanState {
  data: KanbanData;
  past: KanbanData[];
  future: KanbanData[];
  lastOp: KanbanOp;
}

export type KanbanAction =
  | { type: 'card/add'; columnId: string; card: KanbanCard }
  | { type: 'card/update'; id: string; patch: Partial<KanbanCardDraft> }
  | { type: 'card/delete'; id: string }
  | { type: 'card/move'; id: string; toColumnId: string; toIndex: number }
  | { type: 'column/add'; column: KanbanColumn }
  | {
      type: 'column/update';
      id: string;
      patch: Partial<Pick<KanbanColumn, 'title' | 'accent' | 'wip' | 'collapsed'>>;
    }
  | { type: 'column/delete'; id: string }
  | { type: 'column/move'; id: string; toIndex: number }
  /** Close a drag: record `base` (the data when the drag began) as one undo step. */
  | { type: 'history/commit'; base: KanbanData }
  /** Cancelled drag: put the data back without touching history. */
  | { type: 'history/restore'; data: KanbanData }
  | { type: 'undo' }
  | { type: 'redo' }
  /** Replace everything (hydration, reset). Clears history. */
  | { type: 'data/replace'; data: KanbanData };

const HISTORY_LIMIT = 50;

export const createState = (data: KanbanData): KanbanState => ({
  data,
  past: [],
  future: [],
  lastOp: 'other',
});

export function findColumnId(data: KanbanData, cardId: string): string | null {
  for (const id of data.columnOrder) {
    if (data.columns[id]?.cardIds.includes(cardId)) return id;
  }
  return null;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** A change worth an undo step. */
function commit(state: KanbanState, data: KanbanData, lastOp: KanbanOp = 'other'): KanbanState {
  if (data === state.data) return state;
  return {
    data,
    past: [...state.past.slice(-(HISTORY_LIMIT - 1)), state.data],
    future: [],
    lastOp,
  };
}

/** A change that is part of a drag in progress: no history entry until the drag ends. */
function transient(state: KanbanState, data: KanbanData, lastOp: KanbanOp): KanbanState {
  return data === state.data ? state : { ...state, data, lastOp };
}

export function kanbanReducer(state: KanbanState, action: KanbanAction): KanbanState {
  const d = state.data;

  switch (action.type) {
    case 'card/add': {
      const col = d.columns[action.columnId];
      if (!col) return state;
      return commit(state, {
        ...d,
        cards: { ...d.cards, [action.card.id]: action.card },
        columns: { ...d.columns, [col.id]: { ...col, cardIds: [...col.cardIds, action.card.id] } },
      });
    }

    case 'card/update': {
      const card = d.cards[action.id];
      if (!card) return state;
      return commit(state, {
        ...d,
        cards: { ...d.cards, [card.id]: { ...card, ...action.patch } },
      });
    }

    case 'card/delete': {
      const columnId = findColumnId(d, action.id);
      if (!columnId || !d.cards[action.id]) return state;
      const col = d.columns[columnId];
      const { [action.id]: _removed, ...cards } = d.cards;
      return commit(
        state,
        {
          ...d,
          cards,
          columns: {
            ...d.columns,
            [columnId]: { ...col, cardIds: col.cardIds.filter((id) => id !== action.id) },
          },
        },
        'delete',
      );
    }

    case 'card/move': {
      const from = findColumnId(d, action.id);
      const dst = d.columns[action.toColumnId];
      if (!from || !dst) return state;
      const src = d.columns[from];
      const without = src.cardIds.filter((id) => id !== action.id);

      if (from === dst.id) {
        const next = [...without];
        next.splice(clamp(action.toIndex, 0, next.length), 0, action.id);
        if (next.every((id, i) => id === src.cardIds[i])) return state;
        return transient(
          state,
          { ...d, columns: { ...d.columns, [from]: { ...src, cardIds: next } } },
          'move',
        );
      }

      const next = [...dst.cardIds];
      next.splice(clamp(action.toIndex, 0, next.length), 0, action.id);
      return transient(
        state,
        {
          ...d,
          columns: {
            ...d.columns,
            [from]: { ...src, cardIds: without },
            [dst.id]: { ...dst, cardIds: next },
          },
        },
        'move',
      );
    }

    case 'column/add':
      return commit(state, {
        ...d,
        columns: { ...d.columns, [action.column.id]: action.column },
        columnOrder: [...d.columnOrder, action.column.id],
      });

    case 'column/update': {
      const col = d.columns[action.id];
      if (!col) return state;
      return commit(state, {
        ...d,
        columns: { ...d.columns, [col.id]: { ...col, ...action.patch } },
      });
    }

    case 'column/delete': {
      const col = d.columns[action.id];
      if (!col || d.columnOrder.length <= 1) return state;
      const { [action.id]: _col, ...columns } = d.columns;
      const cards = { ...d.cards };
      for (const id of col.cardIds) delete cards[id];
      return commit(
        state,
        { cards, columns, columnOrder: d.columnOrder.filter((id) => id !== action.id) },
        'delete',
      );
    }

    case 'column/move': {
      const from = d.columnOrder.indexOf(action.id);
      if (from < 0 || from === action.toIndex) return state;
      const order = [...d.columnOrder];
      order.splice(from, 1);
      order.splice(clamp(action.toIndex, 0, order.length), 0, action.id);
      return transient(state, { ...d, columnOrder: order }, 'move');
    }

    case 'history/commit':
      if (action.base === d) return state;
      return {
        ...state,
        past: [...state.past.slice(-(HISTORY_LIMIT - 1)), action.base],
        future: [],
      };

    case 'history/restore':
      return { ...state, data: action.data, lastOp: 'move' };

    case 'undo': {
      const previous = state.past.at(-1);
      if (!previous) return state;
      return {
        data: previous,
        past: state.past.slice(0, -1),
        future: [d, ...state.future],
        lastOp: 'other',
      };
    }

    case 'redo': {
      const [next, ...rest] = state.future;
      if (!next) return state;
      return { data: next, past: [...state.past, d], future: rest, lastOp: 'other' };
    }

    case 'data/replace':
      return createState(action.data);
  }
}
