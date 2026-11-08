'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useTranslation } from '~/components/core/i18n-provider';
import { LanguageSwitcher } from '~/components/effects/language-switcher';
import { SOCIAL_LINKS } from '~/data/social-links';
import { ThemeSwitch } from '~/layouts/shared/slots/theme-switch';

import { SocialLinksNav } from '../effects/social-links-nav';

import { SiteNav } from './site-nav';

/** Scroll distance that thickens the material; it relaxes below LEAVE so it never flickers. */
const SCROLL_ENTER = 16;
const SCROLL_LEAVE = 4;

/** The state only changes when a threshold is crossed, so scrolling does not re-render per pixel. */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      setScrolled((was) => (was ? y > SCROLL_LEAVE : y > SCROLL_ENTER));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return scrolled;
}

/**
 * Floating translucent toolbar (identity, nav, toggles) pinned to the top, followed by a quiet
 * intro block (tagline, socials). Both are direct children of the shell so the bar can stay sticky.
 *
 * Material, not chrome: content scrolls underneath a blurred layer. At rest it is a light glass
 * capsule; once the page scrolls it becomes a thicker material (stronger blur, deeper shadow)
 * and settles a touch smaller, so the hierarchy reads without any hard divider.
 */
function Header() {
  const { t } = useTranslation();
  const scrolled = useScrolled();
  const showTagline = usePathname() !== '/';

  return (
    <>
      {/* Site identity only: the home hero and every other page render their own <h1>. */}
      <header className="pointer-events-none sticky top-3 z-40 -mt-12 h-13">
        <div
          className={cn(
            'pointer-events-auto flex h-full origin-top items-center justify-between gap-3 rounded-full border px-5',
            // Only transform, shadow and colour change; each eases out in well under 300 ms.
            'transition-[transform,box-shadow,background-color,border-color] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
            'border-zinc-950/8 bg-white/60 backdrop-blur-md backdrop-saturate-180 dark:border-white/10 dark:bg-zinc-950/55',
            // Bright top edge: light catching the material.
            'shadow-[inset_0_1px_0_0_rgb(255_255_255/0.6)] dark:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.06)]',
            scrolled &&
              'scale-[0.985] border-zinc-950/10 bg-white/80 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.7),0_8px_30px_-8px_rgb(9_9_11/0.18)] backdrop-blur-xl dark:border-white/12 dark:bg-zinc-950/75 dark:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.08),0_8px_30px_-8px_rgb(0_0_0/0.6)]',
            // Frostier / solid fallbacks for users who ask for less transparency or more contrast.
            '[@media(prefers-reduced-transparency:reduce)]:bg-white [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none dark:[@media(prefers-reduced-transparency:reduce)]:bg-zinc-950',
            'contrast-more:border-zinc-950 contrast-more:bg-white contrast-more:backdrop-blur-none dark:contrast-more:border-white dark:contrast-more:bg-zinc-950',
          )}
          data-state={scrolled ? 'scrolled' : 'top'}
        >
          <Link
            className={cn(
              'rounded-full px-1 text-base font-semibold tracking-tight whitespace-nowrap text-zinc-950',
              'transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none',
              'outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/40',
              'dark:text-zinc-50 dark:focus-visible:ring-zinc-50/40',
            )}
            href="/"
          >
            Ugolin Ollé
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <SiteNav />
            <span
              aria-hidden="true"
              className="mx-1 hidden h-4 w-px bg-zinc-950/10 sm:block dark:bg-white/15"
            />
            <ThemeSwitch />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {showTagline && (
        <div className="mt-10 mb-14 flex flex-col items-start gap-4">
          <p className="font-sans text-base font-normal tracking-tight text-primary">
            {t('header.title')}
          </p>

          <SocialLinksNav links={SOCIAL_LINKS} />
        </div>
      )}
    </>
  );
}

export { Header };
