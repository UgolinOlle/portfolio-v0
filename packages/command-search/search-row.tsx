'use client';

import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import type { SearchItem } from './types';
import { splitMatches, TONE_SOFT, TONE_SOLID } from './utils';

// Strong ease-out: entrances and exits.
export const EASE = [0.23, 1, 0.32, 1] as const;

function Highlight({ text, query }: { text: string; query: string }) {
  return splitMatches(text, query).map((part, index) =>
    part.match ? (
      <mark
        key={index}
        className="rounded-[3px] bg-blue-500/15 [box-decoration-break:clone] text-foreground"
      >
        {part.text}
      </mark>
    ) : (
      <React.Fragment key={index}>{part.text}</React.Fragment>
    ),
  );
}

export interface SearchRowProps {
  item: SearchItem;
  query: string;
  optionId: string;
  active: boolean;
  /** Entrance delay in seconds, only used for the first paint. */
  delay: number;
  onActivate: () => void;
  onSelect: () => void;
}

const motionProps = (delay: number) => ({
  layout: 'position' as const,
  initial: { opacity: 0, transform: 'translateY(6px)', filter: 'blur(4px)' },
  animate: { opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' },
  exit: { opacity: 0, transition: { duration: 0.12 } },
  transition: { duration: 0.28, ease: EASE, delay },
});

/** A chat, document or knowledge result: coloured tile, title and one-line description. */
export function SearchRow({
  item,
  query,
  optionId,
  active,
  delay,
  onActivate,
  onSelect,
}: SearchRowProps) {
  const Icon = item.icon;

  return (
    <motion.div
      {...motionProps(delay)}
      id={optionId}
      role="option"
      aria-selected={active}
      data-active={active}
      onPointerMove={onActivate}
      onClick={onSelect}
      className={cn(
        'group relative flex cursor-pointer items-start gap-2.5 rounded-xl px-2 py-1.5 select-none',
        'transition-[background-color,scale] duration-150 ease-out active:scale-[0.99]',
        'data-[active=true]:bg-muted',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'mt-0.5 grid size-5 shrink-0 place-items-center rounded-md shadow-[inset_0_0_0_1px_rgb(0_0_0/0.06)]',
          TONE_SOLID[item.tone ?? 'blue'],
        )}
      >
        <Icon className="size-3" strokeWidth={2.25} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm leading-5 font-medium">
          <Highlight text={item.title} query={query} />
        </p>
        {item.description && (
          <p className="truncate text-sm leading-5 text-muted-foreground">
            <Highlight text={item.description} query={query} />
          </p>
        )}
      </div>

      <ArrowUpRight
        aria-hidden
        className={cn(
          'mt-1 size-3.5 shrink-0 text-muted-foreground',
          'transition-[opacity,translate] duration-150 ease-out',
          active ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0',
        )}
      />
    </motion.div>
  );
}

/** A suggested agent: soft icon tile and a two-line name, laid out in a grid. */
export function SearchAgentCard({
  item,
  query,
  optionId,
  active,
  delay,
  onActivate,
  onSelect,
}: SearchRowProps) {
  const Icon = item.icon;

  return (
    <motion.div
      {...motionProps(delay)}
      id={optionId}
      role="option"
      aria-selected={active}
      data-active={active}
      onPointerMove={onActivate}
      onClick={onSelect}
      className={cn(
        'group relative flex cursor-pointer items-center gap-2.5 rounded-xl bg-muted/60 p-2 select-none',
        'transition-[background-color,box-shadow,scale] duration-150 ease-out active:scale-[0.98]',
        'data-[active=true]:bg-muted data-[active=true]:shadow-[0_0_0_1px_var(--color-border)]',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'grid size-8 shrink-0 place-items-center rounded-lg transition-transform duration-200 ease-out group-data-[active=true]:scale-105',
          TONE_SOFT[item.tone ?? 'blue'],
        )}
      >
        <Icon className="size-4" strokeWidth={2} />
      </span>

      <p className="min-w-0 flex-1 text-sm leading-[1.15rem] font-medium text-balance">
        <Highlight text={item.title} query={query} />
      </p>

      <ArrowUpRight
        aria-hidden
        className={cn(
          'size-3.5 shrink-0 text-muted-foreground transition-[opacity,translate] duration-150 ease-out',
          active ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-50',
        )}
      />
    </motion.div>
  );
}
