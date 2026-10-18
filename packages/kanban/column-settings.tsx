'use client';

import { CheckIcon, EllipsisIcon, MinusIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { useKanban } from './context';
import { ACCENTS } from './data';
import type { KanbanColumn } from './types';

export function ColumnSettings({
  column,
  canDelete,
}: {
  column: KanbanColumn;
  canDelete: boolean;
}) {
  const { actions } = useKanban();
  const [title, setTitle] = React.useState(column.title);

  const commitTitle = () => {
    const next = title.trim() || column.title;
    setTitle(next);
    if (next !== column.title) actions.updateColumn(column.id, { title: next });
  };
  const setWip = (wip: number | null) => actions.updateColumn(column.id, { wip });

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`${column.title} settings`}
            className="text-muted-foreground"
          />
        }
      >
        <EllipsisIcon />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 space-y-3 p-3">
        <label className="block space-y-1.5 text-xs font-medium text-muted-foreground">
          Name
          <Input
            value={title}
            maxLength={28}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => e.key === 'Enter' && commitTitle()}
          />
        </label>

        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground">WIP limit</span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-xs"
              aria-label="Decrease WIP limit"
              onClick={() => setWip(column.wip && column.wip > 1 ? column.wip - 1 : null)}
            >
              <MinusIcon />
            </Button>
            <span className="w-9 text-center text-sm tabular-nums">{column.wip ?? 'Off'}</span>
            <Button
              variant="outline"
              size="icon-xs"
              aria-label="Increase WIP limit"
              onClick={() => setWip((column.wip ?? 0) + 1)}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Accent</span>
          <div role="radiogroup" aria-label="Accent colour" className="flex flex-wrap gap-1.5">
            {ACCENTS.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={column.accent === c}
                aria-label={c}
                onClick={() => actions.updateColumn(column.id, { accent: c })}
                className={cn(
                  'grid size-6 place-items-center rounded-full text-white outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                  column.accent === c && 'ring-2 ring-foreground ring-offset-2 ring-offset-popover',
                )}
                style={{ background: c }}
              >
                {column.accent === c && <CheckIcon className="size-3.5" />}
              </button>
            ))}
          </div>
        </div>

        {canDelete && (
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => {
              const n = column.cardIds.length;
              if (
                n === 0 ||
                window.confirm(`Delete “${column.title}” and its ${n} card${n > 1 ? 's' : ''}?`)
              ) {
                actions.deleteColumn(column.id);
              }
            }}
          >
            <Trash2Icon /> Delete column
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
