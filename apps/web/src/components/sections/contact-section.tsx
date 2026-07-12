'use client';

import { motion } from 'motion/react';

import { useTranslation } from '~/components/i18n/i18n-provider';
import { MagneticSocialLink, Status } from '~/components/ui';
import { EMAIL, TRANSITION_SECTION, VARIANTS_SECTION } from '~/lib/constants';
import { SOCIAL_LINKS } from '~/lib/data';
import { cn } from '~/lib/utils';

const SOCIAL_LINK_BASE_DELAY = 0.5;
const SOCIAL_LINK_STAGGER_MULTIPLIER = 0.1;

function ContactSection() {
  const { t } = useTranslation();

  return (
    <motion.section
      className="space-y-6"
      transition={TRANSITION_SECTION}
      variants={VARIANTS_SECTION}
      id="contact"
    >
      <div className="flex items-center gap-2">
        <h3 className="text-lg tracking-tight text-zinc-900 dark:text-white">
          {t('contact.title')}
        </h3>

        <Status status="online" />
      </div>

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

      <motion.div
        className="flex flex-wrap items-center justify-start  gap-x-3 gap-y-2"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
        viewport={{ once: true, margin: '-100px' }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {SOCIAL_LINKS.map((link, index) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            key={link.label}
            transition={{
              duration: 0.4,
              delay: SOCIAL_LINK_BASE_DELAY + index * SOCIAL_LINK_STAGGER_MULTIPLIER,
              ease: 'easeOut',
            }}
            viewport={{ once: true, margin: '-50px' }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
          >
            <MagneticSocialLink link={link.link}>{link.label}</MagneticSocialLink>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

export { ContactSection };
