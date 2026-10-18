import { WEBSITE_URL } from '~/lib/constants';
import { blocksSource, componentsSource, templatesSource } from '~/lib/source';

import templatesRegistry from '../../../../packages/templates/registry.json';
import uiRegistry from '../../../../packages/ui/registry.json';

// The docs read both registries: `packages/ui` and the `@whoa-studio/templates` one.
const registryConfig = { items: [...uiRegistry.items, ...templatesRegistry.items] };

export type RegistryCategory = 'component' | 'block' | 'template';

export type RegistryItem = {
  slug: string;
  title: string;
  description?: string;
  href: string;
  preview?: string;
  previewWidth?: number;
  featured?: boolean;
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

// `registry.json` est la source de vérité shadcn (cf. `bun run registry:build`). Un item de doc ne
// référence un item de registry que via son champ `preview` (même nom que dans registry.json) :
// c'est ce qui permet d'exposer ses vraies dépendances, sans dupliquer l'info dans le frontmatter.
const registryItemsByName = new Map<string, RegistryConfigItem>(
  (registryConfig.items as RegistryConfigItem[]).map((item) => [item.name, item]),
);

// Un composant peut avoir plusieurs exemples (items portant `meta.example`) : chacun se rattache à son
// composant parent via `meta.example.of`, ordonnés par `meta.example.order`. Ajouter un exemple
// se fait uniquement en éditant `registry.json` + son fichier dans `examples/` — aucune page ni
// composant ne référence de nom de composant en dur.
export const getRegistryExamples = (componentName: string): RegistryExample[] =>
  (registryConfig.items as RegistryConfigItem[])
    .filter(
      (item): item is RegistryConfigItem & { meta: { example: { of: string; order?: number } } } =>
        item.meta?.example?.of === componentName,
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
    previewWidth: page.data.previewWidth,
    featured: page.data.featured,
    dependencies: registryItem?.registryDependencies,
    category,
  };
};

type RegistrySource = typeof componentsSource | typeof blocksSource | typeof templatesSource;
type PageTreeNode = { type: string; url?: string; children?: PageTreeNode[]; index?: PageTreeNode };

// URLs dans l'ordre de la sidebar (les `meta.json`) : `getPages()` ne garantit aucun ordre.
const flattenTreeUrls = (nodes: PageTreeNode[]): string[] =>
  nodes.flatMap((node) => [
    ...(node.index?.url ? [node.index.url] : []),
    ...(node.type === 'page' && node.url ? [node.url] : []),
    ...(node.children ? flattenTreeUrls(node.children) : []),
  ]);

const toRegistryItems = (source: RegistrySource, category: RegistryCategory): RegistryItem[] => {
  const order = flattenTreeUrls(source.pageTree.children as PageTreeNode[]);
  const position = (url: string) => {
    const index = order.indexOf(url);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };

  return (
    source
      .getPages()
      // Les pages d'index (`content/**/index.mdx`) présentent la catégorie, ce ne sont pas des items.
      .filter((page) => page.slugs.length > 0)
      .map((page) => toRegistryItem(page, category))
      // Item mis en avant d'abord, puis l'ordre de la sidebar.
      .sort(
        (a, b) =>
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
          position(a.href) - position(b.href),
      )
  );
};

const SOURCES_BY_CATEGORY = {
  component: componentsSource,
  block: blocksSource,
  template: templatesSource,
};

// Items d'une seule catégorie, pour les grilles des pages d'introduction.
export const getRegistryItems = (category: RegistryCategory): RegistryItem[] =>
  toRegistryItems(SOURCES_BY_CATEGORY[category], category);

export const getRegistrySections = (): RegistrySection[] => [
  {
    category: 'component',
    title: 'Composants',
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

export const PACKAGE_MANAGERS = ['pnpm', 'npm', 'bun', 'yarn'] as const;

export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

const PACKAGE_RUNNERS: Record<PackageManager, string> = {
  pnpm: 'pnpm dlx',
  npm: 'npx',
  bun: 'bunx --bun',
  yarn: 'yarn dlx',
};

// Commande d'installation shadcn de l'item, déclinée pour chaque gestionnaire de paquets.
export const getRegistryInstallCommands = (name: string): Record<PackageManager, string> =>
  Object.fromEntries(
    PACKAGE_MANAGERS.map((manager) => [
      manager,
      `${PACKAGE_RUNNERS[manager]} shadcn@latest add ${getRegistryItemUrl(name)}`,
    ]),
  ) as Record<PackageManager, string>;

// Une dépendance est soit un item de ce registry (lien vers sa page de doc, retrouvée via son
// champ `preview`), soit un composant shadcn/ui (lien vers sa doc officielle).
// Les dépendances entre items du registry sont des URLs (`…/r/<name>.json`, cf. scripts/registry.ts).
export const getRegistryDependencyHref = (
  dependency: string,
): { href: string; external: boolean } => {
  const name = dependency.match(/\/r\/([\w-]+)\.json$/)?.[1] ?? dependency;
  const page = [componentsSource, blocksSource, templatesSource]
    .flatMap((source) => source.getPages())
    .find((candidate) => candidate.data.preview === name);

  return page
    ? { href: page.url, external: false }
    : { href: `https://ui.shadcn.com/docs/components/${name}`, external: true };
};

// Convention d'authoring du registry : tout item `<name>` destiné à une page de doc doit avoir un
// item jumeau `<name>-demo` (portant `meta.example`, cf. registry.json) qui contient le code
// d'usage affiché sous la preview. C'est ce lien par convention qui rend la doc générique : ajouter
// un nouvel item + son `-demo` suffit à lui faire bénéficier de la page de détail, sans code dédié.
export const getRegistryDemoName = (name: string): string => `${name}-demo`;
