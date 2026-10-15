// npm-check-updates does not read Bun's `workspaces.catalog`. This script runs it on a temporary
// manifest that holds the catalog as `dependencies`, then writes the bumped versions back.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const rootManifest = new URL('../package.json', import.meta.url);
const root = JSON.parse(readFileSync(rootManifest, 'utf-8'));
const catalog = root.workspaces?.catalog;

if (!catalog) {
  console.error('No workspaces.catalog in package.json');
  process.exit(1);
}

const dir = mkdtempSync(join(tmpdir(), 'bump-catalog-'));
const tempManifest = join(dir, 'package.json');

try {
  writeFileSync(tempManifest, JSON.stringify({ name: 'catalog', dependencies: catalog }));
  execFileSync(
    'bunx',
    ['npm-check-updates', '--packageFile', tempManifest, '-u', ...process.argv.slice(2)],
    { stdio: 'inherit' },
  );
  const bumped = JSON.parse(readFileSync(tempManifest, 'utf-8')).dependencies;
  root.workspaces.catalog = bumped;
  writeFileSync(rootManifest, `${JSON.stringify(root, null, 2)}\n`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
