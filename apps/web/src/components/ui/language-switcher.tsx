'use client';

import { Button } from '@portfolio-v0/shadcn/components/button';

import { usePathname, useRouter } from 'next/navigation';

import { useTranslation } from '~/components/i18n/i18n-provider';

const PROJECT_PATH_REGEX = /^\/projects\/(.+)$/;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    const projectMatch = pathname.match(PROJECT_PATH_REGEX);

    i18n.changeLanguage(newLang);

    if (projectMatch) {
      const projectSlug = projectMatch[1];
      router.push(`/projects/${projectSlug}?lang=${newLang}`);
    }
  };

  return (
    <Button
      className="rounded-full px-3 py-4 font-mono text-xs active:scale-[0.95]"
      onClick={toggleLanguage}
      size="sm"
      variant="outline"
    >
      {i18n.language === 'fr' ? 'EN' : 'FR'}
    </Button>
  );
}
