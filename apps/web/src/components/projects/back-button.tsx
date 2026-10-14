'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

import { useTranslation } from '~/components/core/i18n-provider';

const DESTINATIONS = {
  home: { href: '/', labelKey: 'navigation.home' },
  writings: { href: '/writings', labelKey: 'navigation.writings' },
} as const;

type BackButtonProps = {
  to?: keyof typeof DESTINATIONS;
};

function BackButton({ to = 'home' }: BackButtonProps) {
  const { t } = useTranslation();
  const { href, labelKey } = DESTINATIONS[to];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground"
    >
      <Link
        href={href}
        className="group inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
      >
        <span aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5">
          ←
        </span>
        {t(labelKey)}
      </Link>
    </motion.div>
  );
}

export { BackButton };
