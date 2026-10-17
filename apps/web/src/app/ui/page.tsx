import type { Metadata } from 'next';

import { MAIN_CONTENT_ID } from '~/components/core/skip-link';
import { InstallCommand } from '~/components/docs/install/install-command';
import { Navbar } from '~/components/docs/navbar';
import {
  FilterableSection,
  FilterBar,
  RegistryFilterProvider,
  RegistrySection,
  Reveal,
  ScrollProgress,
  SectionNav,
} from '~/components/registry';
import { createMetadata } from '~/lib/metadata';
import { getRegistryInstallCommands, getRegistrySections } from '~/lib/registry';

export const metadata: Metadata = createMetadata({
  title: 'Whoa UI : composants React pour shadcn/ui',
  description:
    'Composants, blocks et templates React et Next.js construits avec shadcn/ui et Tailwind CSS : code source, previews et installation en une commande.',
  pathname: '/ui',
});

// Same shell as the docs pages: a left rail as wide as the docs sidebar (its border continues
// the navbar's logo divider) and full-bleed, hairline-separated content on the right.
const UiIndexPage = () => {
  const sections = getRegistrySections();
  // Real command for an existing item, so the snippet can be pasted as-is. Prefer the showcased
  // item, so it installs something worth trying.
  const allItems = sections.flatMap((section) => section.items);
  const sampleItem =
    allItems.find((item) => item.featured && item.preview) ?? allItems.find((item) => item.preview);

  return (
    <RegistryFilterProvider>
      <Navbar variant="index" />
      <ScrollProgress />

      <div className="grid min-h-dvh pt-(--nav-height) md:grid-cols-[var(--docs-sidebar-width)_minmax(0,1fr)]">
        <aside className="border-b border-foreground/5 md:border-e md:border-b-0">
          <div className="flex flex-col md:sticky md:top-(--nav-height)">
            <header className="flex flex-col gap-3 border-b border-foreground/5 px-4 py-8">
              <Reveal>
                <p className="label-mono text-foreground/45">Registre</p>
              </Reveal>
              <Reveal delay={0.05}>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-[2rem] leading-tight font-semibold tracking-tight">
                    Whoa UI
                  </h1>
                  <span className="label-mono border border-foreground/15 px-1.5 py-0.5 text-foreground/60">
                    Bêta
                  </span>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-sm text-pretty text-foreground/60">
                  Des composants, blocks et templates construits avec shadcn/ui et Tailwind CSS.
                  Ceux que j’utilise sur ce portfolio et en mission, à installer en une commande.
                </p>
              </Reveal>
            </header>

            <SectionNav
              sections={sections.map((section) => ({
                category: section.category,
                title: section.title,
                count: section.items.length,
              }))}
            />
          </div>
        </aside>

        <div className="min-w-0" id={MAIN_CONTENT_ID}>
          {sampleItem?.preview && (
            <section
              aria-label="Installer un exemple"
              className="flex flex-col gap-3 border-b border-foreground/5 px-6 py-8 lg:px-8"
            >
              <Reveal>
                <p className="label-mono text-foreground/45">
                  Essayer
                  <span aria-hidden="true" className="px-2 text-foreground/25">
                    /
                  </span>
                  {sampleItem.title}
                </p>
              </Reveal>
              <Reveal className="max-w-3xl" delay={0.1} variant="wipe">
                <InstallCommand commands={getRegistryInstallCommands(sampleItem.preview)} />
              </Reveal>
            </section>
          )}
          <FilterBar
            options={sections.map((section) => ({
              category: section.category,
              title: section.title,
              count: section.items.length,
            }))}
          />
          {sections.map((section, index) => (
            <FilterableSection category={section.category} key={section.category}>
              <RegistrySection index={index + 1} section={section} />
            </FilterableSection>
          ))}
        </div>
      </div>
    </RegistryFilterProvider>
  );
};

export default UiIndexPage;
