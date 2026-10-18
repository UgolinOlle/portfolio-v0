import { listTemplates } from '../registry';
import { log, pc, spinner } from '../ui';

export const list = async (): Promise<void> => {
  const loading = spinner('Fetching templates…');
  try {
    const templates = await listTemplates();
    loading.success({
      text: `${templates.length} template${templates.length === 1 ? '' : 's'} available`,
    });
    const width = Math.max(...templates.map((template) => template.name.length));
    for (const template of templates) {
      console.log(`  ${pc.bold(template.name.padEnd(width))}  ${pc.dim(template.title)}`);
    }
  } catch (error) {
    loading.error({ text: 'Could not fetch the template list' });
    log.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
};
