import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export type RegistryItemFile = {
  path: string;
  content: string;
  type: string;
  target?: string;
};

export type RegistryItemManifest = {
  name: string;
  type: string;
  title?: string;
  description?: string;
  files: RegistryItemFile[];
  dependencies?: string[];
  registryDependencies?: string[];
};

// `public/r/<name>.json` est généré par `shadcn build` (cf. registry.json) : c'est la seule
// source de vérité pour le code distribuable et les dépendances d'un item du registry.
export const getRegistryItemManifest = async (name: string): Promise<RegistryItemManifest> => {
  const filePath = join(process.cwd(), 'public', 'r', `${name}.json`);

  const raw = await readFile(filePath, 'utf-8').catch((error: unknown) => {
    throw new Error(
      `Aucun registry item "${name}" trouvé dans public/r/${name}.json. ` +
        `Ajoutez une entrée "${name}" dans registry.json puis relancez "pnpm registry:build".`,
      { cause: error },
    );
  });

  return JSON.parse(raw) as RegistryItemManifest;
};
