'use client';

import { ArrowDown, ArrowUp, CornerDownLeft, Search, SearchX, X } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import * as React from 'react';

import { Kbd } from '@/components/ui/kbd';
import { cn } from '@/lib/utils';

import { SearchFilterPanel } from './search-filters';
import { EASE, SearchAgentCard, SearchRow } from './search-row';
import type {
  CommandSearchLabels,
  SearchFilters,
  SearchItem,
  SearchItemType,
  SearchTab,
} from './types';
import { DEFAULT_FILTERS, filterItems, hasActiveFilters, SECTION_ORDER } from './utils';

export interface CommandSearchProps {
  items: SearchItem[];
  /** Called on Enter or click on a result. */
  onSelect?: (item: SearchItem) => void;
  /** Called on the Esc key (when the field is empty) and on the "Quit" hint. */
  onQuit?: () => void;
  defaultQuery?: string;
  defaultTab?: SearchTab;
  autoFocus?: boolean;
  labels?: CommandSearchLabels;
  className?: string;
}

const TABS: SearchTab[] = ['all', 'chats', 'agents', 'documents'];

const DEFAULT_LABELS: Required<CommandSearchLabels> = {
  placeholder: 'Search chats, agents, documents, or ask anything…',
  tabs: { all: 'All', chats: 'Chats', agents: 'Agents', documents: 'Documents' },
  sections: {
    chat: 'Recent chats',
    agent: 'Suggested agents',
    document: 'Documents',
    knowledge: 'Knowledge',
  },
  lastUpdated: 'Last updated',
  updated: {
    any: 'Any time',
    today: 'Today',
    yesterday: 'Yesterday',
    week: 'Past 7 days',
    month: 'Past 30 days',
    year: 'Past year',
  },
  type: 'Type',
  types: { chat: 'Chats', agent: 'Agents', document: 'Documents', knowledge: 'Knowledge' },
  status: 'Status',
  statuses: { active: 'Active', archived: 'Archived', draft: 'Draft' },
  owner: 'Owner',
  createdByMe: 'Created by me',
  reset: 'Reset',
  navigate: 'Navigate',
  select: 'Select',
  quit: 'Quit',
  clear: 'Clear search',
  empty: (query) => (query ? `No results for “${query}”` : 'No results'),
  emptyHint: 'Try another word, or loosen the filters.',
  results: (count) => `${count} ${count === 1 ? 'result' : 'results'}`,
};

