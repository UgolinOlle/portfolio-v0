'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, type ReactNode } from 'react';
import { I18nextProvider, useTranslation as useI18nextTranslation } from 'react-i18next';

import i18n from '~/lib/i18n';
import { DEFAULT_LOCALE, resolveLocale, type Locale } from '~/lib/metadata';

const STORAGE_KEY = 'language';

// Pages whose content language comes from the URL (`?lang=en`, French when absent).
const LOCALIZED_CONTENT_PATH = /^\/(projects\/.+|writings(\/.*)?)$/;

const readStoredLocale = (): Locale | undefined => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? resolveLocale(stored) : undefined;
  } catch {
    return undefined;
  }
};

const applyLocale = (locale: Locale, persist: boolean) => {
  if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }
  document.documentElement.lang = locale;
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Storage unavailable (private mode...): the URL still drives the language.
    }
  }
};

/**
 * Keeps the interface language in step with the page. On localized content pages the URL wins,
 * so the header and footer always match the article or project; elsewhere the saved choice applies.
 */
function LocaleSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlLang = searchParams.get('lang');

  useEffect(() => {
    const stored = readStoredLocale();

    if (!LOCALIZED_CONTENT_PATH.test(pathname)) {
      applyLocale(stored ?? DEFAULT_LOCALE, false);
      return;
    }

    if (urlLang) {
      applyLocale(resolveLocale(urlLang), true);
      return;
    }

    // French content URL, but the visitor chose English: switch to the English version.
    if (stored && stored !== DEFAULT_LOCALE) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('lang', stored);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      return;
    }

    applyLocale(DEFAULT_LOCALE, false);
  }, [pathname, router, searchParams, urlLang]);

  return null;
}

type I18nProviderProps = {
  children: ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
  return (
    <I18nextProvider i18n={i18n}>
      {/* Isolated boundary: reading the URL here must not opt whole pages out of prerendering. */}
      <Suspense fallback={null}>
        <LocaleSync />
      </Suspense>
      {children}
    </I18nextProvider>
  );
}

export function useTranslation() {
  const { t, i18n: i18nInstance } = useI18nextTranslation();

  const changeLanguage = (lang: string) => {
    applyLocale(resolveLocale(lang), true);
  };

  return {
    t,
    i18n: {
      language: i18nInstance.language,
      changeLanguage,
    },
  };
}
