import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { defineConfig, type Options } from 'tsup';

/*
  `registry.json` (généré depuis `packages/<name>/` par `scripts/registry.ts`) alimente les deux
  canaux de distribution :
  - le registry shadcn (`shadcn build`) copie les fichiers source tels quels ;
  - ce build npm compile les mêmes fichiers, un point d'entrée par item (`@ugolin-olle/ui/<name>`).
  Ajouter un package d'item suffit donc à l'exposer aussi dans le package npm.
*/

type RegistryItem = { name: string; type: string; files: { path: string }[] };

const root = import.meta.dirname;
const packagesRoot = resolve(root, '..');
const shadcnRoot = join(packagesRoot, 'shadcn');
const outDir = join(root, 'dist');

const registry = JSON.parse(readFileSync(join(root, 'registry.json'), 'utf-8')) as {
  items: RegistryItem[];
};

// Le premier fichier d'un item est son point d'entrée (les autres sont ses modules internes).
const entries = registry.items
  .filter((item) => item.type === 'registry:ui' || item.type === 'registry:block')
  .map((item) => ({ name: item.name, file: join(root, item.files[0].path) }));

// Les alias `@/` des sources pointent vers les primitives shadcn vendorisées ou vers les autres
// packages d'items, compilés dans le package (même résolution que `tsconfig.json`).
const aliases: [prefix: string, target: string][] = [
  ['@/components/ui/ugolin/', packagesRoot],
  ['@/components/blocks/', packagesRoot],
  ['@/components/ui/', join(shadcnRoot, 'components/ui')],
];

const resolveImport = (from: string, specifier: string): string | undefined => {
  const alias = aliases.find(([prefix]) => specifier.startsWith(prefix));
  const base = specifier.startsWith('.')
    ? resolve(dirname(from), specifier)
    : specifier === '@/lib/utils'
      ? join(shadcnRoot, 'lib/utils')
      : alias
        ? join(alias[1], specifier.slice(alias[0].length))
        : undefined;

  if (!base) return undefined;
  return ['.tsx', '.ts', '/index.tsx', '/index.ts', ''].map((ext) => base + ext).find(existsSync);
};

// Un point d'entrée est client dès qu'un module de son graphe local l'est : sans `splitting`,
// tout ce graphe finit dans le même fichier, qui doit donc porter la directive. Les primitives
// `@base-ui/react` reposent sur des hooks, elles comptent aussi comme client.
const isClientGraph = (file: string, seen = new Set<string>()): boolean => {
  if (seen.has(file)) return false;
  seen.add(file);

  const source = readFileSync(file, 'utf-8');
  if (/^\s*['"]use client['"]/.test(source)) return true;

  const specifiers = [...source.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((match) => match[1]);
  if (specifiers.some((specifier) => specifier.startsWith('@base-ui/react'))) return true;

  return specifiers.some((specifier) => {
    const resolved = resolveImport(file, specifier);
    return resolved ? isClientGraph(resolved, seen) : false;
  });
};

// Barrel racine : de simples ré-exports vers chaque sous-chemin, pour que chaque module garde
// sa propre directive `"use client"` (un bundle unique la poserait sur tout le package).
const writeRootBarrel = () => {
  const names = entries.map((entry) => entry.name);
  const esm = names.map((name) => `export * from './${name}.js';`).join('\n');
  const cjsTypes = names.map((name) => `export * from './${name}.cjs';`).join('\n');
  const cjs = [
    "'use strict';",
    `for (const mod of [${names.map((name) => `require('./${name}.cjs')`).join(', ')}]) {`,
    '  for (const key of Object.keys(mod)) {',
    "    if (key === 'default' || Object.prototype.hasOwnProperty.call(exports, key)) continue;",
    '    Object.defineProperty(exports, key, { enumerable: true, get: () => mod[key] });',
    '  }',
    '}',
  ].join('\n');

  writeFileSync(join(outDir, 'index.js'), `${esm}\n`);
  writeFileSync(join(outDir, 'index.d.ts'), `${esm}\n`);
  writeFileSync(join(outDir, 'index.cjs'), `${cjs}\n`);
  writeFileSync(join(outDir, 'index.d.cts'), `${cjsTypes}\n`);
};

// `@ugolin-olle/ui/styles.css` : uniquement les tokens de thème des primitives shadcn
// (`:root`, `.dark`, `@theme inline`, variante `dark`), extraits de `globals.css` qui contient
// aussi les styles propres au site. `@source` fait scanner `dist/` par le Tailwind du consommateur.
const writeStyles = () => {
  const css = readFileSync(join(shadcnRoot, 'styles/globals.css'), 'utf-8');
  const blocks: string[] = [];
  const pattern = /^(:root|\.dark|@theme inline)\s*\{/gm;

  for (const match of css.matchAll(pattern)) {
    let depth = 0;
    let end = match.index;
    for (; end < css.length; end++) {
      if (css[end] === '{') depth++;
      if (css[end] === '}' && --depth === 0) break;
    }
    // Les commentaires de `globals.css` décrivent le site, pas le package.
    blocks.push(
      css
        .slice(match.index, end + 1)
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\n\s*\n+/g, '\n'),
    );
  }

  const header = [
    '/* @ugolin-olle/ui — import after `@import "tailwindcss";` */',
    "@source './';",
    '',
    '@custom-variant dark (&:where(.dark, .dark *));',
  ].join('\n');

  writeFileSync(join(outDir, 'styles.css'), `${header}\n\n${blocks.join('\n\n')}\n`);
};

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const shared: Options = {
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: false,
  splitting: false,
  // Pas de `treeshake` : cette passe Rollup supprime la directive `"use client"` du banner.
  // esbuild élimine déjà le code mort à lui seul.
  clean: false,
  target: 'es2022',
  tsconfig: join(root, 'tsconfig.json'),
  outDir,
  // `react/jsx-runtime` n'est pas couvert par les peerDependencies déclarées.
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.js' }),
  esbuildOptions: (options) => {
    options.jsx = 'automatic';
  },
};

const toEntryMap = (list: typeof entries) =>
  Object.fromEntries(list.map((entry) => [entry.name, entry.file]));

const clientEntries = entries.filter((entry) => isClientGraph(entry.file));
const serverEntries = entries.filter((entry) => !clientEntries.includes(entry));

export default defineConfig([
  {
    ...shared,
    entry: toEntryMap(clientEntries),
    banner: { js: '"use client";' },
  },
  {
    ...shared,
    entry: toEntryMap(serverEntries),
    onSuccess: async () => {
      writeRootBarrel();
      writeStyles();
    },
  },
]);
