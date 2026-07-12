'use client';

import { motion } from 'motion/react';

import { useTranslation } from '~/components/i18n/i18n-provider';
import { VARIANTS_SECTION, TRANSITION_SECTION } from '~/lib/constants';

export function AboutSection() {
  const { t } = useTranslation();

  const description = t('about.description');

  return (
    <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION} id="about">
      <p className="text-sm leading-5 tracking-wide whitespace-pre-line text-zinc-600 dark:text-zinc-300">
        {description}
      </p>
    </motion.section>
  );
}
