'use client';

import { Checkbox } from '@portfolio-v0/shadcn/components/checkbox';
import { Kbd } from '@portfolio-v0/shadcn/components/kbd';
import { cn } from '@portfolio-v0/shadcn/utils';

import { Dialog } from '@base-ui/react/dialog';
import type { SharedProps } from 'fumadocs-ui/components/dialog/search';
import { m } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from 'react';

import { BlockIcon, ComponentIcon, TemplateIcon } from '~/components/icons';
import { ArrowUpRightIcon, LoaderCircleIcon, SearchIcon, StarIcon } from '~/components/icons/ui';
import type { RegistryCategory } from '~/lib/registry';

import { type SearchItem, useSearchItems } from './search-items-context';

const CATEGORIES: Record<
  RegistryCategory,
  { plural: string; Icon: typeof ComponentIcon; tile: string }
> = {
  component: {
    plural: 'Composants',
    Icon: ComponentIcon,
    tile: 'bg-blue-500/12 text-blue-600 dark:text-blue-400',
  },
  block: {
    plural: 'Blocks',
    Icon: BlockIcon,
    tile: 'bg-violet-500/12 text-violet-600 dark:text-violet-400',
  },
  template: {
    plural: 'Templates',
    Icon: TemplateIcon,
    tile: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  },
};

const CATEGORY_ORDER: RegistryCategory[] = ['component', 'block', 'template'];

const POPULAR_COUNT = 4;
const SUGGESTION_COUNT = 4;

type Row = {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  category: RegistryCategory;
  featured?: boolean;
};

type SearchHit = { id: string; url: string; type: string; content: string };

