'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { motion } from 'motion/react';

import { useTranslation } from '~/components/core/i18n-provider';
import { ArrowRightIcon } from '~/components/icons/ui';
import { VARIANTS_SECTION, TRANSITION_SECTION, EMAIL } from '~/lib/constants';

import { SectionHeading } from './section-heading';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <motion.section
      variants={VARIANTS_SECTION}
      transition={TRANSITION_SECTION}
      // Above the fold and the LCP element: render visible from the server HTML, no entrance.
      initial={false}
      id="about"
      className="flex flex-col items-start gap-6"
    >
      <span className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500/60 motion-reduce:hidden" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        {t('hero.availability')}
      </span>

      <h1 className="max-w-[26ch] text-3xl leading-[1.15] font-medium tracking-tight text-balance text-zinc-950 sm:text-4xl dark:text-zinc-50">
        {t('hero.headline')}
      </h1>

      <p className="max-w-[60ch] text-base leading-relaxed text-pretty text-zinc-600 dark:text-zinc-400">
        {t('hero.lead')}
      </p>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
        <a
          className={cn(
            'inline-flex items-center rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white',
            'transition-[background-color,transform] duration-200 hover:bg-zinc-800 active:scale-[0.98]',
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
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
          />
        </a>
      </div>
    </motion.section>
  );
}

const SPOKEN_LANGUAGES = ['french', 'english', 'khmer'] as const;

/** The longer background story, moved out of the hero so the first screen stays focused. */
export function AboutSection() {
  const { t } = useTranslation();

  return (
    <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
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
    </motion.section>
  );
}
