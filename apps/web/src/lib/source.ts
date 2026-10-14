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
import { icons } from 'lucide-react';
import { createElement } from 'react';

import { DEFAULT_LOCALE, LOCALES, type Locale } from '~/lib/metadata';

const icon = (name: string | undefined) => {
  if (!name) {
    return;
  }

  if (name in icons) {
    return createElement(icons[name as keyof typeof icons]);
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
