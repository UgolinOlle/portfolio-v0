# SEO audit: ugolin-olle.com (portfolio-v0)

Date: 2026-10-22. Scope: `apps/web` (Next.js 16 App Router, Fumadocs). Read-only audit; nothing was fixed.

**Method.** Every finding comes from the source (file:line). I compared it with the dev server at `localhost:4000` (head tags, headings, JSON-LD, status codes, sitemap, robots). The dev server is not a production build, so performance and anything that depends on the real domain are marked **needs live check**.

## Summary

The basics are in good shape: every route sets a unique title, description and self-referencing canonical, hreflang is emitted for the bilingual routes, the sitemap lists every indexable URL (97 entries), and the Person / WebSite / ProfilePage / BlogPosting / BreadcrumbList JSON-LD is well formed. Indexable content is server-rendered even though the sections are client components.

- **Critical: none.** Nothing blocks crawling or indexing.
- **High (6):** `<html lang>` fixed to `fr`, the `?lang=` locale scheme (which makes pages dynamic), a root canonical every route inherits, unoptimized images and missing image dimensions, titles and descriptions that fail length checks on project pages, and no crawlable English home page.
- **Low (13 findings, plus a list of live checks):** structured-data details, sitemap metadata, the 404 head, fonts, heading oddities, and housekeeping.

**Rendering mode (from `bun run build`).** `/`, `/inspirations`, `/ui`, the registry docs, `/sitemap.xml` and `/robots.txt` are static or SSG. `/projects/[slug]`, `/writings` and `/writings/[...slug]` are `ƒ` dynamic (server-rendered per request) because they read `searchParams`. These are the pages that carry the content you most want ranked.

Routes audited: `/`, `/writings`, `/writings/[...slug]`, `/projects/[slug]`, `/inspirations`, `/ui`, `/ui/{components,blocks,templates}/[[...slug]]`, `/llms.txt` and `/llms-full.txt`, `/api/search`, `/og/*`, `/icons/*`, plus `robots.ts`, `sitemap.ts` and `manifest.ts`. There is no `/projects` index (404), by design.

---

## Critical

None found.

---

## High

### H1. `<html lang>` is hardcoded to `fr`, including on English pages

- **File:** `apps/web/src/app/layout.tsx:45`
- **Issue:** `<html lang="fr">` is static. English content (`/writings/...?lang=en`, `/projects/...?lang=en`) is served with `lang="fr"` in the server HTML. Only a client effect changes it after hydration (`components/core/i18n-provider.tsx:27`), which crawlers using the raw HTML do not see. Live check: `/projects/42?lang=en` returns English title, description and H1 inside `<html lang="fr">`. It conflicts with the English canonical/hreflang and hurts screen readers and Bing, which uses `lang` as a signal.
- **Fix:** Make the document language come from the request. The clean fix is real locale subpaths (`/en/projects/...`) with a `[lang]` root segment so `<html lang={lang}>` is set server-side. This also resolves H2. A smaller fix is a route group per locale with its own root layout.

### H2. English versions are keyed on `?lang=en`, and pages read `searchParams`

- **Files:** `apps/web/src/lib/metadata.ts:115-117` (`localizedPath`), `app/writings/[...slug]/page.tsx:19`, `app/projects/[slug]/page.tsx:20`, `app/writings/page.tsx:15`
- **Issue:** Query-parameter locales are the pattern Google recommends against. Canonical, hreflang and sitemap are all self-consistent today (verified live), so this is not broken, but it is fragile. Reading `searchParams` also opts these pages out of static rendering, despite `generateStaticParams` (`writings/[...slug]/page.tsx:44`, `projects/[slug]/page.tsx:46`). See "Rendering mode" below for what the build reports.
- **Fix:** Move to path-based locales (`/en/...`, French stays at the root or moves to `/fr`), keep the hreflang set and sitemap alternates, and add 301s from `?lang=en` to the new URLs. Pages become statically generated and cacheable.

### H3. (FIXED) The root layout sets `canonical: '/'`, and routes that don't override it inherit it

