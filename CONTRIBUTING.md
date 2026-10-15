# Contributing

## Adding a component or block

`packages/ui/registry.json` is the single source of truth. One entry there is enough for the item to ship through **both** channels: the shadcn registry (`/r/<name>.json`) and the npm package (`@ugolin-olle/ui/<name>`).

1. **Write the source** in `packages/ui/registry/`:
   - components → `registry/components/core/<name>/<name>.tsx`
   - blocks → `registry/blocks/<name>/` (several files are fine; use relative imports between them)
   - Import shared code through the shadcn aliases only: `@/lib/utils` for `cn`, `@/components/ui/<primitive>` for shadcn primitives. The shadcn CLI rewrites these for consumers, and tsup compiles them into the npm package.
   - Add `'use client';` to any file that uses hooks, state, effects or event handlers.

2. **Register it** in `packages/ui/registry.json`. Put the entry file first in `files`, since the npm build uses it as the entry point.

   ```json
   {
     "name": "my-block",
     "type": "registry:block",
     "title": "My Block",
     "description": "One sentence.",
     "dependencies": ["motion"],
     "registryDependencies": ["card"],
     "files": [
       {
         "path": "registry/blocks/my-block/my-block.tsx",
         "type": "registry:component",
         "target": "components/blocks/my-block/my-block.tsx"
       }
     ]
   }
   ```

   - Components use `"type": "registry:ui"`, files `"registry:ui"`, target `components/ui/ugolin/<file>`.
   - Blocks use `"type": "registry:block"`, files `"registry:component"`, target `components/blocks/<name>/<file>`.
   - `dependencies`: every npm package the files import. If it's new, also add it to `dependencies` in `packages/ui/package.json`.
   - `registryDependencies`: shadcn primitives (`card`) or other items from this registry.

3. **Add a demo** in `packages/ui/examples/` and a matching `<name>-demo` entry (`"type": "registry:item"`, `"meta": { "example": { "of": "<name>" } }`). The docs page renders it as the preview.

4. **Add the docs page** in `apps/web/content/{components,blocks,templates}/` with `preview: <name>` in the frontmatter. The shadcn and npm install instructions are generated from the registry.

5. **Check both channels**:

   ```bash
   bun run --cwd apps/web registry:build   # must list your item
   bun run --cwd packages/ui build         # emits dist/<name>.{js,cjs,d.ts}
   ```

## Releasing

```bash
cd packages/ui
npm version <patch|minor|major> --no-git-tag-version
bun run build
bun publish            # not `npm publish`: bun rewrites the `workspace:*` specifiers
```

The registry deploys with the site: `apps/web` rebuilds `public/r/` before every `next build`.
