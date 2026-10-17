'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { AnimatePresence, motion } from 'motion/react';
import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';

import { EASE_OUT } from './reveal';

export type RegistryFilterValue = 'all' | string;

type RegistryFilterContextValue = {
  filter: RegistryFilterValue;
  setFilter: (value: RegistryFilterValue) => void;
};

const RegistryFilterContext = createContext<RegistryFilterContextValue>({
  filter: 'all',
  setFilter: () => {},
});

export const useRegistryFilter = () => useContext(RegistryFilterContext);

// Holds the selected category for the rail nav, the chips and the sections. Renders no DOM, so
// the server-rendered sections can be passed through as children.
export const RegistryFilterProvider = ({ children }: { children: ReactNode }) => {
  const [filter, setFilter] = useState<RegistryFilterValue>('all');
  const value = useMemo(() => ({ filter, setFilter }), [filter]);

  return <RegistryFilterContext.Provider value={value}>{children}</RegistryFilterContext.Provider>;
};

type FilterBarProps = {
  options: { category: string; title: string; count: number }[];
};

// Sticky chip row under the navbar. The underline glides between chips (shared layout).
export const FilterBar = ({ options }: FilterBarProps) => {
  const { filter, setFilter } = useRegistryFilter();
  const items = [
    { category: 'all', title: 'Tout', count: options.reduce((sum, o) => sum + o.count, 0) },
    ...options,
  ];

  return (
    <div
      aria-label="Filtrer par catégorie"
      className="sticky top-(--nav-height) z-20 flex overflow-x-auto border-b border-foreground/5 bg-background px-2 lg:px-4"
      role="group"
    >
      {items.map((item) => {
        const selected = filter === item.category;

        return (
          <button
            aria-pressed={selected}
            className={cn(
              'label-mono relative flex h-10 shrink-0 items-center gap-2 px-3 text-foreground/50 transition-colors duration-150',
              'hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
              selected && 'text-foreground',
            )}
            key={item.category}
            onClick={() => setFilter(item.category)}
            type="button"
          >
            {item.title}
            <span className="text-foreground/35 tabular-nums">
              {String(item.count).padStart(2, '0')}
            </span>
            {selected && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-px h-px bg-foreground"
                layoutId="ui-filter-marker"
                transition={{ type: 'spring', duration: 0.35, bounce: 0 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

type FilterableSectionProps = {
  category: string;
  children: ReactNode;
};

// Fades a section out when another category is selected, and lets its siblings glide up.
export const FilterableSection = ({ category, children }: FilterableSectionProps) => {
  const { filter } = useRegistryFilter();
  const visible = filter === 'all' || filter === category;

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          initial={{ opacity: 0 }}
          key={category}
          layout="position"
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
