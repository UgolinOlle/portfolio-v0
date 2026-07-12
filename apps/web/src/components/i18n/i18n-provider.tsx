'use client';

import { useEffect, type ReactNode } from 'react';
import { I18nextProvider, useTranslation as useI18nextTranslation } from 'react-i18next';

import i18n from '~/lib/i18n';

type I18nProviderProps = {
  children: ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') || 'fr';
      i18n.changeLanguage(savedLanguage);
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

export function useTranslation() {
  const { t, i18n: i18nInstance } = useI18nextTranslation();

  const changeLanguage = (lang: string) => {
    i18nInstance.changeLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
    }
  };

  return {
    t,
    i18n: {
      language: i18nInstance.language,
      changeLanguage,
    },
  };
}
