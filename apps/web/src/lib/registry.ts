import { WEBSITE_URL } from '~/lib/constants';
import { blocksSource, componentsSource, templatesSource } from '~/lib/source';

import registryConfig from '../../registry.json';

export type RegistryCategory = 'component' | 'block' | 'template';

export type RegistryItem = {
  slug: string;
  title: string;
  description?: string;
  href: string;
  preview?: string;
  dependencies?: string[];
  category: RegistryCategory;
};

export type RegistrySection = {
  category: RegistryCategory;
  title: string;
  description: string;
  href: string;
  items: RegistryItem[];
};

type RegistrySourcePage = ReturnType<typeof componentsSource.getPages>[number];

type RegistryConfigItem = {
  name: string;
  registryDependencies?: string[];
};

// `registry.json` est la source de vérité shadcn (cf. `pnpm registry:build`). Un item de doc ne
// référence un item de registry que via son champ `preview` (même nom que dans registry.json) :
// c'est ce qui permet d'exposer ses vraies dépendances, sans dupliquer l'info dans le frontmatter.
const registryItemsByName = new Map<string, RegistryConfigItem>(
  (registryConfig.items as RegistryConfigItem[]).map((item) => [item.name, item]),
);

const toRegistryItem = (page: RegistrySourcePage, category: RegistryCategory): RegistryItem => {
  const registryItem = page.data.preview ? registryItemsByName.get(page.data.preview) : undefined;

  return {
    slug: page.slugs.join('/'),
    title: page.data.title,
    description: page.data.description,
    href: page.url,
    preview: page.data.preview,
    dependencies: registryItem?.registryDependencies,
    category,
  };
};

const toRegistryItems = (
  source: typeof componentsSource | typeof blocksSource | typeof templatesSource,
  category: RegistryCategory,
): RegistryItem[] =>
  source
    .getPages()
    // Les pages d'index (`content/**/index.mdx`) présentent la catégorie, ce ne sont pas des items.
    .filter((page) => page.slugs.length > 0)
    .map((page) => toRegistryItem(page, category));

export const getRegistrySections = (): RegistrySection[] => [
  {
    category: 'component',
    title: 'Components',
    description: "Des éléments d'interface unitaires, prêts à copier-coller dans vos projets.",
    href: '/ui/components',
    items: toRegistryItems(componentsSource, 'component'),
  },
  {
    category: 'block',
    title: 'Blocks',
    description: 'Des sections de page complètes (hero, blog, footer...) pour composer rapidement.',
    href: '/ui/blocks',
    items: toRegistryItems(blocksSource, 'block'),
  },
  {
    category: 'template',
    title: 'Templates',
    description: 'Des pages entières prêtes à déployer pour lancer votre prochain projet.',
    href: '/ui/templates',
    items: toRegistryItems(templatesSource, 'template'),
  },
];

// `public/r/<name>.json` (généré par `shadcn build`, cf. next.config.mjs) est servi à la racine
// du site, quel que soit le `homepage` déclaré dans registry.json.
export const getRegistryItemUrl = (name: string): string => `${WEBSITE_URL}/r/${name}.json`;

export const getRegistryInstallCommand = (name: string): string =>
  `npx shadcn@latest add ${getRegistryItemUrl(name)}`;

// Convention d'authoring du registry : tout item `<name>` destiné à une page de doc doit avoir un
// item jumeau `<name>-demo` (type `registry:example`, cf. registry.json) qui contient le code
// d'usage affiché sous la preview. C'est ce lien par convention qui rend la doc générique : ajouter
// un nouvel item + son `-demo` suffit à lui faire bénéficier de la page de détail, sans code dédié.
export const getRegistryDemoName = (name: string): string => `${name}-demo`;
