import { readdirSync } from 'node:fs';
import path from 'node:path';

const APP_DIR = path.join(process.cwd(), 'src', 'app');

const isIgnored = (name: string) => name.startsWith('_') || name.startsWith('@');
const isDynamic = (name: string) => name.startsWith('[');
const isGroup = (name: string) => name.startsWith('(') && name.endsWith(')');

const walk = (dir: string, segments: string[]): string[] => {
  const entries = readdirSync(dir, { withFileTypes: true });
  const routes = entries.some((e) => e.isFile() && /^page\.(tsx|ts|jsx|js|mdx)$/.test(e.name))
    ? ['/' + segments.join('/')]
    : [];

  for (const entry of entries) {
    if (!entry.isDirectory() || isIgnored(entry.name) || isDynamic(entry.name)) continue;
    routes.push(
      ...walk(
        path.join(dir, entry.name),
        isGroup(entry.name) ? segments : [...segments, entry.name],
      ),
    );
  }

  return routes;
};

/** Public routes without dynamic segments, discovered from `src/app/**\/page.tsx`. Build-time only. */
export const getStaticRoutes = (): string[] => [...new Set(walk(APP_DIR, []))].sort();
