'use client';

import {
  closestCenter,
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
  type Announcements,
  type CollisionDetection,
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  type DragStartEvent,
  type KeyboardCoordinateGetter,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { PlusIcon } from 'lucide-react';
import {
  AnimatePresence,
  domMax,
  LayoutGroup,
  LazyMotion,
  m,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { DraggedCard } from './card';
import { CardSheet } from './card-sheet';
import { Column } from './column';
import { KanbanContext, type KanbanActions, type KanbanContextValue } from './context';
import { ACCENTS, createSampleBoard, DEFAULT_LABELS, DEFAULT_MEMBERS } from './data';
import { DROP_ANIMATION, ENTER, EXIT, INTRO_MS, LAYOUT, MAX_TILT } from './motion';
import { createState, findColumnId, kanbanReducer } from './store';
import { Toolbar } from './toolbar';
import type { KanbanCard, KanbanData, KanbanLabel, KanbanMember } from './types';
import { matchesQuery, parseQuery, uid } from './utils';

export { createSampleBoard, DEFAULT_LABELS, DEFAULT_MEMBERS } from './data';
export type * from './types';

export interface KanbanProps {
  /** Initial board. Defaults to a small sample board. */
  defaultValue?: KanbanData;
  /** Called with the new board after every change (not during a drag). */
  onValueChange?: (data: KanbanData) => void;
  /** Persist the board in `localStorage` under this key. */
  storageKey?: string;
  labels?: KanbanLabel[];
  members?: KanbanMember[];
  /** `n` new card, `/` filter, `⌘Z` / `⇧⌘Z` undo and redo. Scoped to the board. Default `true`. */
  hotkeys?: boolean;
  className?: string;
}

const noStrategy = () => null;

/* ------------------------------ collision ------------------------------ */

const collision: CollisionDetection = (args) => {
  const kind = args.active.data.current?.type;
  const typeOf = (id: string | number) =>
    args.droppableContainers.find((c) => c.id === id)?.data.current?.type;

  if (kind === 'column') {
    return closestCenter({
      ...args,
      droppableContainers: args.droppableContainers.filter(
        (c) => c.data.current?.type === 'column',
      ),
    });
  }

  const pool = args.droppableContainers.filter((c) => {
    const t = c.data.current?.type;
    return t === 'card' || t === 'body';
  });
  const hits = pointerWithin({ ...args, droppableContainers: pool });
  const candidates = hits.length ? hits : closestCorners({ ...args, droppableContainers: pool });
  // A card under the pointer beats the column body that contains it.
  const card = candidates.find((c) => typeOf(c.id) === 'card');
  return card ? [card] : candidates.slice(0, 1);
};

/** Arrow keys while a keyboard drag is active: small steps vertically, one column per press sideways. */
const keyboardCoordinates: KeyboardCoordinateGetter = (event, { currentCoordinates }) => {
  switch (event.code) {
    case 'ArrowDown':
      return { ...currentCoordinates, y: currentCoordinates.y + 72 };
    case 'ArrowUp':
      return { ...currentCoordinates, y: currentCoordinates.y - 72 };
    case 'ArrowRight':
      return { ...currentCoordinates, x: currentCoordinates.x + 304 };
    case 'ArrowLeft':
      return { ...currentCoordinates, x: currentCoordinates.x - 304 };
  }
  return undefined;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function isKanbanData(value: unknown): value is KanbanData {
  const v = value as Partial<KanbanData> | null;
  return (
    !!v &&
    typeof v.cards === 'object' &&
    typeof v.columns === 'object' &&
    Array.isArray(v.columnOrder) &&
    v.columnOrder.length > 0 &&
    v.columnOrder.every((id) => Array.isArray(v.columns?.[id]?.cardIds))
  );
}

/* ------------------------------- component ------------------------------ */

/**
 * `LazyMotion` + `m.*` keep the bundle small; `domMax` is required for layout animations.
 * `reducedMotion="user"` drops transforms (and keeps fades) for people who ask for less motion.
 */
export function Kanban(props: KanbanProps) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">
        <KanbanBoard {...props} />
      </MotionConfig>
    </LazyMotion>
  );
}

function KanbanBoard({
  defaultValue,
  onValueChange,
  storageKey,
  labels = DEFAULT_LABELS,
  members = DEFAULT_MEMBERS,
  hotkeys = true,
  className,
}: KanbanProps) {
  const id = React.useId();
  const reduceMotion = useReducedMotion();
  const [state, dispatch] = React.useReducer(kanbanReducer, undefined, () =>
    createState(defaultValue ?? createSampleBoard()),
  );
  const { data } = state;
  const stateRef = React.useRef(state);
  stateRef.current = state;

  /* ------------------------- persistence + callbacks ------------------------- */

  const hydrated = React.useRef(false);
  React.useEffect(() => {
    if (storageKey) {
      try {
        const raw = localStorage.getItem(storageKey);
        const parsed: unknown = raw ? JSON.parse(raw) : null;
        if (isKanbanData(parsed)) dispatch({ type: 'data/replace', data: parsed });
      } catch {
        // unreadable storage: keep the initial board
      }
    }
    hydrated.current = true;
  }, [storageKey]);

  const firstRun = React.useRef(true);
  React.useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (!hydrated.current) return;
    onValueChange?.(data);
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      // quota / private mode: persistence is best-effort
    }
  }, [data, onValueChange, storageKey]);

  /* --------------------------------- actions --------------------------------- */

  const actions = React.useMemo<KanbanActions>(
    () => ({
      addCard: (columnId, draft) =>
        dispatch({
          type: 'card/add',
          columnId,
          card: {
            id: uid(),
            description: '',
            labelId: null,
            priority: 'medium',
            due: null,
            assigneeId: null,
            checklist: [],
            ...draft,
          },
        }),
      updateCard: (cardId, patch) => dispatch({ type: 'card/update', id: cardId, patch }),
      deleteCard: (cardId) => dispatch({ type: 'card/delete', id: cardId }),
      addColumn: () =>
        dispatch({
          type: 'column/add',
          column: {
            id: uid(),
            title: 'New column',
            accent:
              ACCENTS[stateRef.current.data.columnOrder.length % ACCENTS.length] ?? ACCENTS[0]!,
            wip: null,
            collapsed: false,
            done: false,
            art: 'spark',
            cardIds: [],
          },
        }),
      updateColumn: (columnId, patch) => dispatch({ type: 'column/update', id: columnId, patch }),
      deleteColumn: (columnId) => dispatch({ type: 'column/delete', id: columnId }),
      moveCard: (cardId, toColumnId, toIndex) =>
        dispatch({ type: 'card/move', id: cardId, toColumnId, toIndex }),
      moveColumn: (columnId, toIndex) => dispatch({ type: 'column/move', id: columnId, toIndex }),
      undo: () => dispatch({ type: 'undo' }),
      redo: () => dispatch({ type: 'redo' }),
      commitDrag: (base) => dispatch({ type: 'history/commit', base }),
      restore: (restored) => dispatch({ type: 'history/restore', data: restored }),
    }),
    [],
  );

  /* ---------------------------------- UI state ---------------------------------- */

  const [query, setQuery] = React.useState('');
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [composerFor, setComposerFor] = React.useState<string | null>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeType, setActiveType] = React.useState<'card' | 'column' | null>(null);
  const [settledId, setSettledId] = React.useState<string | null>(null);
  const [intro, setIntro] = React.useState(true);
  const [toast, setToast] = React.useState<{ key: number; message: string } | null>(null);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const dragBase = React.useRef<KanbanData | null>(null);

  const parsed = React.useMemo(() => parseQuery(query), [query]);
  const filtering = parsed.active;

  React.useEffect(() => {
    const t = window.setTimeout(() => setIntro(false), INTRO_MS);
    return () => window.clearTimeout(t);
  }, []);

  // New column: bring it into view.
  const columnCount = React.useRef(data.columnOrder.length);
  React.useEffect(() => {
    const el = scrollerRef.current;
    if (el && data.columnOrder.length > columnCount.current) {
      el.scrollTo({ left: el.scrollWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    columnCount.current = data.columnOrder.length;
  }, [data.columnOrder.length, reduceMotion]);

  // Deleting shows an undo toast; any other change dismisses it.
  const toastCount = React.useRef({
    cards: Object.keys(data.cards).length,
    columns: data.columnOrder.length,
  });
  React.useEffect(() => {
    const prev = toastCount.current;
    toastCount.current = {
      cards: Object.keys(data.cards).length,
      columns: data.columnOrder.length,
    };
    if (state.lastOp === 'delete') {
      setToast({
        key: Date.now(),
        message: data.columnOrder.length < prev.columns ? 'Column deleted' : 'Card deleted',
      });
    } else {
      setToast(null);
    }
  }, [data, state.lastOp]);

  const dismissToast = React.useCallback(() => setToast(null), []);

  const openComposer = (columnId: string) => {
    if (stateRef.current.data.columns[columnId]?.collapsed) {
      actions.updateColumn(columnId, { collapsed: false });
    }
    setComposerFor(columnId);
  };

  /* ---------------------------------- hotkeys ---------------------------------- */

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!hotkeys || e.defaultPrevented) return;
    if (!e.currentTarget.contains(e.target as Node)) return; // events bubbling out of portals
    const t = e.target as HTMLElement;
    if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    const mod = e.metaKey || e.ctrlKey;
    const key = e.key.toLowerCase();

    if (mod && key === 'z') {
      e.preventDefault();
      if (e.shiftKey) actions.redo();
      else actions.undo();
    } else if (mod && key === 'y') {
      e.preventDefault();
      actions.redo();
    } else if (!mod && !e.altKey && key === 'n') {
      const first = stateRef.current.data.columnOrder[0];
      if (!first) return;
      e.preventDefault();
      scrollerRef.current?.scrollTo({ left: 0 });
      openComposer(first);
    } else if (!mod && !e.altKey && key === '/') {
      e.preventDefault();
      searchRef.current?.focus();
    }
  };

  /* ------------------------------ drag and drop ------------------------------ */

  const tiltTarget = useMotionValue(0);
  const tilt = useSpring(tiltTarget, { stiffness: 300, damping: 30 });
  const lastDx = React.useRef(0);
  const tiltTimer = React.useRef<number | undefined>(undefined);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor, {
      keyboardCodes: { start: ['Space'], cancel: ['Escape'], end: ['Space'] },
      coordinateGetter: keyboardCoordinates,
    }),
  );

  const titleOf = (itemId: string | number) => {
    const d = stateRef.current.data;
    return d.cards[String(itemId)]?.title ?? d.columns[String(itemId)]?.title ?? 'item';
  };
  const columnNameAt = (overId: string | number, type: unknown, columnId?: string) => {
    const d = stateRef.current.data;
    if (type === 'column') return d.columns[String(overId)]?.title;
    if (type === 'body') return d.columns[columnId ?? '']?.title;
    const col = findColumnId(d, String(overId));
    return col ? d.columns[col]?.title : undefined;
  };

  const announcements: Announcements = {
    onDragStart: ({ active }) =>
      `Picked up ${titleOf(active.id)}. Use the arrow keys to move, space to drop, escape to cancel.`,
    onDragOver: ({ active, over }) => {
      if (!over) return undefined;
      const name = columnNameAt(over.id, over.data.current?.type, over.data.current?.columnId);
      return name ? `${titleOf(active.id)} is over ${name}.` : undefined;
    },
    onDragEnd: ({ active }) => `Dropped ${titleOf(active.id)}.`,
    onDragCancel: ({ active }) => `Cancelled. ${titleOf(active.id)} returned to where it started.`,
  };

  const onDragStart = ({ active }: DragStartEvent) => {
    dragBase.current = stateRef.current.data;
    lastDx.current = 0;
    setActiveId(String(active.id));
    setActiveType(active.data.current?.type === 'column' ? 'column' : 'card');
    setSettledId(null);
  };

  const onDragMove = ({ delta }: DragMoveEvent) => {
    const vx = delta.x - lastDx.current;
    lastDx.current = delta.x;
    tiltTarget.set(clamp(vx * 0.6, -MAX_TILT, MAX_TILT));
    window.clearTimeout(tiltTimer.current);
    tiltTimer.current = window.setTimeout(() => tiltTarget.set(0), 70);
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const d = stateRef.current.data;
    const overType = over.data.current?.type;

    if (active.data.current?.type === 'column') {
      if (overType !== 'column' || over.id === active.id) return;
      actions.moveColumn(String(active.id), d.columnOrder.indexOf(String(over.id)));
      return;
    }

    const cardId = String(active.id);
    const from = findColumnId(d, cardId);
    if (!from) return;

    let toColumn: string;
    let toIndex: number;
    if (overType === 'card') {
      if (over.id === active.id) return;
      toColumn = findColumnId(d, String(over.id)) ?? from;
      const overIndex = d.columns[toColumn]?.cardIds.indexOf(String(over.id)) ?? 0;
      if (toColumn === from) {
        toIndex = overIndex;
      } else {
        const rect = active.rect.current.translated;
        const below = !!rect && rect.top > over.rect.top + over.rect.height / 2;
        toIndex = overIndex + (below ? 1 : 0);
      }
    } else if (overType === 'body') {
      toColumn = over.data.current?.columnId;
      if (!toColumn || toColumn === from) return;
      toIndex = d.columns[toColumn]?.cardIds.length ?? 0;
    } else {
      return;
    }
    actions.moveCard(cardId, toColumn, toIndex);
  };

  const endDrag = (settled: string | null) => {
    window.clearTimeout(tiltTimer.current);
    tiltTarget.set(0);
    setActiveId(null);
    setActiveType(null);
    dragBase.current = null;
    if (settled) {
      setSettledId(settled);
      window.setTimeout(() => setSettledId((cur) => (cur === settled ? null : cur)), 700);
    }
  };

  const onDragEnd = ({ active }: DragEndEvent) => {
    // The whole drag (many live moves) becomes a single undo step.
    if (dragBase.current) actions.commitDrag(dragBase.current);
    endDrag(activeType === 'card' ? String(active.id) : null);
  };

  const onDragCancel = () => {
    if (dragBase.current) actions.restore(dragBase.current);
    endDrag(null);
  };

  /* ---------------------------------- derived ---------------------------------- */

  const visible = React.useMemo(() => {
    const map: Record<string, KanbanCard[]> = {};
    for (const columnId of data.columnOrder) {
      map[columnId] = (data.columns[columnId]?.cardIds ?? [])
        .map((cardId) => data.cards[cardId])
        .filter((c): c is KanbanCard => !!c && matchesQuery(c, parsed, labels, members));
    }
    return map;
  }, [data, parsed, labels, members]);

  const stats = React.useMemo(() => {
    let total = 0;
    let done = 0;
    let matches = 0;
    for (const columnId of data.columnOrder) {
      const col = data.columns[columnId];
      if (!col) continue;
      total += col.cardIds.length;
      if (col.done) done += col.cardIds.length;
      matches += visible[columnId]?.length ?? 0;
    }
    return { total, done, matches };
  }, [data, visible]);

  const activeCard = activeType === 'card' && activeId ? data.cards[activeId] : undefined;
  const activeColumnId = activeCard && activeId ? findColumnId(data, activeId) : null;
  const activeColumn = activeType === 'column' && activeId ? data.columns[activeId] : undefined;
  const fresh = state.lastOp !== 'move';
  const deleting = state.lastOp === 'delete';

  const context = React.useMemo<KanbanContextValue>(
    () => ({ labels, members, actions, openCard: setOpenId }),
    [labels, members, actions],
  );

  return (
    <KanbanContext.Provider value={context}>
      <div
        ref={rootRef}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className={cn(
          'relative flex h-[640px] min-h-0 flex-col overflow-hidden rounded-xl border bg-background text-foreground outline-none',
          className,
        )}
      >
        <Toolbar
          query={query}
          onQuery={setQuery}
          inputRef={searchRef}
          matches={stats.matches}
          total={stats.total}
          done={stats.done}
          canUndo={state.past.length > 0}
          canRedo={state.future.length > 0}
          onUndo={actions.undo}
          onRedo={actions.redo}
          onNewCard={() => data.columnOrder[0] && openComposer(data.columnOrder[0])}
          hotkeys={hotkeys}
        />

        <DndContext
          id={id}
          sensors={sensors}
          collisionDetection={collision}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
          accessibility={{
            announcements,
            screenReaderInstructions: {
              draggable:
                'To pick up a card or column, press space. Use the arrow keys to move it, space to drop it, or escape to cancel.',
            },
          }}
        >
          <LayoutGroup id={id}>
            <m.div
              ref={scrollerRef}
              layoutScroll
              role="region"
              aria-label="Kanban board"
              data-dragging={activeId ? '' : undefined}
              className="flex min-h-0 flex-1 snap-x snap-mandatory items-start gap-3 overflow-x-auto overflow-y-hidden p-3 data-[dragging]:snap-none md:snap-none"
            >
              <SortableContext items={data.columnOrder} strategy={noStrategy}>
                {data.columnOrder.map((columnId, i) => {
                  const column = data.columns[columnId];
                  if (!column) return null;
                  return (
                    <Column
                      key={columnId}
                      column={column}
                      index={i}
                      cards={visible[columnId] ?? []}
                      filtering={filtering}
                      intro={intro}
                      fresh={fresh}
                      deleting={deleting}
                      isTarget={activeColumnId === columnId}
                      canDelete={data.columnOrder.length > 1}
                      composerOpen={composerFor === columnId}
                      settledId={settledId}
                      onOpenComposer={() => openComposer(columnId)}
                      onCloseComposer={() =>
                        setComposerFor((cur) => (cur === columnId ? null : cur))
                      }
                    />
                  );
                })}
              </SortableContext>

              <m.div layout="position" transition={{ layout: LAYOUT }} className="shrink-0">
                <Button
                  variant="outline"
                  className="h-10 w-44 justify-center border-dashed text-muted-foreground"
                  onClick={actions.addColumn}
                >
                  <PlusIcon /> New column
                </Button>
              </m.div>
            </m.div>
          </LayoutGroup>

          <DragOverlay zIndex={60} dropAnimation={reduceMotion ? null : DROP_ANIMATION}>
            {activeCard && activeColumnId && (
              <DraggedCard
                card={activeCard}
                done={data.columns[activeColumnId]?.done ?? false}
                tilt={tilt}
              />
            )}
            {activeColumn && (
              <m.div
                className="flex w-full items-center gap-2 rounded-xl border bg-card px-3 py-2.5 shadow-xl"
                initial={{ scale: 1 }}
                animate={{ scale: 1.03 }}
                transition={ENTER}
              >
                <span className="size-2 rounded-full" style={{ background: activeColumn.accent }} />
                <span className="text-sm font-semibold">{activeColumn.title}</span>
                <span className="ml-auto rounded-md bg-muted px-1.5 text-xs leading-5 text-muted-foreground tabular-nums">
                  {activeColumn.cardIds.length}
                </span>
              </m.div>
            )}
          </DragOverlay>
        </DndContext>

        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <AnimatePresence>
            {toast && (
              <m.div
                key={toast.key}
                role="status"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, transition: EXIT }}
                transition={ENTER}
                className="pointer-events-auto flex items-center gap-3 rounded-lg border bg-popover py-1.5 pr-1.5 pl-3 text-sm text-popover-foreground shadow-lg"
              >
                <Toast message={toast.message} onExpire={dismissToast} />
                <Button size="xs" variant="secondary" onClick={actions.undo}>
                  Undo
                </Button>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <CardSheet
          card={openId ? (data.cards[openId] ?? null) : null}
          onClose={() => setOpenId(null)}
        />
      </div>
    </KanbanContext.Provider>
  );
}

function Toast({ message, onExpire }: { message: string; onExpire: () => void }) {
  React.useEffect(() => {
    const t = window.setTimeout(onExpire, 5000);
    return () => window.clearTimeout(t);
  }, [onExpire]);
  return <span>{message}</span>;
}
