import { cn } from '@portfolio-v0/shadcn/utils';

import type { Metadata } from 'next';

import { ConstructionBanner } from '~/components/core/construction-banner';
import { Navbar } from '~/components/docs/navbar';
import { RegistrySection } from '~/components/registry';
import { createMetadata } from '~/lib/metadata';
import { getRegistrySections } from '~/lib/registry';

export const metadata: Metadata = createMetadata({
  title: 'UI',
  description:
    'Composants, blocks et templates construits avec shadcn/ui, utilisés dans ce portfolio : code source, previews et snippets d’installation prêts à copier.',
  pathname: '/ui',
});

// Same shell as the docs pages: a left rail as wide as the docs sidebar (its border continues
// the navbar's logo divider) and full-bleed, hairline-separated content on the right.
const UiIndexPage = () => {
  const sections = getRegistrySections();

  return (
    <>
      <Navbar variant="index" />

      <div className="grid min-h-dvh pt-(--nav-height) md:grid-cols-[var(--docs-sidebar-width)_minmax(0,1fr)]">
        <aside className="border-b border-foreground/5 md:border-e md:border-b-0">
          <div className="flex flex-col md:sticky md:top-(--nav-height)">
            <header className="flex flex-col gap-3 border-b border-foreground/5 px-4 py-8">
              <p className="label-mono text-foreground/45">Registre</p>
              <h1 className="text-[2rem] leading-tight font-semibold tracking-tight">UI</h1>
              <p className="text-sm text-pretty text-foreground/60">
                Une collection de composants, blocks et templates construits avec shadcn/ui,
                utilisés dans ce portfolio.
              </p>
            </header>

            <nav aria-label="Sections">
              <ul>
                {sections.map((section, index) => (
                  <li key={section.category}>
                    <a
                      className={cn(
                        'flex items-center gap-3 border-b border-foreground/5 px-4 py-2.5 text-sm font-medium tracking-wide text-foreground/70 transition-colors',
                        'hover:bg-foreground/3 hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
                      )}
                      href={`#${section.category}`}
                    >
                      <span className="font-mono text-[0.6875rem] text-foreground/35 tabular-nums">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1">{section.title}</span>
                      <span className="font-mono text-[0.6875rem] text-foreground/45 tabular-nums">
                        {String(section.items.length).padStart(2, '0')}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4">
              <ConstructionBanner />
            </div>
          </div>
        </aside>

        <div className="min-w-0" id="main-content">
          {sections.map((section, index) => (
            <RegistrySection index={index + 1} key={section.category} section={section} />
          ))}
        </div>
      </div>
    </>
  );
};

export default UiIndexPage;
