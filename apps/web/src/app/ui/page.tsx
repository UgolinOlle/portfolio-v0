import type { Metadata } from 'next';

import { ConstructionBanner } from '~/components/core/construction-banner';
import { Breadcrumbs } from '~/components/docs/breadcrumbs';
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

const UiIndexPage = () => {
  const sections = getRegistrySections();

  return (
    <>
      <Navbar />
      <Breadcrumbs className="pt-14" />
      <ConstructionBanner />

      <main className="w-full px-4 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8">
        <div className="mb-12 space-y-4">
          <h1 className="text-3xl font-semibold">UI</h1>
          <p className="text-lg text-muted-foreground">
            Une collection de composants, blocks et templates construits avec shadcn/ui, utilisés
            dans ce portfolio.
          </p>
        </div>

        <div className="flex flex-col gap-16">
          {sections.map((section) => (
            <RegistrySection key={section.category} section={section} />
          ))}
        </div>
      </main>
    </>
  );
};

export default UiIndexPage;
