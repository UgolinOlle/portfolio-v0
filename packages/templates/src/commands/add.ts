import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { templateExists, templateUrl, listTemplates, NAME_PATTERN } from '../registry';
import { runShadcn } from '../shadcn';
import { log, pc, spinner } from '../ui';

export type AddOptions = { overwrite?: boolean; cwd?: string; yes?: boolean };

const printAvailable = async (): Promise<void> => {
  try {
    const templates = await listTemplates();
    log.info(
      `Available templates: ${templates.map((template) => pc.bold(template.name)).join(', ')}`,
    );
  } catch {
    log.info(`Run ${pc.bold('templates list')} to see the available templates.`);
  }
};

export const add = async (names: string[], options: AddOptions): Promise<void> => {
  if (names.length === 0) {
    log.error('Specify at least one template, e.g. templates add app-shell-1');
    await printAvailable();
    process.exitCode = 1;
    return;
  }

  const cwd = resolve(options.cwd ?? process.cwd());
  if (!existsSync(resolve(cwd, 'components.json'))) {
    log.warn(`No components.json in ${cwd}: shadcn is not initialized in this project.`);
    log.info(`Run ${pc.bold('npx shadcn@latest init')} first, then retry.`);
    process.exitCode = 1;
    return;
  }

  const invalid = names.filter((name) => !NAME_PATTERN.test(name));
  if (invalid.length > 0) {
    log.error(`Invalid template name: ${invalid.join(', ')}`);
    await printAvailable();
    process.exitCode = 1;
    return;
  }

  // Check everything up front so a typo does not leave a half-installed set.
  const checking = spinner('Resolving templates…');
  try {
    for (const name of names) {
      if (await templateExists(name)) continue;
      checking.error({ text: `Template "${name}" not found` });
      await printAvailable();
      process.exitCode = 1;
      return;
    }
  } catch (error) {
    checking.error({ text: 'Could not reach the registry' });
    log.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
    return;
  }
  checking.success({ text: `Resolved ${names.join(', ')}` });

  const flags = [
    ...(options.overwrite ? ['--overwrite'] : []),
    ...(options.yes ? ['--yes'] : []),
    ...(options.cwd ? ['--cwd', cwd] : []),
  ];

  for (const name of names) {
    log.info(`Installing ${pc.bold(name)} with shadcn…`);
    const code = await runShadcn(['add', templateUrl(name), ...flags]);
    if (code !== 0) {
      log.error(`shadcn exited with code ${code} while installing "${name}".`);
      process.exitCode = code;
      return;
    }
    log.success(`Installed ${name}`);
  }
};
