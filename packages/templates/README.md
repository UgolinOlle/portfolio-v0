# @whoa-studio/templates

Install Whoa Studio UI templates into a [shadcn/ui](https://ui.shadcn.com) project.

```bash
npx @whoa-studio/templates add app-shell-1
```

The CLI resolves each block to `<registry>/r/<name>.json` and runs `shadcn add <url>` for you (`bunx --bun shadcn@latest` when bun is installed, `npx shadcn@latest` otherwise). Registry dependencies, `components.json` aliases and npm packages are handled by shadcn itself.

## Requirements

- Node 18+
- A project initialized with `npx shadcn@latest init` (a `components.json` must exist). The templates target the `base-nova` (Base UI) shadcn style.

## Commands

| Command                    | Description                     |
| -------------------------- | ------------------------------- |
| `templates add <...names>` | Install one or more templates   |
| `templates list`           | List the available templates    |
| `--overwrite`, `-o`        | (add) overwrite existing files  |
| `--cwd <dir>`, `-c`        | (add) project directory         |
| `--yes`, `-y`              | (add) skip confirmation prompts |
| `--help`, `--version`      |                                 |

An unknown template name prints the list of available templates.

## Environment

| Variable            | Default                   | Description                   |
| ------------------- | ------------------------- | ----------------------------- |
| `WHOA_REGISTRY_URL` | `https://ugolin-olle.com` | Registry origin, without `/r` |

```bash
WHOA_REGISTRY_URL=http://localhost:4000 npx @whoa-studio/templates add app-shell-1
```

## Templates

- `app-shell-1`: responsive app shell (collapsible sidebar with workspace switcher, grouped nav, user menu, sticky header with breadcrumbs and search). Installed to `components/blocks/app-shell-1/`.
- `dashboard-1`: approval inbox dashboard (top nav, stats header, filterable list, detail pane with workflow timeline, budget bar, evidence and actions). Installed to `components/blocks/dashboard-1/`.
- `dashboard-2`: dark CRM dashboard (collapsing sidebar, count-up KPI cards, spring-physics revenue chart with range switching and keyboard tooltips, task rail). Installed to `components/blocks/dashboard-2/`.

## Development

```bash
bun run build          # bun build ./src/index.ts --target node --outdir dist
bun run dev -- list    # run from source
bun run registry:build # shadcn build -> apps/web/public/r
npm publish --access public
```
