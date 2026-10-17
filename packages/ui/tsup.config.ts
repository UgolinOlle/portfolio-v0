import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { defineConfig, type Options } from 'tsup';

/*
  `@whoa-studio/ui` : les primitives shadcn (style `base-nova`, Base UI uniquement) vendorisées dans
  `packages/shadcn/components/ui`, compilées en un point d'entrée par composant
  (`@whoa-studio/ui/<name>`) plus un barrel racine. Les items du registry shadcn (`registry.json`)
  restent distribués par `shadcn build` et ne passent pas par ce build.
*/

const root = import.meta.dirname;
const shadcnRoot = join(resolve(root, '..'), 'shadcn');
const componentsDir = join(shadcnRoot, 'components/ui');
const outDir = join(root, 'dist');

const entries = readdirSync(componentsDir)
  .filter((file) => file.endsWith('.tsx'))
  .map((file) => ({ name: file.replace(/\.tsx$/, ''), file: join(componentsDir, file) }))
  .sort((a, b) => a.name.localeCompare(b.name));

// Les sources importent leurs voisines via `@portfolio-v0/shadcn/...` ou `~/...` (voir `tsconfig.json`).
const resolveImport = (from: string, specifier: string): string | undefined => {
  const base = specifier.startsWith('.')
    ? resolve(dirname(from), specifier)
    : specifier.startsWith('@portfolio-v0/shadcn/')
      ? join(shadcnRoot, specifier.slice('@portfolio-v0/shadcn/'.length))
      : specifier.startsWith('~/')
        ? join(shadcnRoot, specifier.slice(2))
        : undefined;

  if (!base) return undefined;
  return ['.tsx', '.ts', '/index.tsx', '/index.ts', ''].map((ext) => base + ext).find(existsSync);
};

// Bibliothèques tierces qui reposent sur des hooks ou du contexte React : toute entrée qui les
// importe est un composant client.
const CLIENT_PACKAGES = [
  '@base-ui/react',
  'cmdk',
  'embla-carousel-react',
  'input-otp',
  'motion',
  'next-themes',
  'react-day-picker',
  'react-resizable-panels',
  'recharts',
  'sonner',
  'vaul',
];

// Sans `splitting`, tout le graphe local d'un point d'entrée finit dans le même fichier : il porte
// la directive dès qu'un module de ce graphe est client.
const isClientGraph = (file: string, seen = new Set<string>()): boolean => {
  if (seen.has(file)) return false;
  seen.add(file);

  const source = readFileSync(file, 'utf-8');
  if (/^\s*['"]use client['"]/.test(source)) return true;

  const specifiers = [...source.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((match) => match[1]);
  if (specifiers.some((s) => CLIENT_PACKAGES.some((pkg) => s === pkg || s.startsWith(`${pkg}/`)))) {
    return true;
  }

  return specifiers.some((specifier) => {
    const resolved = resolveImport(file, specifier);
    return resolved ? isClientGraph(resolved, seen) : false;
  });
};

// Barrel racine : de simples ré-exports, pour que chaque module garde sa propre directive.
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

// `@whoa-studio/ui/styles.css` : uniquement les tokens de thème des primitives (`:root`, `.dark`,
// `@theme inline`, variante `dark`), extraits de `globals.css` qui contient aussi les styles du
// site. `@source` fait scanner `dist/` par le Tailwind du consommateur.
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
    blocks.push(
      css
        .slice(match.index, end + 1)
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\n\s*\n+/g, '\n'),
    );
  }

  const header = [
    '/* @whoa-studio/ui — import after `@import "tailwindcss";` */',
    "@import 'tw-animate-css';",
    "@import 'shadcn/tailwind.css';",
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
  // Les dépendances et peerDependencies du package sont externalisées par tsup ; `react/jsx-runtime`
  // n'est couvert par aucune des deux.
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