- **File:** `apps/web/src/lib/metadata.ts:63-65`
- **Issue:** Every route that calls `createMetadata` overrides it, so all indexable pages are currently correct (verified live). Any page that doesn't, inherits a canonical pointing at the home page. This already happens on the 404 page: `/nope` and `/projects/nope` render `<link rel="canonical" href="https://ugolin-olle.com">`.
- **Fix:** Remove `alternates.canonical` from `defaultMetadata`. The home page then sets its own canonical in `app/(home)/page.tsx` via `createMetadata({ pathname: '/' ... })`.

### H4. Images bypass `next/image`; large raw files and missing dimensions

- **Files:** `components/sections/projects-section.tsx:52`, `components/sections/works-section.tsx:46`, `components/sections/resources-section.tsx:62`, `components/projects/screenshots.tsx:101,108`, `components/effects/social-preview-card.tsx:22`, `data/projects.tsx:16,35,86,91,158,181`
- **Issue:** All content images are plain `<img>`. `next.config.mjs:11-18` configures AVIF/WebP, sizes and a cache TTL, but almost nothing uses them (`next/image` appears only in `docs/navbar/logo.tsx:12` and `effects/social-links-nav.tsx:42`). `public/assets/projects` weighs 27 MB with PNGs of 2.0 MB (`whoa-jobs/landing-*/00-full-page.png`), 1.4 MB and 1.3 MB (`calyx/*@2x.png`), served as is. `screenshots.tsx:101-118` has no `width`/`height`, so project pages shift layout when screenshots load (CLS). `social-preview-card.tsx:22` also lacks dimensions and lazy loading.
- **Fix:** Use `next/image` with explicit `width`/`height` (or `fill` inside a sized box) and a `sizes` attribute for screenshots and covers. Keep the featured cover `priority`. Re-export the big PNGs as AVIF/WebP at display size. **Needs live check:** LCP and CLS on a production build (Lighthouse / PageSpeed).

### H5. (FIXED, except `colima.en.mdx`, title not yet shortened) Titles and descriptions on project pages fail length checks

- **Files:** `content/projects/*.mdx` frontmatter (line numbers shown)
- **Issue:** The global template appends ` | Ugolin Ollé` (14 chars, `metadata.ts:48`).
  - `calyx.mdx:3` seoTitle is 66 chars (80 rendered) and `calyx.en.mdx:3` 69 (83 rendered). Truncated in SERPs, which Google may rewrite.
  - `calyx.mdx:4` description is 188 chars and `neovim.mdx:4` 234 chars: truncated at about 160.
  - `42.mdx:4` description is 50 chars and `42.en.mdx:4` 48 chars ("Projets réalisés dans le cadre du cursus de la 42."): too short to carry a value proposition.
  - `whoa-jobs.mdx` and `whoa-jobs.en.mdx` have no `seoTitle`, so the title is the bare "Whoa Jobs | Ugolin Ollé".
  - Writings: `colima.mdx:2` title is 56 chars (70 rendered).
- **Fix:** Keep seoTitle ≤ 46 chars so the suffix fits in 60 (for example "Calyx : app de nutrition IA par photo"). Cut descriptions to 140-160 chars. Rewrite the `42` description with what was built and the stack. Add a `seoTitle` for Whoa Jobs.

### H6. The home page has no English version and no hreflang

- **Files:** `apps/web/src/app/(home)/page.tsx`, `components/core/i18n-provider.tsx:11-12` (`LOCALIZED_CONTENT_PATH` covers only projects and writings), `lib/structured-data.ts:54`
- **Issue:** Home copy is translated only on the client, from `localStorage`. `/?lang=en` returns the French page with a French H1 and a canonical to `/` (verified live). The WebSite JSON-LD claims `inLanguage: ['fr','en']` (`structured-data.ts:54`), but there is no crawlable English home. English queries can never land on an English home page.
- **Fix:** Decide whether English home is wanted. If yes, ship it on a real URL (see H2), render it server-side, and add it to hreflang and the sitemap (`sitemap.ts:90`, which currently has no alternates). If not, set `inLanguage: 'fr'` on the WebSite entity.

---

## Low

### L1. 404 head carries two robots tags and the home page's metadata

