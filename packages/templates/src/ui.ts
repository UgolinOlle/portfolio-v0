import { createSpinner } from 'nanospinner';
import pc from 'picocolors';

export const log = {
  info: (message: string) => console.log(`${pc.cyan('›')} ${message}`),
  success: (message: string) => console.log(`${pc.green('✔')} ${message}`),
  warn: (message: string) => console.warn(`${pc.yellow('!')} ${message}`),
  error: (message: string) => console.error(`${pc.red('✖')} ${message}`),
};

export const spinner = (text: string) => createSpinner(text).start();
export { pc };
