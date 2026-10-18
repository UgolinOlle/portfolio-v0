'use client';

import { PlusIcon, Trash2Icon, XIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { MemberAvatar } from './card';
import { useKanban } from './context';
import { PRIORITIES, PRIORITY_IDS } from './data';
import type { KanbanCard } from './types';
import { uid } from './utils';

interface CardSheetProps {
  card: KanbanCard | null;
  onClose: () => void;
}

/**
 * Detail drawer. Edits live in a local draft and are saved as ONE undo step when the drawer
 * closes, so typing a title doesn't flood the history.
 */
export function CardSheet({ card, onClose }: CardSheetProps) {
  const { actions } = useKanban();
  const draftRef = React.useRef<KanbanCard | null>(null);

  // Keep the last card mounted while the drawer animates out.
  const [shown, setShown] = React.useState(card);
  React.useEffect(() => {
    if (card) setShown(card);
  }, [card]);

  const close = () => {
    const draft = draftRef.current;
    if (draft && shown && draft.id === shown.id) {
      const { id: _id, ...patch } = draft;
      if (JSON.stringify(patch) !== JSON.stringify({ ...shown, id: undefined })) {
        actions.updateCard(draft.id, patch);
      }
    }
    draftRef.current = null;
    onClose();
  };

  return (
    <Sheet open={card !== null} onOpenChange={(open) => !open && close()}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        {shown && (
          <CardSheetBody
            key={shown.id}
            card={shown}
            onDraft={(d) => (draftRef.current = d)}
            onDelete={() => {
              draftRef.current = null;
              actions.deleteCard(shown.id);
              onClose();
            }}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function CardSheetBody({
  card,
  onDraft,
  onDelete,
}: {
  card: KanbanCard;
  onDraft: (card: KanbanCard) => void;
  onDelete: () => void;
}) {
  const { labels, members } = useKanban();
  const [draft, setDraft] = React.useState(card);
  const [newItem, setNewItem] = React.useState('');

  const set = <K extends keyof KanbanCard>(key: K, value: KanbanCard[K]) =>
    setDraft((d) => {
      const next = { ...d, [key]: value };
      onDraft(next);
      return next;
    });

  const addItem = () => {
    const text = newItem.trim();
    if (!text) return;
    set('checklist', [...draft.checklist, { id: uid(), text, done: false }]);
    setNewItem('');
  };

  const doneCount = draft.checklist.filter((t) => t.done).length;

  return (
    <>
      <SheetHeader className="pr-12">
        <SheetTitle className="sr-only">Edit card</SheetTitle>
        <SheetDescription className="sr-only">
          Change the title, details, label, priority, due date, assignee and checklist.
        </SheetDescription>
        <Input
          value={draft.title}
          maxLength={90}
          aria-label="Title"
          onChange={(e) => set('title', e.target.value)}
          className="h-9 border-transparent bg-transparent px-1 text-base font-medium shadow-none focus-visible:border-ring"
        />
      </SheetHeader>

      <div className="flex flex-col gap-5 px-4 pb-4">
        <Field label="Description">
          <Textarea
            value={draft.description}
            rows={3}
            maxLength={240}
            placeholder="Add context for whoever picks this up"
            onChange={(e) => set('description', e.target.value)}
          />
        </Field>

        <Field label="Label">
          <div role="radiogroup" aria-label="Label" className="flex flex-wrap gap-1.5">
            {labels.map((l) => (
              <button
                key={l.id}
                type="button"
                role="radio"
                aria-checked={draft.labelId === l.id}
                onClick={() => set('labelId', draft.labelId === l.id ? null : l.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                  draft.labelId === l.id ? 'border-foreground/60 bg-muted' : 'hover:bg-muted/60',
                )}
              >
                <i className="size-2 rounded-full" style={{ background: l.color }} />
                {l.name}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Priority">
            <div role="radiogroup" aria-label="Priority" className="flex rounded-lg bg-muted p-0.5">
              {PRIORITY_IDS.map((p) => (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  aria-checked={draft.priority === p}
                  onClick={() => set('priority', p)}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-1.5 rounded-md py-1 text-xs outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                    draft.priority === p
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground',
                  )}
                >
                  <i
                    className="size-1.5 rounded-full"
                    style={{ background: PRIORITIES[p].color }}
                  />
                  {PRIORITIES[p].name}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Due date">
            <Input
              type="date"
              value={draft.due ?? ''}
              onChange={(e) => set('due', e.target.value || null)}
            />
          </Field>
        </div>

        <Field label="Assignee">
          <div role="radiogroup" aria-label="Assignee" className="flex flex-wrap gap-1.5">
            <button
              type="button"
              role="radio"
              aria-checked={draft.assigneeId === null}
              onClick={() => set('assigneeId', null)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                draft.assigneeId === null ? 'border-foreground/60 bg-muted' : 'hover:bg-muted/60',
              )}
            >
              Unassigned
            </button>
            {members.map((mem) => (
              <button
                key={mem.id}
                type="button"
                role="radio"
                aria-checked={draft.assigneeId === mem.id}
                onClick={() => set('assigneeId', mem.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border py-0.5 pr-2.5 pl-0.5 text-xs outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                  draft.assigneeId === mem.id
                    ? 'border-foreground/60 bg-muted'
                    : 'hover:bg-muted/60',
                )}
              >
                <MemberAvatar member={mem} size={20} />
                {mem.name}
              </button>
            ))}
          </div>
        </Field>

        <Field
          label={
            draft.checklist.length
              ? `Checklist · ${doneCount}/${draft.checklist.length}`
              : 'Checklist'
          }
        >
          <ul className="flex flex-col gap-0.5">
            {draft.checklist.map((item) => (
              <li
                key={item.id}
                className="group/item flex items-center gap-2 rounded-md px-1 py-0.5 hover:bg-muted/60"
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  aria-label={item.text}
                  onChange={(e) =>
                    set(
                      'checklist',
                      draft.checklist.map((t) =>
                        t.id === item.id ? { ...t, done: e.target.checked } : t,
                      ),
                    )
                  }
                  className="size-4 shrink-0 accent-foreground"
                />
                <span
                  className={cn(
                    'flex-1 text-sm',
                    item.done && 'text-muted-foreground line-through',
                  )}
                >
                  {item.text}
                </span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Remove ${item.text}`}
                  className="text-muted-foreground opacity-0 group-focus-within/item:opacity-100 group-hover/item:opacity-100 pointer-coarse:opacity-100"
                  onClick={() =>
                    set(
                      'checklist',
                      draft.checklist.filter((t) => t.id !== item.id),
                    )
                  }
                >
                  <XIcon />
                </Button>
              </li>
            ))}
          </ul>
          <div className="mt-1 flex gap-1.5">
            <Input
              value={newItem}
              placeholder="Add an item"
              aria-label="New checklist item"
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addItem();
                }
              }}
            />
            <Button variant="outline" size="icon" aria-label="Add checklist item" onClick={addItem}>
              <PlusIcon />
            </Button>
          </div>
        </Field>

        <Button variant="destructive" className="self-start" onClick={onDelete}>
          <Trash2Icon /> Delete card
        </Button>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
