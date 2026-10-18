import { spawn, spawnSync } from 'node:child_process';

const hasBinary = (command: string): boolean =>
  spawnSync(command, ['--version'], { stdio: 'ignore' }).status === 0;

/** `bunx --bun shadcn@latest` when bun is installed, `npx shadcn@latest` otherwise. */
export const shadcnCommand = (): { command: string; args: string[] } =>
  hasBinary('bun')
    ? { command: 'bunx', args: ['--bun', 'shadcn@latest'] }
    : { command: 'npx', args: ['shadcn@latest'] };

/** Runs `shadcn <args>` with inherited stdio (no shell) and resolves with its exit code. */
export const runShadcn = (args: string[]): Promise<number> => {
  const { command, args: base } = shadcnCommand();
  return new Promise((resolve, reject) => {
    const child = spawn(command, [...base, ...args], { stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', (code) => resolve(code ?? 1));
  });
};
