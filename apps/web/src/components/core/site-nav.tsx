'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { m, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { useTranslation } from '~/components/core/i18n-provider';

const NAV_LINKS = [
  { href: '/writings', labelKey: 'navigation.writings' },
  { href: '/ui', labelKey: 'navigation.ui' },
] as const;

/** Critically damped: the highlight glides to its target without overshoot, and re-targets mid-flight. */
const HIGHLIGHT_SPRING = { type: 'spring', bounce: 0, duration: 0.35 } as const;

/**
 * Primary pages, reachable from every portfolio page instead of only from the footer.
 * A single highlight follows hover and keyboard focus, and rests on the current page.
 */
export function SiteNav() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion() ?? false;
  const [pointed, setPointed] = useState<string | null>(null);

  const activeHref =
    NAV_LINKS.find((link) => pathname === link.href || pathname.startsWith(`${link.href}/`))
      ?.href ?? null;
  const highlighted = pointed ?? activeHref;

  return (
    <nav
      aria-label={t('navigation.label')}
      className="flex items-center text-sm whitespace-nowrap"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPointed(null);
      }}
      onPointerLeave={() => setPointed(null)}
    >
      {NAV_LINKS.map((link) => {
        const isActive = link.href === activeHref;

        return (
          <Link
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'relative rounded-full px-3 py-1.5 outline-none',
              'transition-[color,transform] duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none',
              'focus-visible:ring-2 focus-visible:ring-zinc-950/40 dark:focus-visible:ring-zinc-50/40',
              isActive || pointed === link.href
                ? 'text-zinc-950 dark:text-zinc-50'
                : 'text-zinc-600 dark:text-zinc-400',
              isActive && 'font-medium',
            )}
            href={link.href}
            key={link.href}
            onFocus={(event) => {
              if (event.target.matches(':focus-visible')) setPointed(link.href);
            }}
            onPointerEnter={(event) => {
              if (event.pointerType === 'mouse') setPointed(link.href);
            }}
          >
            {highlighted === link.href && (
              <m.span
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-full bg-zinc-950/6 contrast-more:bg-zinc-950/15 dark:bg-white/10 dark:contrast-more:bg-white/25"
                layoutId="site-nav-highlight"
                transition={reduceMotion ? { duration: 0 } : HIGHLIGHT_SPRING}
              />
            )}
            {t(link.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
