'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { m, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Fragment, useRef, type CSSProperties } from 'react';

import { useTranslation } from '~/components/core/i18n-provider';
import { ArrowRightIcon } from '~/components/icons/ui';
import { EMAIL, SECTION_REVEAL } from '~/lib/constants';

import { HeroFigure } from './hero-figure';
import { SectionHeading } from './section-heading';

const WORD_STEP_MS = 40;

export function HeroSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // The hero drifts away as it leaves: text and figure at different rates for depth.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -28]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.9], [1, reduce ? 1 : 0.3]);
  const figureY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -64]);

  const words = t('hero.headline').split(' ');
  const afterHeadline = 80 + words.length * WORD_STEP_MS + 260;

  return (
    <section
      className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_20rem]"
      id="about"
      ref={ref}
    >
      <m.div className="flex flex-col items-start gap-6" style={{ y: textY, opacity: textOpacity }}>
        <span
          className="hero-in flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
          style={{ '--hero-delay': '0ms' } as CSSProperties}
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500/60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          {t('hero.availability')}
        </span>

        <h1 className="max-w-[26ch] text-3xl leading-[1.12] font-medium tracking-tight text-balance text-zinc-950 sm:text-4xl dark:text-zinc-50">
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
          className="hero-in max-w-[60ch] text-base leading-relaxed text-pretty text-zinc-600 dark:text-zinc-400"
          style={{ '--hero-delay': `${afterHeadline}ms` } as CSSProperties}
        >
          {t('hero.lead')}
        </p>

        <div
          className="hero-in flex flex-wrap items-center gap-x-5 gap-y-3 pt-1"
          style={{ '--hero-delay': `${afterHeadline + 100}ms` } as CSSProperties}
        >
          <a
            className={cn(
              'inline-flex items-center rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white',
              'transition-[background-color,transform] duration-150 ease-(--ease-out-strong) hover:bg-zinc-800 active:scale-[0.97]',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
              'dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200',
            )}
            href={`mailto:${EMAIL}`}
          >
            {t('hero.ctaPrimary')}
          </a>

          <a
            className="group inline-flex items-center gap-1 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
            href="#projects"
          >
            {t('hero.ctaSecondary')}
            <ArrowRightIcon
              aria-hidden="true"
              className="size-3.5 transition-transform duration-200 ease-(--ease-out-strong) group-hover:translate-x-0.5"
            />
          </a>
        </div>
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
      <SectionHeading>{t('sections.about')}</SectionHeading>

      <p className="max-w-[65ch] text-sm leading-relaxed text-pretty whitespace-pre-line text-zinc-600 dark:text-zinc-400">
        {t('about.description')}
      </p>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
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
