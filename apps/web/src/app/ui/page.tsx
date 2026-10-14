import type { Metadata } from 'next';

import { Breadcrumbs } from '~/components/docs/breadcrumbs';
import { CopyButton } from '~/components/docs/copy-button';
import { Navbar } from '~/components/docs/navbar';
import { RegistrySection } from '~/components/registry';
import { createMetadata } from '~/lib/metadata';
import { getRegistryInstallCommand, getRegistrySections } from '~/lib/registry';

export const metadata: Metadata = createMetadata({
  title: 'Whoa UI : composants React pour shadcn/ui',
  description:
    'Composants, blocks et templates React et Next.js construits avec shadcn/ui et Tailwind CSS : code source, previews et installation en une commande.',
  pathname: '/ui',
});

const UiIndexPage = () => {
  const sections = getRegistrySections();
  const counts = sections
    .filter((section) => section.items.length > 0)
    .map((section) => `${section.items.length} ${section.title.toLowerCase()}`)
    .join(' · ');
  // Real command for an existing item, so the snippet can be pasted as-is.
  const allItems = sections.flatMap((section) => section.items);
  // Prefer the showcased item, so the snippet installs something worth trying.
  const sampleItem =
    allItems.find((item) => item.featured && item.preview) ?? allItems.find((item) => item.preview);
  const installCommand = sampleItem?.preview
    ? getRegistryInstallCommand(sampleItem.preview)
    : undefined;

  return (
    <>
      <Navbar />
      <Breadcrumbs className="pt-14" />

      <main className="mx-auto w-full max-w-7xl px-4 pt-28 pb-20 sm:px-6 sm:pt-32 lg:px-8">
        <header className="mb-16 flex max-w-2xl flex-col items-start gap-5">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Whoa UI</h1>
            <span className="rounded-md border px-1.5 py-0.5 font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
              Bêta
            </span>
          </div>

          <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
            Des composants, blocks et templates construits avec shadcn/ui et Tailwind CSS. Ceux que
            j’utilise sur ce portfolio et en mission, à installer en une commande.
          </p>

          {counts && <p className="font-mono text-xs text-muted-foreground">{counts}</p>}

          {installCommand && (
            <div className="flex w-full max-w-full items-center gap-2 rounded-lg border bg-muted/40 py-1.5 pr-1.5 pl-3">
              <code className="min-w-0 flex-1 truncate font-mono text-xs sm:text-sm">
                {installCommand}
              </code>
              <CopyButton className="shrink-0" value={installCommand} />
            </div>
          )}
        </header>

        <div className="flex flex-col gap-20">
          {sections.map((section) => (
            <RegistrySection key={section.category} section={section} />
          ))}
        </div>
      </main>
    </>
  );
};

export default UiIndexPage;