- **File:** `apps/web/src/app/not-found.tsx:1` (`'use client'`, so it cannot export `metadata`)
- **Issue:** The HTTP status is correct (404, verified for `/nope`, `/projects/nope`, `/ui/components/button`) and Next adds `noindex`. But the head also keeps the root `robots: index, follow` (`metadata.ts:66-78`), giving two conflicting robots tags, plus the home title, description, OG data and canonical. Google resolves it to noindex, so this is cosmetic.
- **Fix:** Split the client part into a child component so `not-found.tsx` can be a server component with `export const metadata = { title: 'Page introuvable', robots: { index: false }, alternates: {} }`.

### L2. Sitemap metadata is thin

- **File:** `apps/web/src/app/sitemap.ts:31-36, 90-93`
- **Issue:** The home page, `/ui`, `/inspirations` and all 3 registry sections have no `lastModified`. `changeFrequency` and `priority` are ignored by Google. The home entry has no hreflang alternates (see H6). Writings use the publish date as `lastModified` (line 81) because no modified date exists.
- **Fix:** Add real `lastModified` (git date or frontmatter `updated`); drop `changeFrequency`/`priority`.

### L3. Article structured data lacks a modified date

- **Files:** `lib/structured-data.ts:113-125`, `lib/metadata.ts:168-170`
- **Issue:** `BlogPosting` has `datePublished` only, and no `dateModified`. `article:author` is the site URL, not a profile or author name. No `article:modified_time`.
- **Fix:** Add an optional `updated` frontmatter field and emit `dateModified` and `article:modified_time`. Use `authors: [siteConfig.name]` or the Person URL deliberately.

### L4. Person JSON-LD details

- **File:** `apps/web/src/lib/structured-data.ts:21, 40-45`
- **Issue:** `email: mailto:hello@...` publishes an address for scrapers. `sameAs` lists x.com, but the UI links `twitter.com/ugolin_olle` (`data/social-links.tsx:51`), and the npm profile in the home page links is missing from `sameAs`. `ProfilePage` (lines 64-72) has no `dateCreated`/`dateModified`, which Google lists for profile-page rich results.
- **Fix:** Drop `email` or use a contact form URL. Align the X URL in both places. Add npm to `sameAs`. Add the profile dates.

### L5. No structured data on the registry docs and `/ui`

- **Files:** `app/ui/page.tsx`, `components/docs/docs-page.tsx`
- **Issue:** None of the 90+ registry pages emit JSON-LD or BreadcrumbList (verified live on `/ui/components/buttons/button`).
- **Fix:** Add `BreadcrumbList` (and `TechArticle` / `SoftwareSourceCode` if wanted) from a shared helper in `structured-data.ts`.

### L6. Multiple H1 elements on `/ui`

- **File:** `apps/web/src/app/ui/page.tsx:49` (page H1 "Whoa UI")
- **Issue:** Live HTML also contains H1s from embedded component previews ("Heading 1", "Where your dreamdesigns come true"). Harmless to ranking, but muddies the outline.
- **Fix:** Render demo headings as `div`/`p` in the preview examples (`apps/web/examples/`), or demote them.

### L7. Inline SVG `<title>` elements in the body

- **Files:** `components/icons/databases.tsx:13,84,100` and sibling icon files, `components/ai/page-actions.tsx:106,129,193`
- **Issue:** Dozens of `<title>…Logo</title>` appear in the home HTML (verified live: "LinkedIn Logo", "Github Light Logo", …). Valid inside SVG, but naive parsers may pick the wrong title, and duplicate Light/Dark variants are both announced.
- **Fix:** Use `aria-hidden="true"` on decorative icons, or keep one accessible label per logo.

### L8. Both Geist fonts are preloaded on every page

- **File:** `apps/web/src/app/layout.tsx:18-26`
- **Issue:** `Geist_Mono` is loaded in the root layout and preloaded sitewide (two `font/woff2` preload `Link` headers on `/`, verified live), but it is only used for code and labels. No explicit `display`.
- **Fix:** `Geist_Mono({ …, preload: false })` and set `display: 'swap'` explicitly. **Needs live check:** font impact on LCP.

### L9. Hero headline animation may delay LCP

