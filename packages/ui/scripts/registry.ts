import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

/*
  Génère `registry.json` depuis les packages du workspace, sur le modèle de kibo-ui : chaque item
  est un package `packages/<name>/` (`index.tsx` + modules internes, `package.json`, `tsconfig.json`).
  `registry.json` reste l'unique point d'entrée des deux canaux de distribution (`shadcn build` et
  `tsup.config.ts`) : il n'est simplement plus écrit à la main.

  Depuis chaque package :
  - `files` : `index.tsx` d'abord (point d'entrée npm), puis les autres modules `.ts(x)` ;
  - `dependencies` : celles du `package.json`, hors React et packages du workspace ;
  - `registryDependencies` : déduites des imports (`@/components/ui/<x>` = primitive shadcn,
    `@/components/ui/ugolin/<x>` et `@/components/blocks/<x>` = item de ce registry) ;
  - le champ `registry` du `package.json` : titre, type (`ui` | `block`), catégorie, exemples.

  Les exemples vivent dans `apps/web/examples/<name>.tsx` et deviennent les items `<name>-demo`.
*/

type ExampleConfig = { name: string; title: string; description: string };

type PackageJson = {
  name: string;
  description?: string;
  dependencies?: Record<string, string>;
  registry?: {
    title: string;
    type: 'ui' | 'block';
    category?: 'template';
    examples?: ExampleConfig[];
  };
};

type RegistryFile = { path: string; type: string; target: string };

type RegistryItem = {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
  meta?: Record<string, unknown>;
};

const REGISTRY_URL = 'https://ugolin-olle.com/r';
const IGNORED_DEPENDENCIES = new Set(['react', 'react-dom']);

const root = join(import.meta.dirname, '..');
const packagesDir = join(root, '..');
const examplesDir = join(root, '../../apps/web/examples');
const outputPath = join(root, 'registry.json');

const errors: string[] = [];

const readImports = (files: string[]): string[] =>
  files.flatMap((file) =>
    [...readFileSync(file, 'utf-8').matchAll(/(?:from|import)\s+['"]([^'"]+)['"]/g)].map(
      (match) => match[1],
    ),
  );

// `motion/react` -> `motion`, `@radix-ui/react-slot/x` -> `@radix-ui/react-slot`.
const toPackageName = (specifier: string): string =>
  specifier
    .split('/')
    .slice(0, specifier.startsWith('@') ? 2 : 1)
    .join('/');

const isBareImport = (specifier: string): boolean =>
  !specifier.startsWith('.') && !specifier.startsWith('@/');

const toRegistryDependencies = (imports: string[]): string[] => {
  const dependencies = imports.flatMap((specifier) => {
    const item = specifier.match(/^@\/components\/(?:ui\/ugolin|blocks)\/([\w-]+)/)?.[1];
    if (item) return [`${REGISTRY_URL}/${item}.json`];

    const primitive = specifier.match(/^@\/components\/ui\/([\w-]+)$/)?.[1];
    return primitive ? [primitive] : [];
  });

  return [...new Set(dependencies)];
};

const toNpmDependencies = (imports: string[]): string[] => [
  ...new Set(
    imports
      .filter(isBareImport)
      .map(toPackageName)
      .filter((name) => !IGNORED_DEPENDENCIES.has(name)),
  ),
];

const withArrays = (item: RegistryItem): RegistryItem => ({
  ...item,
  dependencies: item.dependencies?.length ? item.dependencies.sort() : undefined,
  registryDependencies: item.registryDependencies?.length
    ? item.registryDependencies.sort()
    : undefined,
});

