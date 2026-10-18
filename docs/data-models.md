# Data models

No database. Data is MDX frontmatter, JSON locale files, generated registry JSON and a few typed constants.

## Source of truth

| Data                                                  | Where                                                                              |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| MDX frontmatter schemas                               | `apps/web/source.config.ts` (zod, extends Fumadocs `frontmatterSchema`)            |
| Registry (shadcn + npm)                               | `packages/*/package.json` → `registry`; generated into `packages/ui/registry.json` |
| Site identity, SEO defaults, locales                  | `apps/web/src/lib/metadata.ts` (`siteConfig`, `LOCALES`, `DEFAULT_LOCALE`)         |
| Home page content (experience, projects, stack, gear) | `apps/web/src/lib/data.tsx`                                                        |
| Home page UI strings                                  | `apps/web/src/locales/{en,fr}/common.json`                                         |
| Shared types                                          | `apps/web/src/types/index.ts`                                                      |

## Entities

### Registry docs page (`content/{components,blocks,templates}/**/*.mdx`)

- Purpose: documentation page for one registry item.
- Frontmatter: `title`, `description`, `preview` (name of the registry item), `previewWidth?` (px the block is designed at; scales its grid thumbnail), `previewFit?` (`frame` default, or `fill` to cover the whole preview panel), `featured?` (shown first, twice as wide in `/ui`).
- Invariants: `preview` must match an item `name` in `registry.json`; sidebar order comes from the `meta.json` next to the pages; `index.mdx` pages describe the category and are not items.

### Project (`content/projects/<slug>.mdx` + `<slug>.en.mdx`)

- Purpose: case study shown at `/projects/<slug>`.
- Frontmatter: `title`, `description`, `seoTitle?` (search title when the H1 says too little), `stack?` (string list, only what the page documents), `links?` (`{ label, href: url }[]`).
- Invariants: French file is the default; an English page exists only if `<slug>.en.mdx` exists. List order is in `content/projects/meta.json`.

### Writing (`content/writings/<category>/<slug>.mdx` + `.en.mdx`)

- Purpose: article at `/writings/<category>/<slug>`.
- Frontmatter: `title`, `description`, `date` (string), `category` (string).

### Registry item (`registry.json`, generated)

- Fields: `name`, `type` (`registry:ui` | `registry:block`), `title`, `description`, `dependencies`, `registryDependencies`, `files[{ path, type, target }]`, `meta?` (`category: "template"`, or `example: { of, order }` for demos).
- Templates are not in this file: `packages/templates/registry.json` is hand-written (`registry:block`, explicit `dependencies` / `registryDependencies`, `files[].target` under `components/blocks/<name>/`).
- Relations: each item has one or more `<name>-demo` items (`meta.example.of = name`); `registryDependencies` are shadcn primitive names or `https://ugolin-olle.com/r/<item>.json` URLs, derived from `@/components/...` imports.

## Migrations

None. Content changes are plain file edits. The only generated artefact to keep in sync is `packages/ui/registry.json`: run `bun run --cwd packages/ui registry:generate` (or `registry:build`) after touching any `packages/<item>` and commit the result. Do not hand-edit it.
