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
  type: string;
  title: string;
  description?: string;
  registryDependencies?: string[];
  meta?: {
    example?: {
      of: string;
      order?: number;
    };
  };
};

export type RegistryExample = {
  // Identifiant à passer à `<Preview path={...} />` (nom de l'item sans le suffixe `-demo`).
  slug: string;
  name: string;
  title: string;
  description?: string;
};

// `registry.json` est la source de vérité shadcn (cf. `pnpm registry:build`). Un item de doc ne
// référence un item de registry que via son champ `preview` (même nom que dans registry.json) :
// c'est ce qui permet d'exposer ses vraies dépendances, sans dupliquer l'info dans le frontmatter.
const registryItemsByName = new Map<string, RegistryConfigItem>(
  (registryConfig.items as RegistryConfigItem[]).map((item) => [item.name, item]),
);

// Un composant peut avoir plusieurs exemples (`registry:example`) : chacun se rattache à son
// composant parent via `meta.example.of`, ordonnés par `meta.example.order`. Ajouter un exemple
// se fait uniquement en éditant `registry.json` + son fichier dans `examples/` — aucune page ni
// composant ne référence de nom de composant en dur.
export const getRegistryExamples = (componentName: string): RegistryExample[] =>
  (registryConfig.items as RegistryConfigItem[])
    .filter(
      (item): item is RegistryConfigItem & { meta: { example: { of: string; order?: number } } } =>
        item.type === 'registry:example' && item.meta?.example?.of === componentName,
    )
    .sort((a, b) => (a.meta.example.order ?? 0) - (b.meta.example.order ?? 0))
    .map((item) => ({
      slug: item.name.replace(/-demo$/, ''),
      name: item.name,
      title: item.title,
      description: item.description,
    }));

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