const toItems = (dir: string): RegistryItem[] => {
  const packageDir = join(packagesDir, dir);
  const pkg = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf-8')) as PackageJson;
  const config = pkg.registry;
  if (!config) return [];

  const name = dir;
  const fail = (message: string) => errors.push(`packages/${name}: ${message}`);

  if (pkg.name !== `@portfolio-v0/${name}`) fail(`"name" doit valoir "@portfolio-v0/${name}".`);
  if (!pkg.description) fail('"description" manquante.');

  const sources = readdirSync(packageDir)
    .filter((file) => /\.tsx?$/.test(file) && !file.endsWith('.d.ts'))
    .sort((a, b) => (a === 'index.tsx' ? -1 : b === 'index.tsx' ? 1 : a.localeCompare(b)));

  if (sources[0] !== 'index.tsx') fail('point d\'entrée "index.tsx" manquant.');
  if (config.type === 'ui' && sources.length > 1) {
    fail('un item "ui" tient en un seul fichier (utiliser "type": "block" sinon).');
  }

  const sourcePaths = sources.map((file) => join(packageDir, file));
  const imports = readImports(sourcePaths);

  // Le `package.json` déclare les dépendances npm (comme dans kibo-ui) : on vérifie qu'il colle
  // aux imports réels, pour que le registry n'en oublie ni n'en invente aucune.
  const declared = Object.keys(pkg.dependencies ?? {}).filter(
    (dependency) =>
      !IGNORED_DEPENDENCIES.has(dependency) && !dependency.startsWith('@portfolio-v0/'),
  );
  const imported = toNpmDependencies(imports);
  for (const dependency of imported.filter((dep) => !declared.includes(dep))) {
    fail(`"${dependency}" est importé mais absent des "dependencies".`);
  }
  for (const dependency of declared.filter((dep) => !imported.includes(dep))) {
    fail(`"${dependency}" est déclaré dans "dependencies" mais jamais importé.`);
  }

  const item: RegistryItem = {
    name,
    type: config.type === 'ui' ? 'registry:ui' : 'registry:block',
    title: config.title,
    description: pkg.description ?? '',
    dependencies: declared,
    registryDependencies: toRegistryDependencies(imports),
    files: sources.map((file) => ({
      path: relative(root, join(packageDir, file)),
      type: config.type === 'ui' ? 'registry:ui' : 'registry:component',
      target:
        config.type === 'ui'
          ? `components/ui/ugolin/${name}.tsx`
          : `components/blocks/${name}/${file}`,
    })),
    ...(config.category ? { meta: { category: config.category } } : {}),
  };

  const noun = config.category ?? (config.type === 'ui' ? 'component' : 'block');
  const examples = config.examples ?? [
    {
      name,
      title: `${config.title} Demo`,
      description: `Usage example for the ${config.title} ${noun}.`,
    },
  ];

  const demos = examples.map((example, order): RegistryItem => {
    const examplePath = join(examplesDir, `${example.name}.tsx`);
    if (!existsSync(examplePath)) {
      fail(`exemple introuvable : apps/web/examples/${example.name}.tsx`);
    }
    const exampleImports = existsSync(examplePath) ? readImports([examplePath]) : [];

    return {
      name: `${example.name}-demo`,
      type: 'registry:item',
      title: example.title,
      description: example.description,
      dependencies: toNpmDependencies(exampleImports),
      // Un exemple dépend toujours de son item, même s'il n'en importe rien (exemple autonome).
      registryDependencies: [
        ...new Set([`${REGISTRY_URL}/${name}.json`, ...toRegistryDependencies(exampleImports)]),
      ],
      files: [
        {
          path: relative(root, examplePath),
          type: 'registry:component',
          target: `components/examples/${example.name}.tsx`,
        },
      ],
      meta: { example: { of: name, order } },
    };
  });

  return [item, ...demos].map(withArrays);
};

const rank = (item: RegistryItem) =>
  item.type === 'registry:ui' ? 0 : item.meta?.category === 'template' ? 2 : 1;

const groups = readdirSync(packagesDir, { withFileTypes: true })
  .filter(
    (entry) => entry.isDirectory() && existsSync(join(packagesDir, entry.name, 'package.json')),
  )
  .map((entry) => toItems(entry.name))
  .filter((items) => items.length > 0)
  .sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].name.localeCompare(b[0].name));

if (errors.length > 0) {
  console.error(`registry.json non généré :\n${errors.map((error) => `  - ${error}`).join('\n')}`);
  process.exit(1);
}

const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'ugolin',
  homepage: 'https://ugolin-olle.com/ui',
  items: groups.flat(),
};

writeFileSync(outputPath, `${JSON.stringify(registry, null, 2)}\n`);
console.log(`registry.json : ${registry.items.length} items depuis ${groups.length} packages.`);
