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
    ├── ui/           # @ugolin-olle/ui: component source, registry.json, npm build
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

### 2. npm package: import a compiled dependency

```bash
npm install @ugolin-olle/ui
```

```css
/* globals.css */
@import 'tailwindcss';
@import '@ugolin-olle/ui/styles.css';
```

```tsx
import { Button } from '@ugolin-olle/ui/button';
import { UsageCard } from '@ugolin-olle/ui/usage-card';
```

Requires React 18.2+ or 19, and Tailwind CSS v4. `styles.css` ships the theme tokens and registers the package's classes with Tailwind. Each item is also re-exported from the root (`@ugolin-olle/ui`), but subpath imports keep bundles smallest.

Adding a component: see [CONTRIBUTING.md](CONTRIBUTING.md).

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run check-types`: Check TypeScript types across all apps
- `bun run check`: Run Oxlint and Oxfmt
- `bun run --cwd packages/ui build`: Build the `@ugolin-olle/ui` npm package
- `bun run --cwd apps/web registry:build`: Build the shadcn registry JSON into `apps/web/public/r`
