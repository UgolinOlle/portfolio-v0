import { cn } from '@portfolio-v0/shadcn/utils';

import Link from 'next/link';

import { ArrowRightIcon } from '~/components/icons/ui';
import { RegistryGrid } from '~/components/registry/registry-grid';
import type { RegistrySection as RegistrySectionData } from '~/lib/registry';

type RegistrySectionProps = {
  index: number;
  section: RegistrySectionData;
};

export const RegistrySection = ({ index, section }: RegistrySectionProps) => {
  const count = section.items.length;

  return (
    <section className="scroll-mt-(--nav-height)" id={section.category}>
      <header className="flex flex-col gap-5 border-b border-foreground/5 px-6 py-8 sm:flex-row sm:items-end sm:justify-between lg:px-8">
        <div className="flex min-w-0 flex-col gap-2">
          <p className="label-mono text-foreground/45">
            {String(index).padStart(2, '0')}
            <span aria-hidden="true" className="px-2 text-foreground/25">
              /
            </span>
            {count} {count > 1 ? 'éléments' : 'élément'}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
          <p className="max-w-[60ch] text-sm text-pretty text-foreground/60">
            {section.description}
          </p>
        </div>

        <Link
          className={cn(
            'label-mono group inline-flex h-8 shrink-0 items-center gap-2 self-start border border-foreground/10 px-3 text-foreground/70 transition-colors sm:self-auto',
            'hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          )}
          href={section.href}
        >
          Tout voir
          <ArrowRightIcon
            aria-hidden="true"
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </header>

      {count > 0 ? (
        <RegistryGrid items={section.items} />
      ) : (
        <p className="label-mono border-b border-foreground/5 px-6 py-12 text-foreground/45 lg:px-8">
          Aucun élément pour l'instant
        </p>
      )}
    </section>
  );
};