// Debounced call to the existing `/api/search` route (fumadocs' orama index, all three sources).
const useRegistryHits = (query: string) => {
  const [state, setState] = useState<{ hits: SearchHit[]; loading: boolean }>({
    hits: [],
    loading: false,
  });

  useEffect(() => {
    if (!query) {
      setState({ hits: [], loading: false });
      return;
    }

    const controller = new AbortController();
    setState((current) => ({ ...current, loading: true }));
    const timer = setTimeout(() => {
      fetch(`/api/search?query=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((response) => response.json())
        .then((hits: unknown) =>
          setState({ hits: Array.isArray(hits) ? (hits as SearchHit[]) : [], loading: false }),
        )
        .catch((error: unknown) => {
          if ((error as Error).name !== 'AbortError') setState({ hits: [], loading: false });
        });
    }, 150);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return state;
};

const categoryFromUrl = (url: string): RegistryCategory =>
  url.startsWith('/ui/blocks')
    ? 'block'
    : url.startsWith('/ui/templates')
      ? 'template'
      : 'component';

const CategoryTile = ({
  category,
  className,
}: {
  category: RegistryCategory;
  className?: string;
}) => {
  const { Icon, tile } = CATEGORIES[category];

  return (
    <span
      aria-hidden="true"
      className={cn('flex size-9 shrink-0 items-center justify-center rounded-xl', tile, className)}
    >
      <Icon className="size-4.5" />
    </span>
  );
};

// ⌘K dialog: a floating search pill over a rounded panel (tabs, results, suggestions, filters).
// Data comes from the registry (`useSearchItems`) when the query is empty and from `/api/search`
// otherwise. `selected` is the single source for both the tabs and the type checkboxes.
export default function RegistrySearchDialog({ open, onOpenChange }: SharedProps) {
  const router = useRouter();
  const items = useSearchItems();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<RegistryCategory[]>([]);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [active, setActive] = useState(0);

  const query = search.trim();
  const { hits, loading: isLoading } = useRegistryHits(query);

  const matches = (row: Pick<Row, 'category' | 'featured'>) =>
    (selected.length === 0 || selected.includes(row.category)) &&
    (!featuredOnly || Boolean(row.featured));

  const rows = useMemo<Row[]>(() => {
    const filter = (row: Row) =>
      (selected.length === 0 || selected.includes(row.category)) &&
      (!featuredOnly || Boolean(row.featured));

    if (!query) {
      return items
        .map<Row>((item) => ({ ...item, id: item.href, subtitle: item.description }))
        .filter(filter)
        .slice(0, POPULAR_COUNT);
    }

    const byHref = new Map<string, SearchItem>(items.map((item) => [item.href, item]));
    const seen = new Set<string>();
    const out: Row[] = [];

    for (const hit of hits) {
      const path = hit.url.split('#')[0];
      if (seen.has(path)) continue;
      seen.add(path);
      const item = byHref.get(path);
      out.push({
        id: hit.id,
        title: item?.title ?? hit.content,
        subtitle: item?.description ?? (hit.type === 'page' ? undefined : hit.content),
        href: hit.url,
        category: item?.category ?? categoryFromUrl(path),
        featured: item?.featured,
      });
    }

    return out.filter(filter);
  }, [hits, featuredOnly, items, query, selected]);

  const suggestions = useMemo(
    () => items.filter((item) => item.featured && matches(item)).slice(0, SUGGESTION_COUNT),
    [items, selected, featuredOnly],
  );

  useEffect(() => setActive(0), [query, selected, featuredOnly]);

  useEffect(() => {
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, listId]);

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (rows.length === 0) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const offset = event.key === 'ArrowDown' ? 1 : -1;
      setActive((current) => (current + offset + rows.length) % rows.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      go(rows[active].href);
    }
  };

  const toggleCategory = (category: RegistryCategory) =>
    setSelected((current) =>
      current.includes(category)
        ? current.filter((value) => value !== category)
        : [...current, category],
    );

  const tabs: { key: 'all' | RegistryCategory; label: string }[] = [
    { key: 'all', label: 'Tout' },
    ...CATEGORY_ORDER.map((category) => ({ key: category, label: CATEGORIES[category].plural })),
  ];

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed start-1/2 top-[10vh] z-50 grid w-[calc(100%-1.5rem)] max-w-4xl -translate-x-1/2 gap-3 transition-[opacity,transform] duration-150 ease-(--ease-out-strong) outline-none data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.97] data-starting-style:opacity-0">
          <Dialog.Title className="sr-only">Rechercher</Dialog.Title>

          <div className="flex h-14 items-center gap-3 rounded-2xl bg-background px-5 shadow-xl ring-1 ring-foreground/10">
            {isLoading ? (
              <LoaderCircleIcon className="size-5 shrink-0 animate-spin text-foreground/40" />
            ) : (
              <SearchIcon className="size-5 shrink-0 text-foreground/40" />
            )}
            <input
              aria-activedescendant={rows.length > 0 ? `${listId}-${active}` : undefined}
              aria-controls={listId}
              aria-expanded="true"
              aria-label="Rechercher"
              autoComplete="off"
              className="h-full min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-foreground/40"
              ref={inputRef}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Rechercher un composant, un block, un template…"
              role="combobox"
              value={search}
            />
          </div>

          <div className="overflow-hidden rounded-3xl bg-background shadow-2xl ring-1 ring-foreground/10">
            <div className="grid max-h-[62vh] overflow-hidden md:grid-cols-[minmax(0,1fr)_16rem]">
              <div className="flex min-w-0 flex-col gap-6 overflow-y-auto p-6">
                <div
                  aria-label="Catégorie"
                  className="flex w-fit max-w-full overflow-x-auto rounded-xl bg-muted p-1"
                  role="group"
                >
                  {tabs.map((tab) => {
                    const current =
                      tab.key === 'all'
                        ? selected.length === 0
                        : selected.length === 1 && selected[0] === tab.key;

                    return (
                      <button
                        aria-pressed={current}
                        className={cn(
                          'relative shrink-0 rounded-lg px-3.5 py-1.5 text-sm font-medium text-foreground/55 transition-colors duration-150',
                          'hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring',
                          current && 'text-foreground',
                        )}
                        key={tab.key}
                        onClick={() => setSelected(tab.key === 'all' ? [] : [tab.key])}
                        type="button"
                      >
                        {current && (
                          <m.span
                            aria-hidden="true"
                            className="absolute inset-0 rounded-lg bg-background shadow-sm ring-1 ring-foreground/5"
                            layoutId="search-tab"
                            transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                          />
                        )}
                        <span className="relative">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                <section aria-label={query ? 'Résultats' : 'Populaires'}>
                  <h2 className="label-mono mb-3 text-foreground/45">
                    {query ? 'Résultats' : 'Populaires'}
                  </h2>
                  {rows.length > 0 ? (
                    <ul className="flex flex-col" id={listId} role="listbox">
                      {rows.map((row, index) => (
                        <li
                          aria-selected={index === active}
                          id={`${listId}-${index}`}
                          key={row.id}
                          onMouseMove={() => setActive(index)}
                          role="option"
                        >
                          <Link
                            className={cn(
                              'flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors duration-100',
                              index === active && 'bg-foreground/5',
                            )}
                            href={row.href}
                            onClick={() => onOpenChange(false)}
                            tabIndex={-1}
                          >
                            <CategoryTile category={row.category} />
                            <span className="flex min-w-0 flex-1 flex-col">
                              <span className="truncate font-medium">{row.title}</span>
                              {row.subtitle && (
                                <span className="truncate text-sm text-foreground/55">
                                  {row.subtitle}
                                </span>
                              )}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="py-6 text-sm text-foreground/55" id={listId} role="status">
                      {isLoading ? 'Recherche…' : 'Aucun résultat'}
                      {query && !isLoading ? ` pour « ${query} »` : ''}
                    </p>
                  )}
                </section>

                {!query && suggestions.length > 0 && (
                  <section aria-label="Suggestions">
                    <h2 className="label-mono mb-3 text-foreground/45">Suggestions</h2>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {suggestions.map((item) => (
                        <li key={item.href}>
                          <Link
                            className={cn(
                              'group flex items-center gap-3 rounded-2xl bg-muted/60 px-3 py-3 transition-[background-color,transform] duration-150',
                              'hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring active:scale-[0.98]',
                            )}
                            href={item.href}
                            onClick={() => onOpenChange(false)}
                          >
                            <CategoryTile category={item.category} className="size-10" />
                            <span className="min-w-0 flex-1 font-medium text-pretty">
                              {item.title}
                            </span>
                            <ArrowUpRightIcon
                              aria-hidden="true"
                              className="size-4 shrink-0 text-foreground/40 transition-transform duration-150 group-hover:translate-x-px group-hover:-translate-y-px"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              <aside
                aria-label="Filtres"
                className="flex flex-col gap-7 border-s border-foreground/5 p-6 max-md:hidden"
              >
                <div>
                  <h2 className="label-mono mb-3 text-foreground/45">Affichage</h2>
                  <button
                    aria-pressed={featuredOnly}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm text-foreground/70 transition-colors duration-150',
                      'hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring',
                      featuredOnly && 'bg-blue-500/12 text-blue-600 dark:text-blue-400',
                    )}
                    onClick={() => setFeaturedOnly((value) => !value)}
                    type="button"
                  >
                    <StarIcon className="size-4" weight={featuredOnly ? 'fill' : 'regular'} />
                    Mis en avant
                  </button>
                </div>

                <div>
                  <h2 className="label-mono mb-3 text-foreground/45">Type</h2>
                  <ul className="flex flex-col gap-3">
                    {CATEGORY_ORDER.map((category) => (
                      <li key={category}>
                        <label className="flex cursor-pointer items-center gap-3 text-sm">
                          <Checkbox
                            checked={selected.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          {CATEGORIES[category].plural}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>

            <footer className="flex items-center gap-5 bg-muted/50 px-6 py-3 text-sm text-foreground/55">
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="flex gap-1">
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd>
                </span>
                Naviguer
              </span>
              <span className="flex items-center gap-2">
                <Kbd aria-hidden="true">↵</Kbd>
                Ouvrir
              </span>
              <span className="ms-auto flex items-center gap-2">
                <Kbd aria-hidden="true">esc</Kbd>
                Fermer
              </span>
            </footer>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
