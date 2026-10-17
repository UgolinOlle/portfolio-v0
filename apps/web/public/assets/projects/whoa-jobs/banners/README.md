# Banners

Social and repository banners in the Patient Optics language
([../landing/patient-optics.md](../landing/patient-optics.md)): the headline on the left, a
survey plate on the right where the Jumelles mark, drawn exactly as the logo, looks up and to
the right at a patch of the field and finds a few marks in orange. Every count in the captions is counted from the drawing.

| File                         | Size (1x)  | Where                                        |
| ---------------------------- | ---------- | -------------------------------------------- |
| `github-readme-light.png`    | 1280 × 320 | README header (light)                        |
| `github-readme-dark.png`     | 1280 × 320 | README header (dark, via `<picture>`)        |
| `github-social-preview.png`  | 1280 × 640 | Repository settings, social preview          |
| `open-graph.png`             | 1200 × 630 | `og:image` / `twitter:image` on public pages |
| `x-header.png`               | 1500 × 500 | X profile header                             |
| `linkedin-company-cover.png` | 1128 × 191 | LinkedIn company page cover                  |
| `linkedin-profile-cover.png` | 1584 × 396 | LinkedIn personal profile cover              |

Files are exported at 2x. The X and LinkedIn layouts keep the bottom-left corner clear for the
avatar or page logo.

Regenerate after changing copy or layout:

```bash
uv run --no-project --with pillow python deploy/branding/banners/render.py
```

README header with theme switching:

```html
<picture>
  <source
    media="(prefers-color-scheme: dark)"
    srcset="deploy/branding/banners/github-readme-dark.png"
  />
  <img
    alt="Whoa Jobs: stop refreshing job boards."
    src="deploy/branding/banners/github-readme-light.png"
  />
</picture>
```
