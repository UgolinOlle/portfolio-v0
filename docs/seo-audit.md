# SEO audit — ugolin-olle.com

_Audited 2026-10-14 against the `stable` branch and the live production site (`https://www.ugolin-olle.com`)._

Impact: **High / Medium / Low** (expected effect on indexing and ranking). Effort: **S** (< 1h), **M** (1–4h), **L** (half a day or more).

---

## 1. Context

### Stack and rendering

- **Next.js 16.2 (App Router), React 19**, deployed on Vercel. Bun + Turbo monorepo; the site is `apps/web`.
- Content is MDX via **Fumadocs** (`content/projects`, `content/writings`, `content/components|blocks|templates`).
- i18n is **client-side**: `react-i18next` with the language kept in `localStorage`. The server always renders French. For projects and writings only, EN content is served at `?lang=en`.
- Rendering per route (from `next build`):

| Route                                                  | Mode                           | Purpose                                                                     |
| ------------------------------------------------------ | ------------------------------ | --------------------------------------------------------------------------- |
| `/`                                                    | Static                         | Home page: bio, experience, projects, recent writings, stack, gear, contact |
| `/projects/[slug]`                                     | Dynamic (reads `searchParams`) | Case studies: whoa-stash, neovim, 42 (+ whoa-jobs, not deployed yet)        |
| `/writings`                                            | Dynamic                        | Article index                                                               |
| `/writings/[...slug]`                                  | Dynamic                        | Articles (ai/ai-begin, ai/transformer)                                      |
| `/inspirations`                                        | Static                         | Design inspirations list                                                    |
| `/ui`, `/ui/{components,blocks,templates}/…`           | SSG / ISR 1d                   | shadcn-style component registry docs                                        |
| `/og/docs/…`                                           | SSG                            | Generated OG images for the registry only                                   |
| `/llms.txt`, `/llms-full.txt`, `/llms.mdx/…`           | Static                         | LLM-facing text                                                             |
| `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` | Static                         | Crawl files                                                                 |

