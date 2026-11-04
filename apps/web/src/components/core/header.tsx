'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { m, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { FocusEvent, MouseEvent, PointerEvent } from 'react';

import { useTranslation } from '~/components/core/i18n-provider';
import { LanguageSwitcher } from '~/components/effects/language-switcher';
import { SOCIAL_LINKS } from '~/data/social-links';
import { ThemeSwitch } from '~/layouts/shared/slots/theme-switch';

import { SocialLinksNav } from '../effects/social-links-nav';

import { SiteNav } from './site-nav';

/** Scroll distance that turns the header into the notch; it turns back below LEAVE so it never flickers. */
const NOTCH_ENTER = 48;
const NOTCH_LEAVE = 24;
/** Grace period before a hover-out collapses the notch, so a brief exit doesn't flicker. */
const COLLAPSE_DELAY_MS = 120;
/** Autoplay demo: the notch opens and closes on its own until the first interaction. */
const AUTOPLAY_FIRST_MS = 1000;
const AUTOPLAY_HOLD_MS = 2400;
const AUTOPLAY_REST_MS = 4000;

/** Same value in every state so the corners only change between round and square, never in size. */
const NOTCH_RADIUS = 24;
const MORPH_SPRING = { type: 'spring', bounce: 0, duration: 0.4 } as const;

/** The state only changes when a threshold is crossed, so scrolling does not re-render per pixel. */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      setScrolled((was) => (was ? y > NOTCH_LEAVE : y > NOTCH_ENTER));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return scrolled;
}

/**
 * Hover, keyboard focus and tap all expand the notch. Mouse hover collapses after a short delay;
 * a tap outside, Escape or focus leaving collapses it too. Until the user first interacts with it,
 * the notch also plays the open/close cycle by itself (never with reduced motion).
 */
