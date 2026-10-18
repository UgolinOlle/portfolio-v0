'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CalendarIcon, ListChecksIcon, Trash2Icon } from 'lucide-react';
import { m, useAnimationControls, type MotionValue, type Variants } from 'motion/react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useKanban } from './context';
import { PRIORITIES } from './data';
import { ENTER, EXIT, LAYOUT, LIFT_SCALE } from './motion';
import type { KanbanCard, KanbanLabel, KanbanMember } from './types';
import { dueInfo } from './utils';

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

export function Tag({ label }: { label: KanbanLabel }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md bg-[color-mix(in_oklab,var(--kb-tone)_14%,transparent)] px-1.5 py-0.5 text-[11px] leading-4 font-medium text-[color-mix(in_oklab,var(--kb-tone)_55%,var(--foreground))]"
      style={{ '--kb-tone': label.color } as React.CSSProperties}
    >
      <i className="size-1.5 rounded-full bg-[var(--kb-tone)]" />
      {label.name}
    </span>
  );
}

export function MemberAvatar({ member, size = 24 }: { member: KanbanMember; size?: number }) {
  return (
    <span
      role="img"
      aria-label={member.name}
      title={member.name}
      className="inline-grid shrink-0 place-items-center rounded-full font-medium text-white ring-2 ring-card"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: member.color,
      }}
    >
      {member.name.charAt(0)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Presentation                                                        */
/* ------------------------------------------------------------------ */

interface FaceProps {
  card: KanbanCard;
  done?: boolean;
  ghost?: boolean;
  onDelete?: () => void;
}

export function CardFace({ card, done, ghost, onDelete }: FaceProps) {
  const { labels, members } = useKanban();
  const label = labels.find((l) => l.id === card.labelId);
  const member = members.find((m) => m.id === card.assigneeId);
  const priority = PRIORITIES[card.priority];
  const due = card.due ? dueInfo(card.due) : null;
  const tone = done && due ? 'later' : due?.tone;
  const doneCount = card.checklist.filter((t) => t.done).length;

  return (
    <article
      data-ghost={ghost || undefined}
      className="group/card relative rounded-lg border bg-card p-3 text-card-foreground shadow-xs data-[ghost]:border-dashed data-[ghost]:bg-muted/60 data-[ghost]:shadow-none data-[ghost]:*:invisible"
    >
      <div className="flex items-center gap-2">
        <span
          role="img"
          aria-label={`${priority.name} priority`}
          title={`${priority.name} priority`}
          className="size-2 shrink-0 rounded-full"
          style={{ background: priority.color }}
        />
        {label && <Tag label={label} />}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Delete ${card.title}`}
            className="-mr-1 ml-auto text-muted-foreground opacity-0 group-focus-within/card:opacity-100 group-hover/card:opacity-100 pointer-coarse:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2Icon />
          </Button>
        )}
      </div>

      <h3 className="mt-2 text-sm leading-snug font-medium tracking-[-0.005em] text-balance">
        {card.title}
      </h3>
      {card.description && (
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {card.description}
        </p>
      )}

      {(due || card.checklist.length > 0 || member) && (
        <footer className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          {due && (
            <span
              suppressHydrationWarning
              data-tone={tone}
              className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 tabular-nums data-[tone=overdue]:bg-destructive/10 data-[tone=overdue]:text-destructive data-[tone=soon]:bg-amber-500/10 data-[tone=soon]:text-amber-700 dark:data-[tone=soon]:text-amber-400"
            >
              <CalendarIcon className="size-3" />
              <span suppressHydrationWarning>{due.label}</span>
            </span>
          )}
          {card.checklist.length > 0 && (
            <span className="inline-flex items-center gap-1 tabular-nums">
              <ListChecksIcon className="size-3.5" />
              {doneCount}/{card.checklist.length}
            </span>
          )}
          {member && (
            <span className="ml-auto">
              <MemberAvatar member={member} />
            </span>
          )}
        </footer>
      )}
    </article>
  );
}

/** The lifted copy that follows the pointer inside `<DragOverlay>`. */
export function DraggedCard({
  card,
  done,
  tilt,
}: {
  card: KanbanCard;
  done: boolean;
  tilt: MotionValue<number>;
}) {
  return (
    <m.div
      className="h-full w-full cursor-grabbing rounded-lg shadow-xl ring-1 ring-foreground/10 *:shadow-none"
      style={{ rotate: tilt }}
      initial={{ scale: 1 }}
      animate={{ scale: LIFT_SCALE }}
      transition={ENTER}
    >
      <CardFace card={card} done={done} />
    </m.div>
  );
}

/* ------------------------------------------------------------------ */
/* Sortable wrapper                                                    */
/* ------------------------------------------------------------------ */

const variants: Variants = {
  exit: (deleting: boolean) =>
    deleting
      ? { opacity: 0, scale: 0.95, transition: EXIT }
      : // Moved to another column: the shared layout hands the card over, nothing to play here.
        { opacity: 0, transition: { duration: 0 } },
};

interface SortableCardProps {
  /** React 19: `ref` is a plain prop. `AnimatePresence mode="popLayout"` injects one. */
  ref?: React.Ref<HTMLDivElement>;
  card: KanbanCard;
  columnTitle: string;
  done: boolean;
  /** Delay for the first-paint stagger; `undefined` afterwards. */
  introDelay?: number;
  /** Animate in (false when the card was just moved between columns). */
  fresh: boolean;
  /** Play the quiet settle after a drop. */
  settle: boolean;
  /** Dragging is disabled (a filter is active). */
  locked: boolean;
}

export const SortableCard = React.memo(function SortableCard({
  ref,
  card,
  columnTitle,
  done,
  introDelay,
  fresh,
  settle,
  locked,
}: SortableCardProps) {
  const { actions, openCard, labels, members } = useKanban();
  const settleControls = useAnimationControls();

  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: card.id,
    data: { type: 'card' },
    disabled: locked,
  });

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node);
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref, setNodeRef],
  );

  React.useEffect(() => {
    if (!settle) return;
    // Starts once the overlay's drop animation (200ms) has landed.
    settleControls.start(
      { scale: [LIFT_SCALE - 0.01, 1] },
      { type: 'spring', duration: 0.25, bounce: 0, delay: 0.18 },
    );
  }, [settle, settleControls]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    listeners?.onKeyDown?.(e);
    if (e.target !== e.currentTarget || isDragging) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      openCard(card.id);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      actions.deleteCard(card.id);
    }
  };

  const labelName = labels.find((l) => l.id === card.labelId)?.name;
  const assignee = members.find((m) => m.id === card.assigneeId)?.name;
  const ariaLabel = [
    card.title,
    `in ${columnTitle}`,
    labelName,
    `${PRIORITIES[card.priority].name} priority`,
    card.due && `due ${dueInfo(card.due).label}`,
    assignee && `assigned to ${assignee}`,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <m.div
      {...attributes}
      {...listeners}
      ref={setRefs}
      role="group"
      aria-label={ariaLabel}
      aria-roledescription="draggable card"
      onKeyDown={onKeyDown}
      onClick={() => !isDragging && openCard(card.id)}
      layout="position"
      layoutId={card.id}
      variants={variants}
      initial={fresh ? { opacity: 0, scale: 0.96 } : false}
      animate={{ opacity: 1, scale: 1 }}
      exit="exit"
      transition={{ layout: LAYOUT, default: { ...ENTER, delay: introDelay ?? 0 } }}
      className={cn(
        'touch-manipulation rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
        !locked && 'cursor-grab',
        'can-hover:hover:[&_article]:shadow-sm',
      )}
    >
      <m.div animate={settleControls} initial={false}>
        <CardFace
          card={card}
          done={done}
          ghost={isDragging}
          onDelete={() => actions.deleteCard(card.id)}
        />
      </m.div>
    </m.div>
  );
});
