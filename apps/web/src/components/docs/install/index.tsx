import { Badge } from '@portfolio-v0/shadcn/components/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@portfolio-v0/shadcn/components/tabs';
import { cn } from '@portfolio-v0/shadcn/utils';

import { RegistryCodeBlock } from '~/components/docs/code-block/registry-code-block';
import { CopyButton } from '~/components/docs/copy-button';
import { CodeIcon, TerminalIcon } from '~/components/icons/ui';
import { getRegistryInstallCommand } from '~/lib/registry';
import { getRegistryItemManifest } from '~/lib/registry-item';

type RegistryInstallProps = {
  // Nom de l'item dans `registry.json`, identique au `path` passé à `Preview`.
  path: string;
  className?: string;
};

export const RegistryInstall = async ({ path, className }: RegistryInstallProps) => {
  const manifest = await getRegistryItemManifest(path);
  const command = getRegistryInstallCommand(manifest.name);

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Tabs defaultValue="cli">
        <TabsList>
          <TabsTrigger value="cli">
            <TerminalIcon className="text-muted-foreground" size={14} />
            CLI
          </TabsTrigger>
          <TabsTrigger value="manual">
            <CodeIcon className="text-muted-foreground" size={14} />
            Manuel
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cli">
          <div className="flex items-center justify-between gap-3 overflow-x-auto rounded-lg border bg-muted/40 px-4 py-2.5">
            <code className="font-mono text-sm whitespace-nowrap text-foreground">{command}</code>
            <CopyButton className="shrink-0" value={command} />
          </div>
        </TabsContent>
        <TabsContent value="manual">
          {/* Code complet de l'item (tous les fichiers), directement depuis le registry — pas
          d'exemple d'usage ici, cf. `RegistryDemo` pour le code de la preview. */}
          <RegistryCodeBlock files={manifest.files} />
        </TabsContent>
      </Tabs>
      {manifest.registryDependencies && manifest.registryDependencies.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          Dépendances :
          {manifest.registryDependencies.map((dependency) => (
            <Badge className="text-[10px]" key={dependency} variant="secondary">
              {dependency}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
