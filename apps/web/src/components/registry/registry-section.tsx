import Link from 'next/link';

import { ArrowRightIcon } from '~/components/icons/ui';
import { RegistryGrid } from '~/components/registry/registry-grid';
import type { RegistrySection as RegistrySectionData } from '~/lib/registry';

type RegistrySectionProps = {
  section: RegistrySectionData;
};

export const RegistrySection = ({ section }: RegistrySectionProps) => {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-medium tracking-tight">{section.title}</h2>
          <p className="mt-1 text-sm text-pretty text-muted-foreground">{section.description}</p>
        </div>

        <Link
          className="group flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          href={section.href}
        >
          Tout voir
          <ArrowRightIcon
            aria-hidden="true"
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {section.items.length > 0 ? (
        <RegistryGrid items={section.items} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed py-14 text-center">
          <p className="text-sm font-medium">Bientôt disponible</p>
          <p className="text-xs text-muted-foreground">
            Les premiers {section.title.toLowerCase()} sont en préparation.
          </p>
        </div>
      )}
    </section>
  );
};
