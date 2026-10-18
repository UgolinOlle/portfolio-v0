'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { ChevronDownIcon, ChevronRightIcon, GripVerticalIcon, PlusIcon } from 'lucide-react';
import { AnimatePresence, m, useAnimationControls } from 'motion/react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { SortableCard } from './card';
import { ColumnSettings } from './column-settings';
import { useKanban } from './context';
import { EmptyArt } from './empty-art';
import { ENTER, EXIT, LAYOUT, SHAKE, STAGGER } from './motion';
import type { KanbanCard, KanbanColumn } from './types';

const noStrategy = () => null;

interface ColumnProps {
  column: KanbanColumn;
  index: number;
  /** Cards that pass the current filter, in column order. */
  cards: KanbanCard[];
  filtering: boolean;
  intro: boolean;
  /** The last change was not a move: new cards animate in. */
  fresh: boolean;
  /** The last change was a delete: exiting cards shrink away. */
  deleting: boolean;
  /** A dragged card currently lives here. */
  isTarget: boolean;
  canDelete: boolean;
  composerOpen: boolean;
  settledId: string | null;
  onOpenComposer: () => void;
  onCloseComposer: () => void;
}

export function Column({
  column,
  index,
  cards,
  filtering,
  intro,
  fresh,
  deleting,
  isTarget,
  canDelete,
  composerOpen,
  settledId,
  onOpenComposer,
  onCloseComposer,
}: ColumnProps) {
  const { actions } = useKanban();
  const count = column.cardIds.length;
  const over = column.wip !== null && count > column.wip;

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, isDragging } = useSortable({
    id: column.id,
    data: { type: 'column' },
  });
  const { setNodeRef: setBodyRef } = useDroppable({
    id: `body:${column.id}`,
    data: { type: 'body', columnId: column.id },
    disabled: column.collapsed,
  });

  // WIP breach: one shake as the limit is crossed. The ring is a one-shot flash that settles.
  const shake = useAnimationControls();
  const wasOver = React.useRef(over);
  React.useEffect(() => {
    if (over && !wasOver.current) void shake.start(SHAKE);
    wasOver.current = over;
  }, [over, shake]);

  const grip = (
    <Button
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon-xs"
      aria-label={`Reorder column ${column.title}`}
      aria-roledescription="draggable column"
      className="cursor-grab touch-none text-muted-foreground"
    >
      <GripVerticalIcon />
    </Button>
  );

  const toggleCollapse = () => actions.updateColumn(column.id, { collapsed: !column.collapsed });

  return (
    <m.section
      ref={setNodeRef}
      layout="position"
      aria-labelledby={`kb-col-${column.id}`}
      initial={false}
      animate={{ opacity: isDragging ? 0.4 : 1 }}
      transition={{ layout: LAYOUT, opacity: { duration: 0.12 } }}
      className={cn(
        'flex max-h-full shrink-0 snap-start flex-col',
        column.collapsed ? 'w-12' : 'w-[min(18rem,85vw)]',
      )}
      style={{ '--kb-accent': column.accent } as React.CSSProperties}
    >
      <m.div
        animate={shake}
        data-target={isTarget || undefined}
        className="relative flex min-h-0 flex-1 flex-col rounded-xl border bg-muted/40 transition-[border-color,box-shadow] duration-(--duration-base) ease-out-strong data-[target]:border-[var(--kb-accent)] data-[target]:ring-3 data-[target]:ring-[color-mix(in_oklab,var(--kb-accent)_20%,transparent)]"
      >
        <m.div
          aria-hidden
          initial={false}
          animate={{ opacity: over ? [0, 0.9, 0.4] : 0 }}
          transition={{ duration: over ? 0.5 : 0.2 }}
          className="pointer-events-none absolute -inset-px rounded-xl ring-2 ring-destructive"
        />

        {column.collapsed ? (
          <div className="flex min-h-72 flex-1 flex-col items-center gap-2 py-2">
            {grip}
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={`Expand ${column.title}`}
              aria-expanded={false}
              onClick={toggleCollapse}
              className="text-muted-foreground"
            >
              <ChevronRightIcon />
            </Button>
            <span
              className={cn(
                'rounded-md bg-muted px-1.5 text-xs tabular-nums',
                over && 'bg-destructive text-white',
              )}
            >
              {count}
            </span>
            <h2
              id={`kb-col-${column.id}`}
              className="mt-1 text-sm font-semibold [writing-mode:vertical-rl]"
            >
              {column.title}
            </h2>
          </div>
        ) : (
          <>
            <header className="px-2 pt-2 pb-1.5">
              <div className="flex items-center gap-1">
                {grip}
                <span
                  aria-hidden
                  className="mx-0.5 size-2 shrink-0 rounded-full bg-[var(--kb-accent)]"
                />
                <h2
                  id={`kb-col-${column.id}`}
                  className="min-w-0 flex-1 truncate text-sm font-semibold tracking-[-0.005em]"
                >
                  {column.title}
                </h2>
                <span
                  className={cn(
                    'rounded-md bg-muted px-1.5 text-xs leading-5 text-muted-foreground tabular-nums',
                    over && 'bg-destructive text-white',
                  )}
                >
                  {count}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Add card to ${column.title}`}
                  onClick={onOpenComposer}
                  className="text-muted-foreground"
                >
                  <PlusIcon />
                </Button>
                <ColumnSettings column={column} canDelete={canDelete} />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Collapse ${column.title}`}
                  aria-expanded
                  onClick={toggleCollapse}
                  className="text-muted-foreground"
                >
                  <ChevronDownIcon />
                </Button>
              </div>

              {column.wip !== null && <WipMeter count={count} wip={column.wip} over={over} />}
            </header>

            <m.div
              ref={setBodyRef}
              layoutScroll
              role="group"
              aria-label={`${column.title} cards`}
              className="relative flex min-h-28 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain px-2 pb-2"
            >
              <SortableContext items={cards.map((c) => c.id)} strategy={noStrategy}>
                <AnimatePresence mode="popLayout" custom={deleting}>
                  {cards.map((card, i) => (
                    <SortableCard
                      key={card.id}
                      card={card}
                      columnTitle={column.title}
                      done={column.done}
                      introDelay={
                        intro ? 0.08 + index * 0.06 + Math.min(i, 8) * STAGGER : undefined
                      }
                      fresh={fresh}
                      settle={settledId === card.id}
                      locked={filtering}
                    />
                  ))}
                </AnimatePresence>
              </SortableContext>

              <AnimatePresence>
                {cards.length === 0 && !composerOpen && (
                  <m.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: EXIT }}
                    transition={ENTER}
                    className="grid place-items-center gap-1 px-2 py-5 text-center"
                  >
                    {filtering ? (
                      <p className="text-xs text-muted-foreground">No cards match this filter.</p>
                    ) : (
                      <>
                        <EmptyArt art={column.art} />
                        <p className="mt-1 text-sm font-medium">No cards yet</p>
                        <p className="text-xs text-muted-foreground">
                          Drop a card here or add a new one.
                        </p>
                      </>
                    )}
                  </m.div>
                )}
              </AnimatePresence>

              {composerOpen && (
                <Composer
                  columnTitle={column.title}
                  onSubmit={(title) => actions.addCard(column.id, { title })}
                  onClose={onCloseComposer}
                />
              )}
            </m.div>

            {!composerOpen && (
              <div className="px-2 pb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-muted-foreground"
                  onClick={onOpenComposer}
                >
                  <PlusIcon /> Add card
                </Button>
              </div>
            )}
          </>
        )}
      </m.div>
    </m.section>
  );
}

