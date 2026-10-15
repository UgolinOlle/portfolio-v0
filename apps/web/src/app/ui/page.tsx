import { cn } from '@portfolio-v0/shadcn/utils';

import type { Metadata } from 'next';

import { MAIN_CONTENT_ID } from '~/components/core/skip-link';
import { InstallCommand } from '~/components/docs/install/install-command';
import { Navbar } from '~/components/docs/navbar';
import { RegistrySection } from '~/components/registry';
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
    <>
      <Navbar variant="index" />

      <div className="grid min-h-dvh pt-(--nav-height) md:grid-cols-[var(--docs-sidebar-width)_minmax(0,1fr)]">
        <aside className="border-b border-foreground/5 md:border-e md:border-b-0">
          <div className="flex flex-col md:sticky md:top-(--nav-height)">
            <header className="flex flex-col gap-3 border-b border-foreground/5 px-4 py-8">
              <p className="label-mono text-foreground/45">Registre</p>
              <div className="flex items-center gap-2.5">
                <h1 className="text-[2rem] leading-tight font-semibold tracking-tight">Whoa UI</h1>
                <span className="label-mono border border-foreground/15 px-1.5 py-0.5 text-foreground/60">
                  Bêta
                </span>
              </div>
              <p className="text-sm text-pretty text-foreground/60">
                Des composants, blocks et templates construits avec shadcn/ui et Tailwind CSS. Ceux
                que j’utilise sur ce portfolio et en mission, à installer en une commande.
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
          </div>
        </aside>

        <div className="min-w-0" id={MAIN_CONTENT_ID}>
          {sampleItem?.preview && (
            <section
              aria-label="Installer un exemple"
              className="flex flex-col gap-3 border-b border-foreground/5 px-6 py-8 lg:px-8"
            >
              <p className="label-mono text-foreground/45">
                Essayer
                <span aria-hidden="true" className="px-2 text-foreground/25">
                  /
                </span>
                {sampleItem.title}
              </p>
              <div className="max-w-3xl">
                <InstallCommand commands={getRegistryInstallCommands(sampleItem.preview)} />
              </div>
            </section>
          )}
          {sections.map((section, index) => (
            <RegistrySection index={index + 1} key={section.category} section={section} />
          ))}
        </div>
      </div>
    </>
  );
};

export default UiIndexPage;
