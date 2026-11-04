'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { m, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { usePathname } from 'next/navigation';
import { Fragment, useRef, type CSSProperties } from 'react';

import { useTranslation } from '~/components/core/i18n-provider';
import { SocialLinksNav } from '~/components/effects/social-links-nav';
import { ArrowRightIcon } from '~/components/icons/ui';
import { SOCIAL_LINKS } from '~/data/social-links';
import { SECTION_REVEAL } from '~/lib/constants';

import { HeroFigure } from './hero-figure';
import { HomeHeading } from './home-heading';

const WORD_STEP_MS = 40;

export function HeroSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const showSocialLinks = usePathname() === '/';

  // The hero drifts away as it leaves: text and figure at different rates for depth.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -28]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.9], [1, reduce ? 1 : 0.3]);
  const figureY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -64]);

  const words = t('hero.headline').split(' ');
  const afterHeadline = 80 + words.length * WORD_STEP_MS + 260;

  return (
    <section
      className={cn(
        'grid items-center gap-10 xl:grid-cols-[minmax(0,1fr)_20rem]',
        showSocialLinks ? 'mt-10' : 'mt-0',
      )}
      id="about"
      ref={ref}
    >
      <m.div className="flex flex-col items-start gap-6" style={{ y: textY, opacity: textOpacity }}>
        <h1
          className={cn(
            'max-w-[14ch] text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance',
            'text-zinc-950 sm:text-5xl sm:tracking-[-0.035em] md:text-6xl md:tracking-[-0.04em] dark:text-zinc-50',
          )}
        >
          {words.map((word, i) => (
            // oxlint-disable-next-line react/no-array-index-key -- static copy, order is the key
            <Fragment key={i}>
              <span className="hero-word" style={{ '--i': i } as CSSProperties}>
                <span>{word}</span>
              </span>{' '}
            </Fragment>
          ))}
        </h1>
        <p
          className={cn(
            'hero-in max-w-[44ch] text-lg leading-snug font-normal tracking-[-0.01em] text-pretty',
            'text-zinc-500 dark:text-zinc-400',
          )}
          style={{ '--hero-delay': `${afterHeadline}ms` } as CSSProperties}
        >
          {t('hero.lead')}
        </p>
        <div
          className="hero-in flex flex-wrap items-center gap-x-6 gap-y-3"
          style={{ '--hero-delay': `${afterHeadline + 100}ms` } as CSSProperties}
        >
          <a
            className="group inline-flex items-center gap-1 rounded-sm text-base font-medium text-zinc-700 transition-colors hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:text-zinc-300 dark:hover:text-zinc-50"
            href="#projects"
          >
            {t('hero.ctaSecondary')}
            <ArrowRightIcon
              aria-hidden="true"
              className="size-3.5 transition-transform duration-200 ease-out-strong group-hover:translate-x-0.5"
            />
          </a>
        </div>

        {showSocialLinks && (
          <div className="flex flex-col items-start gap-4">
            <SocialLinksNav links={SOCIAL_LINKS} />
          </div>
        )}
      </m.div>

      <m.div style={{ y: figureY }}>
        <HeroFigure />
      </m.div>
    </section>
  );
}

const SPOKEN_LANGUAGES = ['french', 'english', 'khmer'] as const;

/** The longer background story, moved out of the hero so the first screen stays focused. */
export function AboutSection() {
  const { t } = useTranslation();

  return (
    <m.section {...SECTION_REVEAL}>
      <HomeHeading>{t('sections.about')}</HomeHeading>

      <p className="max-w-[65ch] text-base leading-relaxed text-pretty whitespace-pre-line text-zinc-600 dark:text-zinc-400">
        {t('about.description')}
      </p>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-base">
        <h3 className="font-medium text-zinc-950 dark:text-zinc-50">
          {t('about.languages.title')}
        </h3>

        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-zinc-600 dark:text-zinc-400">
          {SPOKEN_LANGUAGES.map((language) => (
            <li key={language}>
              {t(`about.languages.${language}`)}{' '}
              <span className="text-zinc-400 dark:text-zinc-500">
                · {t(`about.languages.${language}Level`)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </m.section>
  );
}
