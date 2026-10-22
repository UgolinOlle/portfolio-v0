'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { m } from 'motion/react';

import { useTranslation } from '~/components/core/i18n-provider';
import { MagneticSocialLink } from '~/components/ui/magnetic-social-link';
import {
  EMAIL,
  SECTION_REVEAL_LIST,
  TRANSITION_SECTION,
  VARIANTS_LIST,
  VARIANTS_SECTION,
} from '~/lib/constants';
import { SOCIAL_LINKS } from '~/lib/data';

import { SectionHeading } from './section-heading';

function ContactSection() {
  const { t } = useTranslation();

  return (
    <m.section {...SECTION_REVEAL_LIST} className="space-y-6" id="contact">
      <SectionHeading>{t('contact.title')}</SectionHeading>

      <p className="mb-5 text-sm text-zinc-600 dark:text-zinc-300">
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

      <m.div
        className="flex flex-wrap items-center justify-start gap-x-3 gap-y-2"
        variants={VARIANTS_LIST}
      >
        {SOCIAL_LINKS.map((link) => (
          <m.div key={link.label} transition={TRANSITION_SECTION} variants={VARIANTS_SECTION}>
            <MagneticSocialLink link={link.link}>{link.label}</MagneticSocialLink>
          </m.div>
        ))}
      </m.div>
    </m.section>
  );
}

export { ContactSection };
