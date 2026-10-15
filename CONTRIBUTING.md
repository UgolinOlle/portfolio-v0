# Contributing

## Adding a component or block

Every item is its own workspace package, kibo-ui style. `packages/ui/registry.json` is **generated** from those packages by `packages/ui/scripts/registry.ts`, and it feeds both channels: the shadcn registry (`/r/<name>.json`) and the npm package (`@ugolin-olle/ui/<name>`). Never edit it by hand.

1. **Create the package** `packages/<name>/`:

   ```
   packages/my-block/
   ├── index.tsx       # entry point (npm entry and the file consumers import)
   ├── *.ts(x)         # blocks only: internal modules, imported relatively
   ├── package.json
   └── tsconfig.json   # { "extends": "@portfolio-v0/config/registry-item.json", "include": [...] }
   ```

   - Import shared code through the shadcn aliases only: `@/lib/utils` for `cn`, `@/components/ui/<primitive>` for shadcn primitives, `@/components/ui/ugolin/<item>` or `@/components/blocks/<item>` for another item of this registry. The shadcn CLI rewrites these for consumers, and tsup compiles them into the npm package.
   - Add `'use client';` to any file that uses hooks, state, effects or event handlers.

2. **Describe it in `package.json`**:

   ```json
   {
     "name": "@portfolio-v0/my-block",
     "version": "0.0.0",
     "private": true,
     "description": "One sentence.",
     "scripts": { "check-types": "tsc --noEmit" },
     "dependencies": {
       "@portfolio-v0/shadcn": "workspace:*",
       "motion": "^12.43.0",
       "react": "^19.2.6",
       "react-dom": "^19.2.6"
     },
     "devDependencies": {
       "@portfolio-v0/config": "workspace:*",
       "@types/react": "^19.2.14",
       "@types/react-dom": "^19.2.3",
       "typescript": "^6.0.3"
     },
     "registry": { "title": "My Block", "type": "block" }
   }
   ```

   - `registry.type`: `ui` (a single `index.tsx`, installed to `components/ui/ugolin/<name>.tsx`) or `block` (installed to `components/blocks/<name>/`). Add `"category": "template"` for a template.
   - `dependencies` must list exactly the npm packages the sources import; the generator fails otherwise. If one is new, also add it to `dependencies` in `packages/ui/package.json`.
   - `registryDependencies` are not written anywhere: they are derived from the `@/components/...` imports.
   - Add `"@portfolio-v0/<name>": "workspace:*"` to `devDependencies` in `packages/ui/package.json`, so Turborepo rebuilds the npm package when the item changes.

3. **Add a demo** in `apps/web/examples/<name>.tsx`. It becomes the `<name>-demo` registry item and the docs preview. For several demos, list them in `registry.examples` (`[{ "name", "title", "description" }]`, in display order), one file per `name`.

4. **Add the docs page** in `apps/web/content/{components,blocks,templates}/` with `preview: <name>` in the frontmatter. The shadcn and npm install instructions are generated from the registry.

5. **Check both channels**:

   ```bash
   bun install                             # links the new workspace package
   bun run --cwd packages/ui registry:build   # regenerates registry.json, must list your item
   bun run --cwd packages/ui build            # emits dist/<name>.{js,cjs,d.ts}
   ```

   Commit the regenerated `packages/ui/registry.json`: the docs site imports it.

## Releasing

```bash
cd packages/ui
npm version <patch|minor|major> --no-git-tag-version
bun run build
bun publish            # not `npm publish`: bun rewrites the `workspace:*` specifiers
```

The registry deploys with the site: `apps/web` rebuilds `public/r/` before every `next build`.

## Updating dependencies

```bash
bun run bump-deps
```

Runs `npm-check-updates` on every workspace, then `scripts/bump-catalog.mjs` for the shared versions in the root `workspaces.catalog` (which `npm-check-updates` does not read), then `bun install`. Review the diff: it also takes major bumps.

`shiki`, `next`, `recharts` and `require-in-the-middle` are excluded from the bump (`-x` in the script) and updated by hand. Add the reason here when you know it.
