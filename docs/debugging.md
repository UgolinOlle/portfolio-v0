# Debugging

## Running locally

```bash
bun install
bun run dev            # turbo dev; apps/web on http://localhost:4000
bun run build          # turbo build (apps/web runs registry:build first)
bun run check-types    # fumadocs-mdx + next typegen + tsc, plus per-package tsc
bun run check          # oxlint && oxfmt --write (this rewrites files)
bun run format         # oxfmt --write
```

`bun run test` runs `turbo test`, but no workspace defines a `test` script yet, so it is a no-op.

Useful single-package commands:

```bash
bun run --cwd packages/ui registry:generate   # regenerate registry.json only
bun run --cwd packages/ui registry:build      # + shadcn build into apps/web/public/r
bun run --cwd packages/ui build               # tsup: dist/<name>.{js,cjs,d.ts}
bun run analyze                               # turbo analyze
```

## Logs and tools

- Next.js and Turbo output in the terminal; no external logging.
- `fumadocs-mdx` generates `.source/` on `postinstall` and `check-types`. If MDX imports (`fumadocs-mdx:collections/server`) fail to resolve, run `bun install` or `bunx fumadocs-mdx` in `apps/web`.
- Vercel Analytics / Speed Insights are wired in the root layout; production only.

## Known issues

| Symptom                                           | Cause                                                                                                                                     | Fix                                                                    |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `registry.json non généré : …`                    | A package violates the item contract (wrong `name`, missing `description` / `index.tsx`, deps not matching imports, missing example file) | Fix the line it names, rerun `registry:generate`                       |
| New package missing from the docs or `/r/`        | Workspace not linked, or no `registry` field in its `package.json`                                                                        | `bun install`, add `registry`, rerun `registry:build`                  |
| Docs page shows no preview/dependencies           | `preview` frontmatter doesn't match a `name` in `registry.json`                                                                           | Use the exact item name                                                |
| `?lang=en` shows French                           | No `<name>.en.mdx` for that page (Fumadocs falls back to the default language)                                                            | Add the English file                                                   |
| Shields.io badge images fail in MDX               | Host not in `images.remotePatterns`                                                                                                       | Allowed in `next.config.mjs` (`img.shields.io`); add other hosts there |
| Stale registry in dev                             | `predev` only runs at startup                                                                                                             | Restart `bun run dev` or run `registry:build`                          |
| `bun run check` modifies many files               | `oxfmt --write` formats in place                                                                                                          | Review `git diff`; use `bun run format` deliberately                   |
| Edit blocked on lockfile / build output / `.env*` | `.claude/hooks/pre-edit.cjs` guardrail                                                                                                    | Change the manifest or source instead                                  |
