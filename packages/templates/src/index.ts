#!/usr/bin/env node
import { cac } from 'cac';

import pkg from '../package.json' with { type: 'json' };

import { add } from './commands/add';
import { list } from './commands/list';
import { DEFAULT_REGISTRY_URL } from './env';

const cli = cac('templates');

cli
  .command('add [...templates]', 'Add one or more templates to your project through the shadcn CLI')
  .option('-o, --overwrite', 'Overwrite existing files')
  .option('-c, --cwd <cwd>', 'Project directory (defaults to the current one)')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action((templates: string[], options) => add(templates, options));

cli.command('list', 'List the available templates').action(list);

cli.help((sections) => [
  ...sections,
  {
    title: 'Environment',
    body: `  WHOA_REGISTRY_URL  Registry origin (default: ${DEFAULT_REGISTRY_URL})`,
  },
]);
cli.version(pkg.version);

cli.parse(process.argv, { run: false });
if (!cli.matchedCommand && !cli.options.help && !cli.options.version) cli.outputHelp();
else await cli.runMatchedCommand();
