import { cn } from '@portfolio-v0/shadcn/utils';

import Link from 'next/link';
import { Fragment } from 'react';

import { FileTreeCodeBlock } from '~/components/docs/code-block/file-tree-code-block';
import { RegistryCodeBlock } from '~/components/docs/code-block/registry-code-block';
import { ArrowUpRightIcon, ChevronRightIcon } from '~/components/icons/ui';
import {
  getRegistryDemoName,
  getRegistryDependencyHref,
  getRegistryInstallCommands,
} from '~/lib/registry';
import { getRegistryItemManifest } from '~/lib/registry-item';

import { InstallCommand } from './install-command';

type RegistryInstallProps = {
  // Nom de l'item dans `registry.json`, identique au `path` passé à `Preview`.
  path: string;
  // Templates : explorateur de fichiers (fichiers du template + démo) au lieu du code seul.
  explorer?: boolean;
  className?: string;
};

const labelClassName = 'label-mono text-foreground/45';

export const RegistryInstall = async ({
  path,
  explorer = false,
  className,
}: RegistryInstallProps) => {
  const manifest = await getRegistryItemManifest(path);
  const demoManifest = explorer
    ? await getRegistryItemManifest(getRegistryDemoName(path))
    : undefined;
  const dependencies = manifest.registryDependencies ?? [];

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <p className={labelClassName}>Via shadcn — copie le code source</p>
      <InstallCommand commands={getRegistryInstallCommands(manifest.name)} />

      {dependencies.length > 0 && (
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
          <span className={labelClassName}>Requiert</span>
          {dependencies.map((dependency, index) => {
            const { href, external } = getRegistryDependencyHref(dependency);

            return (
              <Fragment key={dependency}>
                {index > 0 && (
                  <span aria-hidden="true" className="text-foreground/25">
                    ·
                  </span>
                )}
                <Link
                  className="inline-flex items-center gap-0.5 font-mono text-[0.8125rem] text-foreground/80 underline decoration-foreground/20 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
                  href={href}
                  {...(external ? { rel: 'noreferrer', target: '_blank' } : {})}
                >
                  {dependency}
                  {external && <ArrowUpRightIcon aria-hidden="true" className="size-3" />}
                </Link>
              </Fragment>
            );
          })}
        </p>
      )}

      {/* Code complet de l'item (tous les fichiers), directement depuis le registry — pas
      d'exemple d'usage ici, cf. `RegistryDemo` pour le code de la preview. */}
      <details className="group border border-foreground/10">
        <summary
          className={cn(
            'flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 transition-colors [&::-webkit-details-marker]:hidden',
            'hover:bg-foreground/3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
            labelClassName,
            'group-open:border-b group-open:border-foreground/10 group-open:text-foreground',
          )}
        >
          <ChevronRightIcon
            aria-hidden="true"
            className="size-3.5 transition-transform group-open:rotate-90"
          />
          Installation manuelle
        </summary>
        {demoManifest ? (
          <div className="h-128">
            <FileTreeCodeBlock files={[...manifest.files, ...demoManifest.files]} />
          </div>
        ) : (
          <RegistryCodeBlock className="border-0" files={manifest.files} />
        )}
      </details>
    </div>
  );
};
