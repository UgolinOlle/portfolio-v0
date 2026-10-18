# portfolio-v0

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Husky** - Git hooks for code quality
- **Oxlint** - Oxlint + Oxfmt (linting & formatting)
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun run dev
```

## Git Hooks and Formatting

- Initialize hooks: `bun run prepare`
- Format and lint fix: `bun run check`

## Project Structure

```
portfolio-v0/
├── apps/
│   └── web/          # Next.js + Fumadocs site (http://localhost:4000)
└── packages/
    ├── ui/           # @whoa-studio/ui: component source, registry.json, npm build
    ├── shadcn/       # vendored shadcn/ui primitives, cn helper, theme tokens
    └── config/       # shared TypeScript configs
```

## Using the components

Every component and block lives in `packages/ui/registry/` and is described once in `packages/ui/registry.json`. Both channels below are built from those same files.

### 1. shadcn registry: copy the source into your project

The same mental model as an official shadcn component: you own the code afterwards.

```bash
npx shadcn@latest add https://ugolin-olle.com/r/button.json
```

Or register the namespace once in your `components.json`:

```json
{
  "registries": {
    "@ugolin": "https://ugolin-olle.com/r/{name}.json"
  }
}
```

```bash
npx shadcn@latest add @ugolin/button
```

Components land in `components/ui/ugolin/`, so they never overwrite your own shadcn `button`, `input`, etc. Blocks land in `components/blocks/<name>/`. npm dependencies and the shadcn primitives a block needs (`card`, `badge`, …) are installed automatically.

### 2. npm package: the shadcn/ui primitives, prebuilt

```bash
npm install @whoa-studio/ui
```

```css
/* globals.css */
@import 'tailwindcss';
@import '@whoa-studio/ui/styles.css';
```

```tsx
import { Button } from '@whoa-studio/ui/button';
```

The npm package ships the Base UI shadcn primitives (one subpath per component), not the portfolio's own registry items. See [packages/ui/README.md](packages/ui/README.md) for usage and the Changesets release flow.

Adding a component: see [CONTRIBUTING.md](CONTRIBUTING.md).

## Templates CLI (`@whoa-studio/templates`)

Install a template into any shadcn-initialized project (run `npx shadcn@latest init` first):

```bash
npx @whoa-studio/templates add app-shell-1
npx @whoa-studio/templates list
```

It resolves each name to `${WHOA_REGISTRY_URL}/r/<name>.json` (default `https://ugolin-olle.com`) and delegates to `shadcn add`, so `registryDependencies` and your `components.json` are honoured. See [packages/templates](packages/templates/README.md).

**Add a template**

1. Put the sources in `packages/templates/registry/<template>/` (import shared code through `@/lib/utils` and `@/components/ui/<x>` only; add `'use client';` where needed).
2. Add an item to `packages/templates/registry.json` (`type: registry:block`, explicit `dependencies` and `registryDependencies`, one `files` entry per source with `target: components/blocks/<template>/<file>`).
3. `bun run --cwd packages/templates registry:build`, then check `apps/web/public/r/<template>.json`.

**Run / deploy the registry.** `bun run dev` builds both registries and serves `/r/*.json` on http://localhost:4000. Deploying `apps/web` (Vercel) publishes them; point your own domain at it and use `WHOA_REGISTRY_URL` to override the CLI default.

**Release the CLI.** `bun run --cwd packages/templates build`, then `cd packages/templates && npm publish --access public` (`prepublishOnly` rebuilds). The Changesets release workflow also publishes it when a changeset is merged.

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run check-types`: Check TypeScript types across all apps
- `bun run check`: Run Oxlint and Oxfmt
- `bun run --cwd packages/ui build`: Build the `@whoa-studio/ui` npm package
- `bun run --cwd apps/web registry:build`: Build the shadcn registry JSON into `apps/web/public/r`
