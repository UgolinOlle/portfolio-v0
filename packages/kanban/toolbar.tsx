'use client';

import { PlusIcon, Redo2Icon, SearchIcon, Undo2Icon, XIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';

interface ToolbarProps {
  query: string;
  onQuery: (query: string) => void;
  inputRef: React.Ref<HTMLInputElement>;
  matches: number;
  total: number;
  done: number;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onNewCard: () => void;
  hotkeys: boolean;
}

export function Toolbar({
  query,
  onQuery,
  inputRef,
  matches,
  total,
  done,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onNewCard,
  hotkeys,
}: ToolbarProps) {
  const filtering = query.trim().length > 0;
  const ratio = total ? done / total : 0;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2.5">
      <div className="relative min-w-44 flex-1 sm:max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          placeholder="Filter cards: #label !priority @name"
          aria-label="Filter cards"
          spellCheck={false}
          autoComplete="off"
          className="pr-16 pl-8"
          onChange={(e) => onQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Escape') return;
            if (query) onQuery('');
            else e.currentTarget.blur();
          }}
        />
        <div className="absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center gap-1">
          {filtering ? (
            <>
              <span className="text-xs text-muted-foreground tabular-nums">
                {matches}/{total}
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="Clear filter"
                onClick={() => onQuery('')}
              >
                <XIcon />
              </Button>
            </>
          ) : (
            hotkeys && <Kbd className="max-sm:hidden">/</Kbd>
          )}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div
          className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums"
          title={`${done} of ${total} cards done`}
        >
          <div className="h-1 w-16 overflow-hidden rounded-full bg-foreground/10 max-sm:hidden">
            <div
              className="h-full origin-left rounded-full bg-foreground/70 transition-transform duration-(--duration-slower) ease-out-strong"
              style={{ transform: `scaleX(${ratio})` }}
            />
          </div>
          {done}/{total} done
        </div>

        <div className="flex">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Undo"
            disabled={!canUndo}
            onClick={onUndo}
          >
            <Undo2Icon />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Redo"
            disabled={!canRedo}
            onClick={onRedo}
          >
            <Redo2Icon />
          </Button>
        </div>

        <Button size="sm" onClick={onNewCard}>
          <PlusIcon /> New card
          {hotkeys && <Kbd className="ml-1 max-sm:hidden">N</Kbd>}
        </Button>
      </div>
    </div>
  );
}
