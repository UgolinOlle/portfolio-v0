'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useTranslation } from '~/components/core/i18n-provider';

const NAV_LINKS = [
  { href: '/writings', labelKey: 'navigation.writings' },
  { href: '/ui', labelKey: 'navigation.ui' },
] as const;

/** Primary pages, reachable from every portfolio page instead of only from the footer. */
export function SiteNav() {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className="flex items-center gap-3 text-sm whitespace-nowrap sm:gap-4"
    >
      {NAV_LINKS.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'transition-colors hover:text-zinc-950 dark:hover:text-zinc-50',
              isActive
                ? 'font-medium text-zinc-950 dark:text-zinc-50'
                : 'text-zinc-500 dark:text-zinc-400',
            )}
            href={link.href}
            key={link.href}
          >
            {t(link.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
