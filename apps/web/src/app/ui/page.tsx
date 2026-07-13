import { ArrowRight, Blocks, LayoutGrid, LayoutTemplate } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Navbar } from '~/components/docs/navbar';
import { blocksSource, componentsSource, templatesSource } from '~/lib/source';

export const metadata: Metadata = {
  title: 'UI',
  description:
    'Composants, blocks et templates construits avec shadcn/ui, utilisés dans ce portfolio.',
};

const UiIndexPage = () => {
  const sections = [
    {
      title: 'Components',
      description: "Des éléments d'interface unitaires, prêts à copier-coller dans vos projets.",
      href: '/ui/components',
      count: componentsSource.getPages().length,
      icon: LayoutGrid,
    },
    {
      title: 'Blocks',
      description:
        'Des sections de page complètes (hero, blog, footer...) pour composer rapidement.',
      href: '/ui/blocks',
      count: blocksSource.getPages().length,
      icon: Blocks,
    },
    {
      title: 'Templates',
      description: 'Des pages entières prêtes à déployer pour lancer votre prochain projet.',
      href: '/ui/templates',
      count: templatesSource.getPages().length,
      icon: LayoutTemplate,
    },
  ];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pt-32 pb-20">
        <div className="mb-12 space-y-4">
          <h1 className="text-3xl font-semibold">UI</h1>
          <p className="text-lg text-muted-foreground">
            Une collection de composants, blocks et templates construits avec shadcn/ui, utilisés
            dans ce portfolio.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link
              className="group flex flex-col gap-6 rounded-xl border p-6 transition-colors hover:bg-accent/50"
              href={section.href}
              key={section.href}
            >
              <div className="flex items-center justify-between">
                <section.icon className="size-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {section.count} {section.count > 1 ? 'items' : 'item'}
                </span>
              </div>
              <div>
                <h2 className="flex items-center gap-1 text-xl font-medium">
                  {section.title}
                  <ArrowRight className="size-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export default UiIndexPage;