function WipMeter({ count, wip, over }: { count: number; wip: number; over: boolean }) {
  return (
    <div
      className="mt-2 flex items-center gap-2 px-1"
      role="meter"
      aria-label="Work in progress limit"
      aria-valuemin={0}
      aria-valuemax={wip}
      aria-valuenow={count}
      aria-valuetext={over ? `Over the limit: ${count} of ${wip}` : `${count} of ${wip}`}
    >
      <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-foreground/10">
        <m.div
          className="absolute inset-0 origin-left rounded-full bg-[var(--kb-accent)]"
          initial={false}
          animate={{ scaleX: Math.min(count / wip, 1) }}
          transition={LAYOUT}
        />
        {/* Crossfaded instead of animating the colour. */}
        <m.div
          className="absolute inset-0 origin-left rounded-full bg-destructive"
          initial={false}
          animate={{ scaleX: Math.min(count / wip, 1), opacity: over ? 1 : 0 }}
          transition={{ scaleX: LAYOUT, opacity: { duration: 0.18 } }}
        />
      </div>
      <span
        className={cn(
          'text-[11px] whitespace-nowrap text-muted-foreground tabular-nums',
          over && 'font-medium text-destructive',
        )}
      >
        {over ? `${count}/${wip} · over limit` : `${count}/${wip}`}
      </span>
    </div>
  );
}

/** Inline quick-add: Enter adds and stays open for the next one, Escape closes. */
function Composer({
  columnTitle,
  onSubmit,
  onClose,
}: {
  columnTitle: string;
  onSubmit: (title: string) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = React.useState('');
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    ref.current?.scrollIntoView({ block: 'nearest' });
  }, []);

  const submit = () => {
    const value = title.trim();
    if (!value) return onClose();
    onSubmit(value);
    setTitle('');
  };

  return (
    <div ref={ref} className="rounded-lg border bg-card p-2 shadow-xs">
      <Input
        autoFocus
        value={title}
        maxLength={90}
        placeholder="Card title"
        aria-label={`New card in ${columnTitle}`}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
          if (e.key === 'Escape') {
            e.stopPropagation();
            onClose();
          }
        }}
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">Enter to add, Esc to close</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="xs" onClick={onClose}>
            Done
          </Button>
          <Button size="xs" onClick={submit} disabled={!title.trim()}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