All page **text is in the server HTML** (client components are SSR'd), so crawlers can read it. The problems are about how the HTML is structured and when it becomes visible, not about missing content.

### Positioning and keyword targets

**Decision (2026-10-14): freelance full-stack developer** (Next.js / React / NestJS, SaaS and landing pages). Before the audit, the metadata targeted freelance clients while the about copy targeted an apprenticeship search.

Keyword targets:

1. **Branded:** "Ugolin Ollé", "Ugolin Olle". The most winnable and highest-value target.
2. **Role:** "développeur full stack freelance", "développeur Next.js freelance". Competitive, so this needs authority (backlinks) and real case-study content.
3. **Long-tail through content:** writings and project case studies (e.g. "configuration neovim typescript", "whoa stash macos").

---

## 2. Findings (prioritized)

### High impact

| #   | Issue                                                                                                                                                                                                                                           | Evidence                                                                          | Fix                                                                                                                                               | Effort          |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| H1  | **Canonical host conflict.** The apex domain 308-redirects to `www`, but every canonical tag, `og:url`, sitemap `<loc>` and `robots.txt` sitemap URL points to the **apex**.                                                                    | `curl -I https://ugolin-olle.com/` → `308 location: https://www.ugolin-olle.com/` | Apex stays canonical in code. `WEBSITE_URL` derives from `siteConfig.url`. **Vercel → Domains: make the apex primary and redirect `www` → apex.** | S               |
| H2  | **The home page has no `<h1>`.** Headings start at `h3` and jump to `h4`. Your name is only a link.                                                                                                                                             | Live HTML: `h1` count = 0                                                         | Name + role as `<h1>` on `/`. Section titles become `h2`, items `h3`.                                                                             | S               |
| H3  | **Projects and writings are missing from the sitemap.**                                                                                                                                                                                         | 16 URLs, none under `/projects` or `/writings`                                    | Add them, with `lastModified` and `fr`/`en` alternates.                                                                                           | S               |
| H4  | **EN variants can't be indexed.** `?lang=en` declares the FR URL as canonical. No `hreflang` anywhere.                                                                                                                                          | `/projects/neovim?lang=en` → `canonical …/projects/neovim`                        | Self-canonical for `?lang=en` + `hreflang fr/en/x-default`.                                                                                       | S               |
| H5  | **LCP is held back by entrance animations.** Home sections SSR with `opacity:0; filter:blur(8px)` (69 occurrences) until hydration. LCP measured at **3.6s** (bio paragraph). The header subtitle is per-character `<span>`s that start hidden. | `initial="hidden"` in `home-section.tsx`                                          | Above-the-fold content visible from the first paint. Motion below the fold only. Respect `prefers-reduced-motion`.                                | M               |
| H6  | **No structured data.**                                                                                                                                                                                                                         | No `application/ld+json`                                                          | `ProfilePage` + `Person` + `WebSite` on `/`, `BlogPosting` on writings, `CreativeWork` on projects, `BreadcrumbList` on subpages.                 | M               |
| H7  | **Positioning mismatch** between metadata ("freelance SaaS") and on-page copy ("apprenticeship").                                                                                                                                               | `siteConfig` vs `about.description`                                               | Rewrite the header title and about copy (FR + EN) for freelance work.                                                                             | S + your review |
| H8  | **Broken images on project pages.** MDX uses `./assets/*.png`, which resolves to `/projects/assets/…` → 404. The files aren't in the repo.                                                                                                      | `/projects/assets/hero.png` → 404                                                 | Add the assets under `public/projects/<slug>/` and use absolute paths.                                                                            | S + your assets |

### Medium impact

| #   | Issue                                                                                                                                                                | Fix                                                                                   | Effort           |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------- |
| M1  | Weak or generic titles ("Writings" in English on a FR page, "UI", "Inspirations"). The home title is in English on a French page.                                    | Descriptive, language-matched titles and descriptions.                                | S                |
| M2  | No per-page OG images for projects and writings. Writings use `og:type=website` with no publish date.                                                                | `ImageResponse` OG routes. `type: 'article'` + `publishedTime` for writings.          | M                |
| M3  | Heavy JS: 28 chunks, 464 KB transferred / 1.4 MB parsed. `three` + `postprocessing` (PixelBlast) is imported statically in the writings banner and the `/ui` banner. | Lazy-load PixelBlast (`next/dynamic`, `ssr: false`).                                  | M                |
| M4  | Two nested `<main>` on the home page.                                                                                                                                | The inner one becomes a `div`.                                                        | S                |
| M5  | `<img>` without dimensions or lazy loading. Some hotlinked third-party favicons. Decorative images have descriptive alt text.                                        | `width/height`, `loading="lazy"`, `decoding="async"`, `alt=""` for decorative images. | S                |
| M6  | `whoa-stash.mdx` (FR) is written in English. `whoa-stash.en.mdx` has a duplicate `# Whoa Stash` `h1`. `whoa-jobs` has placeholders.                                  | Remove the duplicate `h1`. Translate and finish the content.                          | S + your writing |
| M7  | Footer uses `<a>` instead of `<Link>`, with weak anchor text ("Inspirations list available here.").                                                                  | Descriptive internal links.                                                           | S                |
| M8  | The 404 page is a client component and its title is unreadable in dark mode.                                                                                         | Themed colors, links to the main sections.                                            | S                |

### Low impact

| #   | Issue                                                                              | Fix                                                                       | Effort |
| --- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------ |
| L1  | Social-link arrow SVGs carry `<title>Magnetic Social Link</title>` (announced 4×). | `aria-hidden`, no `<title>`.                                              | S      |
| L2  | The language switcher ("EN") has no `aria-label` or `lang`.                        | Add both.                                                                 | S      |
| L3  | Experience rows are `div tabIndex=0` (empty tab stops).                            | Remove `tabIndex` / use a list.                                           | S      |
| L4  | `public/assets/profile.png` (475 KB) is unused.                                    | Use an optimized photo next to the `h1` (+ `Person.image`), or delete it. | S      |
| L5  | Hardcoded French `aria-label` shows on the EN UI.                                  | Translate it.                                                             | S      |
| L6  | Non-standard `Host:` line in `robots.txt`.                                         | Remove it.                                                                | S      |

### What's already good

Server-rendered HTML, a permissive `robots.txt`, no stray `noindex`, full OG/Twitter tags on every page, self-hosted `next/font` (CLS = 0), responsive at 375px, a real 404 status, and `llms.txt` for AI search.

---

## 3. Implementation plan

**Decisions (2026-10-14):** freelance full-stack positioning. EN = keep `?lang=en` + hreflang. Canonical host = apex `ugolin-olle.com`.

One commit per step. Each ends with `bun run check` + `bun run build` green.

1. `fix(seo): unify canonical host`: H1, L6
2. `feat(seo): complete sitemap`: H3
3. `fix(seo): hreflang for EN variants`: H4
4. `feat(seo): JSON-LD structured data`: H6
5. `fix(seo): heading hierarchy and landmarks`: H2, M4, M6 (duplicate `h1`)
6. `perf: visible-at-first-paint hero, lazy WebGL`: H5, M3
7. `feat(seo): freelance positioning, titles, descriptions, OG images`: H7, M1, M2
8. `fix(a11y): images, labels, 404, links`: M5, M7, M8, L1–L5
9. H8 (images): needs your asset files

---

## 4. Off-page and content work (outside the codebase)

No code change guarantees a #1 ranking. For "Ugolin Ollé" you should rank #1 once the issues above are fixed, because nobody else competes for that name. For "développeur full stack freelance", ranking depends mostly on authority and content:

- **Google Search Console + Bing Webmaster Tools**: verify the domain, submit `/sitemap.xml`, and watch the _Pages_ report after the host fix.
- **Consistent identity (`sameAs`)**: the same name, photo and one-line bio, linking back to the site, on GitHub, LinkedIn, Malt, X and the 42 profile.
- **Backlinks**: OSS READMEs (Whoa UI, dotfiles, Whoa Stash), shadcn registry / "awesome-shadcn" listings, client sites crediting you, guest posts.
- **Malt profile**: for freelance intent, Malt often outranks personal sites. Keep it complete, with reviews and a link to the site.
- **Content**: real case studies (problem, stack, your role, measurable outcome, screenshots) and regular articles are what rank for non-branded queries.
- **Measure**: watch field LCP/INP in Vercel Speed Insights, and check PageSpeed Insights on mobile.