- **File:** `apps/web/src/app/global.css:55-66`
- **Issue:** The H1 is split into per-word spans, each animating for 800 ms with a 40 ms stagger (last word starts at about 0.7 s). If the H1 is the LCP element, LCP may land after the animation. Text is in the server HTML, so indexing is unaffected.
- **Fix:** Measure first. If LCP is late, shorten the stagger/duration or keep the first words static. **Needs live check** (Lighthouse on a production build).

### L10. Non-featured project covers are hidden until hydration

- **File:** `apps/web/src/components/sections/projects-section.tsx:56-58`
- **Issue:** `!featured && !loaded && 'opacity-0'` ships non-featured covers invisible in the SSR HTML. Their `alt` is empty (decorative), so there is no text lost, but it adds a JS dependency to image display. Every cover currently points at the same `/assets/background.svg`.
- **Fix:** Drop the JS-gated opacity or use a CSS-only fade-in.

### L11. Default OG image dimensions don't match the file

- **Files:** `lib/metadata.ts:90-91` (declares 1200×630), `public/og.png` (actually 2400×1260)
- **Issue:** Same aspect ratio, so previews render fine; the metadata is simply wrong. The home OG `alt` is just the site name (`metadata.ts:92`).
- **Fix:** Declare 2400×1260 or export a 1200×630 file. Use a descriptive `alt`.

### L12. `keywords` meta and robots housekeeping

- **Files:** `lib/metadata.ts:9-19,51`, `app/robots.ts:7-10`
- **Issue:** `<meta name="keywords">` is ignored by Google and Bing. `robots.txt` allows everything, including `/api/search` and `/og/`.
- **Fix:** Remove `keywords`. Add `disallow: ['/api/']`. Keep `/og/` crawlable (the images are referenced by OG tags).

### L13. Internal linking observations

- **Files:** `components/core/footer.tsx:9-11`, `components/core/site-nav.tsx:11-12`
- **Issue:** No orphans found (all routes in the sitemap are linked from home, nav, footer, or `/ui`). `/inspirations` is reachable only from the footer. There is no `/projects` index, so the breadcrumb goes Home → Project (`structured-data.ts:160`) and projects are linked only from the home grid and "next project" links. Home screenshot alt text is fine (decorative images use `alt=""`, informative ones have alt: `screenshots.tsx` takes `item.alt`).
- **Fix (optional):** A `/projects` index page would give a crawlable hub, a stronger breadcrumb, and a better target for the "Mes projets" heading.

### L14. Things that need a live check (not verifiable from the repo)

- Production domain behavior: HTTPS, www → apex redirect, trailing slash, HSTS, headers/caching (dev returns `Cache-Control: no-cache`).
- Core Web Vitals field and lab data (LCP, CLS, INP) on the deployed site; Vercel Speed Insights is installed (`layout.tsx:51`).
- Search Console: indexation status, sitemap submission, whether `?lang=en` URLs are indexed as intended, rich-result validation of the JSON-LD.
- Social previews on real scrapers (OG and Twitter cards): tags are correct in the HTML, but crawler fetch of `/og/...` was only tested on the dev server (200, `image/png`).

---

## Verified OK

- `robots.ts` points to the sitemap; `sitemap.ts` emits self-referencing hreflang plus `x-default` (verified live in `/sitemap.xml`).
- Title, description, canonical, OG and Twitter tags are unique per route and re-specified in `createMetadata` (`metadata.ts:149-195`), so they are not lost to the shallow-merge behavior.
- Heading hierarchy on `/`, `/writings`, projects and articles is a single H1 then H2/H3 without skips.
- Unknown routes return a real 404, and `notFound()` is used for missing slugs.
- Indexable content (hero, projects, experience, articles) is present in server HTML despite `'use client'` sections.
- JSON-LD: valid graph with `@id` cross-references, `<` escaped (`components/core/json-ld.tsx:11`).
- Per-page OG images exist for projects, articles and docs, plus `/og.png`.

## Suggested order

1. H3 (one line), then H5 (content edits).
2. H4 (images) and L8 / L9 after measuring a production build.
3. H1 + H2 + H6 together as one locale-routing change.
4. The Low items as a batch.