export function CommandSearch({
  items,
  onSelect,
  onQuit,
  defaultQuery = '',
  defaultTab = 'all',
  autoFocus,
  labels: labelOverrides,
  className,
}: CommandSearchProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const uid = React.useId();
  const listId = `${uid}-list`;
  const tabPillId = `${uid}-tab`;

  const [query, setQuery] = React.useState(defaultQuery);
  const [tab, setTab] = React.useState<SearchTab>(defaultTab);
  const [filters, setFilters] = React.useState<SearchFilters>(DEFAULT_FILTERS);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(Boolean(defaultQuery));

  const inputRef = React.useRef<HTMLInputElement>(null);
  const viaKeyboard = React.useRef(false);

  // The first paint staggers the rows in; later changes (typing, filters) animate without delay.
  const [settled, setSettled] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    setSettled(false);
    const timer = setTimeout(() => setSettled(true), 800);
    return () => clearTimeout(timer);
  }, [open]);

  // Clicking anywhere outside the component folds the panel back to the bare search field.
  const rootRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const results = React.useMemo(
    () => filterItems(items, { query, tab, filters }),
    [items, query, tab, filters],
  );

  const groups = SECTION_ORDER.map((type) => ({
    type,
    items: results.filter((item) => item.type === type),
  })).filter((group) => group.items.length > 0);

  // Keyboard order is the visual order: section by section.
  const flat = groups.flatMap((group) => group.items);
  const activeItem = flat.find((item) => item.id === activeId) ?? flat[0];
  const optionId = (item: SearchItem) => `${uid}-opt-${item.id}`;

  React.useEffect(() => {
    if (!viaKeyboard.current || !activeItem) return;
    viaKeyboard.current = false;
    document.getElementById(`${uid}-opt-${activeItem.id}`)?.scrollIntoView({ block: 'nearest' });
  }, [activeItem, uid]);

  // The panel height follows its content, so filtering never makes the page jump.
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const [bodyHeight, setBodyHeight] = React.useState<number | null>(null);
  React.useEffect(() => {
    const element = bodyRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setBodyHeight(element.offsetHeight));
    observer.observe(element);
    return () => {
      observer.disconnect();
      setBodyHeight(null);
    };
  }, [open]);

  const move = (delta: number) => {
    if (flat.length === 0) return;
    const current = activeItem ? flat.indexOf(activeItem) : 0;
    viaKeyboard.current = true;
    setActiveId(flat[(current + delta + flat.length) % flat.length].id);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      setOpen(true);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      move(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      move(-1);
    } else if (event.key === 'Enter' && activeItem && !event.nativeEvent.isComposing) {
      event.preventDefault();
      onSelect?.(activeItem);
    } else if (event.key === 'Escape') {
      if (query) {
        event.preventDefault();
        setQuery('');
      } else if (open) {
        setOpen(false);
        onQuit?.();
      }
    }
  };

  const changeFilters = (next: SearchFilters) => {
    setFilters(next);
    // Picking a type from the filters means "across everything of that type".
    if (next.types.length > filters.types.length) setTab('all');
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const gridType: SearchItemType = 'agent';
  let rowIndex = 0;

  return (
    <MotionConfig reducedMotion="user">
      <div ref={rootRef} className={cn('w-full max-w-[680px]', className)}>
        {/* Search field */}
        <motion.div
          initial={{ opacity: 0, transform: 'translateY(8px)' }}
          animate={{ opacity: 1, transform: 'translateY(0px)' }}
          transition={{ duration: 0.4, ease: EASE }}
          className={cn(
            'group relative z-10 flex h-12 items-center gap-3 rounded-2xl bg-card px-4 text-card-foreground',
            'shadow-[0_0_0_1px_var(--color-border),0_8px_24px_-12px_rgb(0_0_0/0.18)]',
            'transition-shadow duration-200 ease-out focus-within:shadow-[0_0_0_1px_rgb(59_130_246/0.5),0_0_0_4px_rgb(59_130_246/0.14),0_8px_24px_-12px_rgb(0_0_0/0.18)]',
          )}
        >
          <Search
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground transition-colors duration-200 group-focus-within:text-foreground"
          />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeItem ? optionId(activeItem) : undefined}
            aria-label={labels.placeholder}
            autoComplete="off"
            spellCheck={false}
            autoFocus={autoFocus}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            placeholder={labels.placeholder}
            className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />

          <AnimatePresence initial={false}>
            {query && (
              <motion.button
                key="clear"
                type="button"
                aria-label={labels.clear}
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="-mr-1 grid size-6 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-90"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15, ease: EASE }}
              >
                <X className="size-3" strokeWidth={2.5} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results panel, only once the field is engaged */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, transform: 'translateY(-10px) scale(0.985)' }}
              animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
              exit={{
                opacity: 0,
                transform: 'translateY(-6px) scale(0.99)',
                transition: { duration: 0.14, ease: 'easeIn' },
              }}
              transition={{ duration: 0.35, ease: EASE }}
              style={{ transformOrigin: 'top center' }}
              className="mt-3 overflow-hidden rounded-2xl bg-card text-card-foreground shadow-[0_0_0_1px_var(--color-border),0_16px_40px_-16px_rgb(0_0_0/0.22)]"
            >
              <motion.div
                initial={false}
                animate={{ height: bodyHeight ?? 'auto' }}
                transition={{ duration: 0.3, ease: EASE }}
                className="overflow-hidden"
              >
                <div ref={bodyRef}>
                  {/* Tabs */}
                  <div className="px-4 pt-4">
                    <div
                      role="tablist"
                      aria-label="Scope"
                      className="inline-flex items-center rounded-xl bg-muted p-0.5 shadow-[inset_0_0_0_1px_rgb(0_0_0/0.03)]"
                    >
                      {TABS.map((id) => {
                        const selected = id === tab;

                        return (
                          <button
                            key={id}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            onClick={() => setTab(id)}
                            className={cn(
                              'relative rounded-[10px] px-3 py-1.5 text-sm leading-none font-medium',
                              'transition-[color,scale] duration-150 outline-none active:scale-[0.96]',
                              'focus-visible:ring-2 focus-visible:ring-ring/50',
                              selected
                                ? 'text-foreground'
                                : 'text-muted-foreground hover:text-foreground',
                            )}
                          >
                            {selected && (
                              <motion.span
                                layoutId={tabPillId}
                                aria-hidden
                                className="absolute inset-0 rounded-[10px] bg-card shadow-sm ring-1 ring-border/70"
                                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                              />
                            )}
                            <span className="relative">{labels.tabs[id]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-x-6 p-4 pt-3 md:grid-cols-[minmax(0,1fr)_14rem]">
                    {/* Results */}
                    <div className="-mx-2 max-h-[27rem] min-w-0 overflow-x-hidden overflow-y-auto overscroll-contain px-2 pb-1">
                      <p className="sr-only" aria-live="polite">
                        {labels.results(results.length)}
                      </p>

                      <div
                        id={listId}
                        role="listbox"
                        aria-label={labels.placeholder}
                        className="relative space-y-4"
                      >
                        <AnimatePresence mode="popLayout">
                          {groups.map((group) => (
                            <motion.section
                              key={group.type}
                              layout="position"
                              role="group"
                              aria-label={labels.sections[group.type]}
                              exit={{ opacity: 0, transition: { duration: 0.12 } }}
                            >
                              <h3
                                aria-hidden
                                className="mb-1 px-2 font-mono text-[11px] tracking-wider text-muted-foreground uppercase"
                              >
                                {labels.sections[group.type]}
                              </h3>

                              <div
                                className={cn(
                                  'relative',
                                  group.type === gridType
                                    ? 'grid grid-cols-1 gap-2 sm:grid-cols-2'
                                    : 'space-y-0.5',
                                )}
                              >
                                <AnimatePresence mode="popLayout">
                                  {group.items.map((item) => {
                                    const Row =
                                      group.type === gridType ? SearchAgentCard : SearchRow;
                                    const index = rowIndex++;

                                    return (
                                      <Row
                                        key={item.id}
                                        item={item}
                                        query={query}
                                        optionId={optionId(item)}
                                        active={item.id === activeItem?.id}
                                        delay={settled ? 0 : 0.14 + Math.min(index, 10) * 0.035}
                                        onActivate={() => setActiveId(item.id)}
                                        onSelect={() => onSelect?.(item)}
                                      />
                                    );
                                  })}
                                </AnimatePresence>
                              </div>
                            </motion.section>
                          ))}
                        </AnimatePresence>
                      </div>

                      <AnimatePresence>
                        {flat.length === 0 && (
                          <motion.div
                            key="empty"
                            initial={{ opacity: 0, transform: 'translateY(6px)' }}
                            animate={{ opacity: 1, transform: 'translateY(0px)' }}
                            exit={{ opacity: 0, transition: { duration: 0.1 } }}
                            transition={{ duration: 0.25, ease: EASE, delay: 0.1 }}
                            className="flex flex-col items-center gap-1 px-4 py-10 text-center"
                          >
                            <span className="mb-2 grid size-10 place-items-center rounded-xl bg-muted text-muted-foreground">
                              <SearchX className="size-5" strokeWidth={1.75} />
                            </span>
                            <p className="max-w-full truncate text-sm font-medium">
                              {labels.empty(query.trim())}
                            </p>
                            <p className="text-sm text-pretty text-muted-foreground">
                              {labels.emptyHint}
                            </p>
                            {hasActiveFilters(filters) && (
                              <button
                                type="button"
                                onClick={resetFilters}
                                className="mt-2 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium transition-[background-color,scale] outline-none hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-95"
                              >
                                {labels.reset}
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Filters */}
                    <SearchFilterPanel
                      className="mt-4 border-t border-border/60 pt-4 md:mt-0 md:border-t-0 md:pt-0"
                      filters={filters}
                      labels={labels}
                      onChange={changeFilters}
                      onReset={resetFilters}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-muted/40 px-4 py-2.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Kbd aria-label="Arrow up">
                        <ArrowUp />
                      </Kbd>
                      <Kbd aria-label="Arrow down">
                        <ArrowDown />
                      </Kbd>
                    </span>
                    {labels.navigate}
                  </span>
                  <span className="flex items-center gap-2">
                    <Kbd aria-label="Enter">
                      <CornerDownLeft />
                    </Kbd>
                    {labels.select}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onQuit?.();
                  }}
                  className="flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <Kbd>esc</Kbd>
                  {labels.quit}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

export type {
  CommandSearchLabels,
  SearchFilters,
  SearchItem,
  SearchItemStatus,
  SearchItemType,
  SearchTab,
  SearchTone,
  SearchUpdated,
} from './types';
