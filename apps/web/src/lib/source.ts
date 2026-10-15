import * as PhosphorIcons from '@phosphor-icons/react/ssr';
import { defineI18n } from 'fumadocs-core/i18n';
import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import {
  blocksDocs,
  blocksMeta,
  componentsDocs,
  componentsMeta,
  projectsDocs,
  projectsMeta,
  templatesDocs,
  templatesMeta,
  writingsDocs,
  writingsMeta,
} from 'fumadocs-mdx:collections/server';
import { type ComponentType, Fragment, createElement } from 'react';

import { DEFAULT_LOCALE, LOCALES, type Locale, resolveLocale } from '~/lib/metadata';

// `icon` in frontmatter / meta.json is a Phosphor icon name (e.g. `BookOpen`, `CursorClick`).
type PhosphorIcon = ComponentType<{ weight?: 'regular' | 'fill'; 'data-icon-weight'?: string }>;

const phosphorIcons = PhosphorIcons as unknown as Record<string, PhosphorIcon | undefined>;

// Both weights are rendered; `global.css` only shows the filled one for the current page.
const icon = (name: string | undefined) => {
  if (!name) {
    return;
  }

  const Icon = phosphorIcons[name];

  if (Icon) {
    return createElement(
      Fragment,
      null,
      createElement(Icon, { 'data-icon-weight': 'regular' }),
      createElement(Icon, { weight: 'fill', 'data-icon-weight': 'fill' }),
    );
  }
};

export const componentsSource = loader({
  baseUrl: '/ui/components',
  source: toFumadocsSource(componentsDocs, componentsMeta),
  icon,
});

export const blocksSource = loader({
  baseUrl: '/ui/blocks',
  source: toFumadocsSource(blocksDocs, blocksMeta),
  icon,
});

export const templatesSource = loader({
  baseUrl: '/ui/templates',
  source: toFumadocsSource(templatesDocs, templatesMeta),
  icon,
});

export const projectsI18n = defineI18n({
  languages: [...LOCALES],
  defaultLanguage: DEFAULT_LOCALE,
});

export const projectsSource = loader({
  baseUrl: '/projects',
  source: toFumadocsSource(projectsDocs, projectsMeta),
  i18n: projectsI18n,
  icon,
});

export const writingsI18n = defineI18n({
  languages: [...LOCALES],
  defaultLanguage: DEFAULT_LOCALE,
});

export const writingsSource = loader({
  baseUrl: '/writings',
  source: toFumadocsSource(writingsDocs, writingsMeta),
  i18n: writingsI18n,
  icon,
});

type LocalizedSource = typeof projectsSource | typeof writingsSource;

/**
 * Locales a page is actually translated into. Fumadocs fills missing translations with the
 * default-language file, so a non-default locale only counts when its own `<name>.<lang>.mdx` exists.
 */
export const getPageLocales = (source: LocalizedSource, slugs: string[]): Locale[] =>
  LOCALES.filter((lang) => {
    const page = source.getPage(slugs, lang);

    return lang === DEFAULT_LOCALE ? Boolean(page) : Boolean(page?.path.endsWith(`.${lang}.mdx`));
  });

/** The page's translations, and the locale actually rendered for a requested `?lang=`. */
export const resolvePageLocale = (
  source: LocalizedSource,
  slugs: string[],
  requested: string | undefined,
) => {
  const languages = getPageLocales(source, slugs);
  const lang = resolveLocale(requested);

  return { languages, lang: languages.includes(lang) ? lang : DEFAULT_LOCALE };
};

type RegistryPage =
  | ReturnType<typeof componentsSource.getPages>[number]
  | ReturnType<typeof blocksSource.getPages>[number]
  | ReturnType<typeof templatesSource.getPages>[number];

export const getLLMText = async (page: RegistryPage) => {
  const raw = await page.data.getText('raw');

  return `# ${page.data.title}
URL: ${page.url}

${page.data.description ?? ''}

${raw}`;
};
