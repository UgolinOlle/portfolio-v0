'use client';

import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

import { EASE } from './search-row';
import type {
  CommandSearchLabels,
  SearchFilters,
  SearchItemStatus,
  SearchItemType,
  SearchUpdated,
} from './types';
import { hasActiveFilters, UPDATED_OPTIONS } from './utils';

type Labels = Required<CommandSearchLabels>;

const TYPE_OPTIONS: SearchItemType[] = ['chat', 'agent', 'document', 'knowledge'];
const STATUS_OPTIONS: SearchItemStatus[] = ['active', 'archived', 'draft'];

function Heading({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex h-5 items-center justify-between">
      <h4 className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
        {children}
      </h4>
      {action}
    </div>
  );
}

function CheckOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={cn(
        'group flex cursor-pointer items-center gap-2 py-1 text-sm select-none',
        'transition-colors duration-150',
        checked ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={(next) => onChange(next === true)}
        className="transition-transform duration-150 ease-out group-active:scale-90"
      />
      {label}
    </label>
  );
}

function toggle<T>(list: T[], value: T, on: boolean) {
  return on ? [...list, value] : list.filter((entry) => entry !== value);
}

export interface SearchFilterPanelProps {
  filters: SearchFilters;
  labels: Labels;
  onChange: (filters: SearchFilters) => void;
  onReset: () => void;
  className?: string;
}

export function SearchFilterPanel({
  filters,
  labels,
  onChange,
  onReset,
  className,
}: SearchFilterPanelProps) {
  // Unique per instance, so several searches on one page don't share the animated pill.
  const pillId = React.useId();
  const dirty = hasActiveFilters(filters);

  return (
    <aside aria-label="Filters" className={cn('space-y-5', className)}>
      <section className="space-y-2.5">
        <Heading
          action={
            <AnimatePresence initial={false}>
              {dirty && (
                <motion.button
                  key="reset"
                  type="button"
                  onClick={onReset}
                  className="-mr-1 rounded-md px-1 text-xs font-medium text-blue-600 transition-[opacity,scale] outline-none focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-95 dark:text-blue-400"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15, ease: EASE }}
                >
                  {labels.reset}
                </motion.button>
              )}
            </AnimatePresence>
          }
        >
          {labels.lastUpdated}
        </Heading>

        <div role="radiogroup" aria-label={labels.lastUpdated} className="flex flex-wrap gap-1.5">
          {UPDATED_OPTIONS.map((option: SearchUpdated) => {
            const selected = filters.updated === option;

            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange({ ...filters, updated: option })}
                className={cn(
                  'relative rounded-full px-3 py-1.5 text-sm leading-none whitespace-nowrap',
                  'transition-[color,background-color,scale] duration-150 ease-out outline-none active:scale-[0.96]',
                  'focus-visible:ring-2 focus-visible:ring-ring/50',
                  selected
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'bg-muted/70 text-muted-foreground hover:text-foreground',
                )}
              >
                {selected && (
                  <motion.span
                    layoutId={pillId}
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-blue-500/12 ring-1 ring-blue-500/15"
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  />
                )}
                <span className="relative">{labels.updated[option]}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-1.5">
        <Heading>{labels.type}</Heading>
        <div className="grid grid-cols-2 gap-x-3">
          {TYPE_OPTIONS.map((type) => (
            <CheckOption
              key={type}
              label={labels.types[type]}
              checked={filters.types.includes(type)}
              onChange={(on) => onChange({ ...filters, types: toggle(filters.types, type, on) })}
            />
          ))}
        </div>
      </section>

      <section className="space-y-1.5">
        <Heading>{labels.status}</Heading>
        <div className="grid grid-cols-2 gap-x-3">
          {STATUS_OPTIONS.map((status) => (
            <CheckOption
              key={status}
              label={labels.statuses[status]}
              checked={filters.statuses.includes(status)}
              onChange={(on) =>
                onChange({ ...filters, statuses: toggle(filters.statuses, status, on) })
              }
            />
          ))}
        </div>
      </section>

      <section className="space-y-1.5">
        <Heading>{labels.owner}</Heading>
        <CheckOption
          label={labels.createdByMe}
          checked={filters.mineOnly}
          onChange={(on) => onChange({ ...filters, mineOnly: on })}
        />
      </section>
    </aside>
  );
}
