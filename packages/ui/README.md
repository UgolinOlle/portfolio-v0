# @whoa-studio/ui

The shadcn/ui component set, built on [Base UI](https://base-ui.com) (no Radix) and Tailwind CSS v4, as a prebuilt, versioned npm package. One subpath export per component, ESM + CJS + types.

## Install

```bash
npm install @whoa-studio/ui
```

Requires React 18.2+ or 19, and Tailwind CSS v4.

## Styles

Prebuilt class names only work if the consumer's Tailwind generates their utilities. `styles.css` does both jobs: it carries the theme tokens (light and `.dark`, plus `tw-animate-css` and `shadcn/tailwind.css`) and an `@source` rule that makes Tailwind scan the package.

```css
/* globals.css */
@import 'tailwindcss';
@import '@whoa-studio/ui/styles.css';
```

Override the CSS variables (`--primary`, `--radius`, …) after the import to theme it.

## Use

```tsx
import { Button } from '@whoa-studio/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@whoa-studio/ui/dialog';
```

The root (`@whoa-studio/ui`) re-exports everything, but subpath imports keep bundles smallest. Client components ship with `"use client"`, so they work from React Server Components.

## Development

```bash
bun run --cwd packages/ui build        # tsup → dist/
bun run --cwd packages/ui check-types
bun run --cwd packages/ui lint:package # publint + are-the-types-wrong
bun run --cwd packages/ui test:smoke   # build, then import and render from dist
```

Components come from `packages/shadcn` (`bun run bump-ui` re-pulls them from the shadcn `base-nova` style); every file in `packages/shadcn/components/ui` becomes an entry. `registry.json` (the shadcn registry of the portfolio's own items) is separate and is not part of this npm package.

## Release

Never edit `version` by hand. Every bump goes through [Changesets](https://github.com/changesets/changesets):

1. In your PR, run `bun run changeset`, pick `@whoa-studio/ui`, the bump type and a summary. Commit the generated file in `.changeset/`.
2. Merge to `stable`. The `Release` workflow opens (or updates) a **chore: version packages** PR that bumps `package.json` and writes `CHANGELOG.md`.
3. Merge that PR. The workflow builds, runs `changeset publish` (npm, with provenance) and pushes the git tag `@whoa-studio/ui@x.y.z`.

### One-time setup

- Create the `whoa-studio` organization on npmjs.com (the scope must exist and you must be a member allowed to publish).
- Create an npm **automation** access token with publish rights and add it as the `NPM_TOKEN` repository secret. (Alternative: configure npm trusted publishing for this repo and workflow, then remove the token.)
- GitHub → Settings → Actions → General: allow GitHub Actions to create pull requests.
- Protect `stable` (require PRs and the `CI` check). The release workflow pushes only the version PR branch and tags.

## License

MIT
