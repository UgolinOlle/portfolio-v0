# @ugolin-olle/ui

React components and blocks for shadcn/ui, by Ugolin Ollé. Docs and live previews: [ugolin-olle.com/ui](https://ugolin-olle.com/ui).

## Install

```bash
npm install @ugolin-olle/ui
```

Requires React 18.2+ or 19, and Tailwind CSS v4.

```css
/* globals.css */
@import 'tailwindcss';
@import '@ugolin-olle/ui/styles.css';
```

`styles.css` provides the theme tokens (light and `.dark`) and tells Tailwind to scan the package for its classes.

## Use

```tsx
import { Button } from '@ugolin-olle/ui/button';
import { Activity } from '@ugolin-olle/ui/activity';
```

Every item has its own entry point (`@ugolin-olle/ui/<name>`), and the root (`@ugolin-olle/ui`) re-exports all of them. Client components ship with `"use client"`, so they work from React Server Components.

## Prefer owning the code?

The same components are available as a shadcn registry:

```bash
npx shadcn@latest add https://ugolin-olle.com/r/button.json
```

## License

MIT
