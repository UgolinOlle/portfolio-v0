'use client';

import { m } from 'motion/react';
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
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
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
    </m.div>
  );
}

export { BackButton };
