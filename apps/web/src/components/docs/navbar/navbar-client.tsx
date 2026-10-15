'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import Link from 'next/link';

import { useTranslation } from '~/components/core/i18n-provider';
import { MAIN_CONTENT_ID } from '~/components/core/skip-link';
import { ArrowUpRightIcon, MenuIcon } from '~/components/icons/ui';
import { SidebarTrigger } from '~/layouts/docs/slots/sidebar';
import { ThemeSwitch } from '~/layouts/shared/slots/theme-switch';

import { GitHubLink } from './github-link';
import { Links } from './links';
import { Logo } from './logo';
import { MobileMenu, type MobileMenuGroup } from './mobile-menu';
import { MobileSearch } from './mobile-search';
import { Search } from './search';

export type NavbarVariant = 'docs' | 'index';

type NavbarClientProps = {
  componentsCount: number;
  blocksCount: number;
  templatesCount: number;
  menuGroups: MobileMenuGroup[];
  githubStars: number | null;
  // On docs pages the sidebar already carries search and the theme switch.
  variant: NavbarVariant;
};

// Better Auth–style top bar: full-height cells split by hairlines. The logo cell is exactly
// as wide as the docs sidebar, so its divider continues the sidebar's border.
export function NavbarClient({
  componentsCount,
  blocksCount,
  templatesCount,
  menuGroups,
  githubStars,
  variant,
}: NavbarClientProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* First focusable element: lets keyboard users jump past the header and sidebar. */}
      <a
        className="label-mono sr-only bg-foreground px-3 py-2 text-background focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-50"
        href={variant === 'docs' ? '#nd-page' : `#${MAIN_CONTENT_ID}`}
      >
        {t('navigation.skipToContent')}
      </a>
      <header className="fixed inset-x-0 top-0 z-40 flex h-(--nav-height) items-stretch border-b border-foreground/5 bg-background">
        <Link
          aria-label="Whoa UI — accueil"
          className={cn(
            'flex shrink-0 items-center gap-2.5 border-e border-foreground/5 px-4 md:w-(--docs-sidebar-width)',
            'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
          )}
          href="/ui"
        >
          <Logo />
          <span className="font-mono text-xs font-medium tracking-widest uppercase">Whoa UI</span>
        </Link>

        <nav aria-label="Registre" className="hidden md:flex">
          <Links
            blocksCount={blocksCount}
            componentsCount={componentsCount}
            templatesCount={templatesCount}
          />
        </nav>

        <div className="ms-auto hidden items-stretch md:flex">
          {variant === 'index' && (
            <>
              <Search />
              <ThemeSwitch className="h-full rounded-none border-0 border-s border-foreground/5 px-3 transition-colors hover:bg-foreground/3" />
            </>
          )}
          <GitHubLink stars={githubStars} />

          <Link
            href="/"
            className={cn(
              'label-mono group flex items-center gap-1.5 bg-foreground px-5 font-medium text-background',
              'transition-colors hover:bg-foreground/85 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
            )}
          >
            Portfolio
            <ArrowUpRightIcon
              aria-hidden="true"
              className="size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <div className="ms-auto flex items-stretch md:hidden">
          <MobileSearch />
          {variant === 'docs' ? (
            // Opens the same accordion sidebar as desktop, as a drawer.
            <SidebarTrigger className="flex w-(--nav-height) items-center justify-center border-s border-foreground/5 text-foreground/70 hover:bg-foreground/3 hover:text-foreground">
              <MenuIcon aria-hidden="true" className="size-4" />
            </SidebarTrigger>
          ) : (
            <MobileMenu groups={menuGroups} />
          )}
        </div>
      </header>
    </>
  );
}
