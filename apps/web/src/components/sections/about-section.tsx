'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { motion } from 'motion/react';

import { useTranslation } from '~/components/core/i18n-provider';
import { VARIANTS_SECTION, TRANSITION_SECTION, EMAIL } from '~/lib/constants';

export function AboutSection() {
  const { t } = useTranslation();

  const description = t('about.description');

  return (
    <motion.section
      variants={VARIANTS_SECTION}
      transition={TRANSITION_SECTION}
      id="about"
      className="flex flex-col space-y-5"
    >
      <p className="text-sm leading-5 tracking-wide whitespace-pre-line text-zinc-600 dark:text-zinc-300">
        {description}
      </p>

      <p className="text-sm font-medium">
        {t('contact.description')}{' '}
        <a
          className={cn(
            'underline transition-colors duration-200 hover:text-zinc-900',
            'dark:text-zinc-300 dark:hover:text-zinc-100',
          )}
          href={`mailto:${EMAIL}`}
        >
          {EMAIL}
        </a>
      </p>
    </motion.section>
  );
}