function useNotchOpen(scrolled: boolean, reduceMotion: boolean) {
  const [open, setOpen] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const hovered = useRef(false);
  const lastPointer = useRef('mouse');

  const cancelCollapse = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  };
  const expand = () => {
    cancelCollapse();
    setAutoplay(false);
    setOpen(true);
  };
  const collapseSoon = () => {
    cancelCollapse();
    timer.current = window.setTimeout(() => setOpen(false), COLLAPSE_DELAY_MS);
  };

  useEffect(() => cancelCollapse, []);

  useEffect(() => {
    if (!scrolled) setOpen(false);
  }, [scrolled]);

  useEffect(() => {
    if (!scrolled || !autoplay || reduceMotion) return;
    let expanded = false;
    let autoplayTimer: number;
    const tick = () => {
      expanded = !expanded;
      setOpen(expanded);
      autoplayTimer = window.setTimeout(tick, expanded ? AUTOPLAY_HOLD_MS : AUTOPLAY_REST_MS);
    };
    autoplayTimer = window.setTimeout(tick, AUTOPLAY_FIRST_MS);
    return () => window.clearTimeout(autoplayTimer);
  }, [scrolled, autoplay, reduceMotion]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (event.target instanceof Node && !ref.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const handlers = {
    onPointerDown: (event: PointerEvent) => {
      lastPointer.current = event.pointerType;
    },
    onPointerEnter: (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      hovered.current = true;
      expand();
    },
    onPointerLeave: (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      hovered.current = false;
      collapseSoon();
    },
    onFocus: (event: FocusEvent) => {
      if (event.target.matches(':focus-visible')) expand();
    },
    onBlur: (event: FocusEvent) => {
      if (!event.currentTarget.contains(event.relatedTarget) && !hovered.current) collapseSoon();
    },
    onClickCapture: (event: MouseEvent) => {
      if (scrolled && !open && lastPointer.current !== 'mouse') {
        event.preventDefault();
        event.stopPropagation();
        expand();
      }
    },
  };

  return { open, ref, handlers };
}

/**
 * Floating glass bar (identity, nav, toggles) followed by a quiet intro block
 * (tagline, socials). Both are direct children of the shell so the bar can stay pinned.
 *
 * Three states: `header` (full width at the top), `notch` (compact pill once scrolled) and
 * `expanded` (the pill opened by hover, focus or tap). The pill morphs with a layout spring.
 */
function Header() {
  const { t } = useTranslation();
  const scrolled = useScrolled();
  const reduceMotion = useReducedMotion() ?? false;
  const { open, ref, handlers } = useNotchOpen(scrolled, reduceMotion);
  const showTagline = usePathname() !== '/';
  const collapsed = scrolled && !open;

  return (
    <>
      {/* Site identity only: the home hero and every other page render their own <h1>. */}
      {/* Reserves the bar's height: once scrolled the pill is fixed to the viewport and leaves the flow. */}
      <header className="relative z-40 -mt-12 h-13">
        <m.div
          {...handlers}
          className={cn(
            'flex items-center py-2',
            // The notch is wider than the bar's content: roomier padding, and a minimum width while collapsed.
            scrolled ? 'px-5 md:px-8' : 'justify-between px-5',
            collapsed
              ? 'min-w-64 justify-center'
              : scrolled && 'max-w-full min-w-0 justify-between md:min-w-md',
            'transition-shadow duration-200 ease-out motion-reduce:transition-none',
            scrolled
              ? 'fixed inset-x-0 top-0 mx-auto w-fit border-0 bg-(--notch) text-zinc-950 shadow-lg shadow-zinc-950/10 [--notch:#e6e6ea] dark:text-zinc-50 dark:shadow-black/40 dark:[--notch:#2b2d31]'
              : [
                  'relative w-full border border-zinc-200/80 bg-white/70 shadow-sm shadow-zinc-950/0 backdrop-blur-xl backdrop-saturate-150 dark:border-zinc-800/80 dark:bg-zinc-950/70',
                  '[@media(prefers-reduced-transparency:reduce)]:bg-white [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none dark:[@media(prefers-reduced-transparency:reduce)]:bg-zinc-950',
                  'contrast-more:bg-white contrast-more:backdrop-blur-none dark:contrast-more:bg-zinc-950',
                ],
          )}
          data-state={!scrolled ? 'header' : open ? 'expanded' : 'notch'}
          layout
          ref={ref}
          style={{
            borderBottomLeftRadius: NOTCH_RADIUS,
            borderBottomRightRadius: NOTCH_RADIUS,
            borderTopLeftRadius: scrolled ? 0 : NOTCH_RADIUS,
            borderTopRightRadius: scrolled ? 0 : NOTCH_RADIUS,
          }}
          transition={reduceMotion ? { duration: 0 } : MORPH_SPRING}
        >
          {/* Inverted corners that blend the notch into the top edge. */}
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute top-0 -left-6 size-6 bg-[radial-gradient(circle_at_0_100%,transparent_calc(1.5rem-0.5px),var(--notch)_1.5rem)]',
              'transition-opacity duration-150 ease-out motion-reduce:transition-none',
              scrolled ? 'opacity-100' : 'opacity-0',
            )}
          />
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute top-0 -right-6 size-6 bg-[radial-gradient(circle_at_100%_100%,transparent_calc(1.5rem-0.5px),var(--notch)_1.5rem)]',
              'transition-opacity duration-150 ease-out motion-reduce:transition-none',
              scrolled ? 'opacity-100' : 'opacity-0',
            )}
          />
          <m.div layout="position">
            <Link
              className={cn(
                'rounded-sm text-base font-medium tracking-tight whitespace-nowrap text-black',
                'outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/40',
                'dark:text-white dark:focus-visible:ring-zinc-50/40',
              )}
              href="/"
            >
              Ugolin Ollé
            </Link>
          </m.div>

          {/* Kept in the DOM while collapsed so keyboard focus can reach it (and expand the notch). */}
          <m.div
            className={cn(
              '-m-1 flex items-center gap-2 p-1',
              'transition-opacity duration-150 ease-out motion-reduce:transition-none',
              collapsed ? 'pointer-events-none w-0 overflow-hidden opacity-0' : 'ml-3 opacity-100',
            )}
            layout="position"
          >
            <SiteNav />
            <span
              aria-hidden="true"
              className="mx-1 hidden h-4 w-px bg-zinc-200 sm:block dark:bg-zinc-800"
            />
            <ThemeSwitch />
            <LanguageSwitcher />
          </m.div>
        </m.div>
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
