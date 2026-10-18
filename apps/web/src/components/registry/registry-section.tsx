import { cn } from '@portfolio-v0/shadcn/utils';

import Link from 'next/link';

import { ArrowRightIcon } from '~/components/icons/ui';
import { RegistryGrid } from '~/components/registry/registry-grid';
import { DrawLine, Reveal } from '~/components/registry/reveal';
import type { RegistrySection as RegistrySectionData } from '~/lib/registry';

type RegistrySectionProps = {
  index: number;
  section: RegistrySectionData;
};

export const RegistrySection = ({ index, section }: RegistrySectionProps) => {
  const count = section.items.length;

  return (
    <section className="scroll-mt-(--nav-height)" id={section.category}>
      <header className="relative flex flex-col gap-5 px-6 py-8 sm:flex-row sm:items-end sm:justify-between lg:px-8">
        <DrawLine className="bg-foreground/5" />
        <Reveal className="flex min-w-0 flex-col gap-2">
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
        </Reveal>

        <Reveal className="self-start sm:self-auto" delay={0.1}>
          <Link
            className={cn(
              'label-mono group relative inline-flex h-8 shrink-0 items-center gap-2 self-start',
              'overflow-hidden border border-foreground/10 px-3 text-foreground/70',
              'transition-colors delay-50 duration-200 sm:self-auto',
              'before:absolute before:inset-0 before:origin-left before:scale-x-0',
              'before:bg-foreground before:transition-transform before:duration-250',
              'before:ease-out-strong hover:text-background hover:before:scale-x-100',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            )}
            href={section.href}
          >
            <span className="relative">Tout voir</span>
            <ArrowRightIcon
              aria-hidden="true"
              className="relative size-3.5 transition-transform duration-200 ease-out-strong group-hover:translate-x-0.5"
            />
          </Link>
        </Reveal>
      </header>

      {count > 0 ? (
        <RegistryGrid items={section.items} />
      ) : (
        <div className="flex flex-col gap-1.5 border-b border-foreground/5 px-6 py-12 lg:px-8">
          <p className="label-mono text-foreground">Bientôt disponible</p>
          <p className="text-sm text-foreground/50">
            Les premiers {section.title.toLowerCase()} sont en préparation.
          </p>
        </div>
      )}
    </section>
  );
};
