import type { Metadata } from 'next';

import { Breadcrumbs } from '~/components/docs/breadcrumbs';
import { Navbar } from '~/components/docs/navbar';
import { RegistrySection } from '~/components/registry';
import { getRegistrySections } from '~/lib/registry';

export const metadata: Metadata = {
  title: 'UI',
  description:
    'Composants, blocks et templates construits avec shadcn/ui, utilisés dans ce portfolio.',
};

const UiIndexPage = () => {
  const sections = getRegistrySections();

  return (
    <>
      <Navbar />
      <Breadcrumbs className="pt-14" />
      <main className="mx-auto max-w-6xl px-4 pt-20 pb-20">
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
