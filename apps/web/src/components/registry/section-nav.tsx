'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { m } from 'motion/react';
import { useEffect, useState } from 'react';

import { EASE_OUT } from '~/lib/constants';

import { CountUp } from './count-up';
import { useRegistryFilter } from './registry-filter';

type SectionNavItem = {
  category: string;
  title: string;
  count: number;
};

type SectionNavProps = {
  sections: SectionNavItem[];
};

// Rail navigation with scroll-spy: the bar on the left glides to the section in view.
export const SectionNav = ({ sections }: SectionNavProps) => {
  const [spied, setSpied] = useState<string | null>(null);
  const { filter, setFilter } = useRegistryFilter();
  // When filtered, only one section exists: it is the current one.
  const active = filter === 'all' ? spied : filter;

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.category))
      .filter((element): element is HTMLElement => element !== null);

    // A thin band around 30% from the top: the section crossing it is "current".
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setSpied(entry.target.id);
        }
      },
      { rootMargin: '-30% 0px -65% 0px' },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [sections]);

  return (
    // The sticky chip bar covers navigation on small screens.
    <nav aria-label="Sections" className="max-md:hidden">
      <ul>
        {sections.map((section, index) => {
          const current = active === section.category;

          return (
            <m.li
              animate={{ opacity: 1, transform: 'translateX(0px)' }}
              initial={{ opacity: 0, transform: 'translateX(-8px)' }}
              key={section.category}
              transition={{ delay: 0.3 + index * 0.05, duration: 0.4, ease: EASE_OUT }}
            >
              <a
                aria-current={current ? 'location' : undefined}
                className={cn(
                  'relative flex items-center gap-3 border-b border-foreground/5 px-4 py-2.5 text-sm font-medium tracking-wide text-foreground/70 transition-colors',
                  'hover:bg-foreground/3 hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
                  current && 'text-foreground',
                )}
                href={`#${section.category}`}
                onClick={() => {
                  if (filter !== 'all') setFilter(section.category);
                }}
              >
                {current && (
                  <m.span
                    aria-hidden="true"
                    className="absolute inset-y-0 start-0 w-0.5 bg-foreground"
                    layoutId="ui-nav-marker"
                    transition={{ type: 'spring', duration: 0.35, bounce: 0 }}
                  />
                )}
                <span className="font-mono text-[0.6875rem] text-foreground/35 tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="flex-1">{section.title}</span>
                <span className="font-mono text-[0.6875rem] text-foreground/45 tabular-nums">
                  <CountUp delay={0.4 + index * 0.05} value={section.count} />
                </span>
              </a>
            </m.li>
          );
        })}
      </ul>
    </nav>
  );
};
