// Fails when a primitive goes back to ad hoc motion. See docs/ui-animation-plan.md and the Motion
// page of the docs site. Add `motion-ok` on a line to allow it deliberately.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..', 'packages', 'shadcn');
const dirs = ['components/ui', 'lib'];

// A class token: preceded by start, whitespace, quote or a variant colon; not followed by more of the name.
const token = (name) => new RegExp(`(?:^|[\\s:'"\`])${name}(?![\\w-])`);

const rules = [
  [token('transition-all'), 'list the properties instead of `transition-all`'],
  [
    token('animate-(?:in|out)'),
    'tw-animate keyframes restart when interrupted: use the recipes in lib/motion/overlay.ts',
  ],
  [
    token('(?:fade|zoom)-(?:in|out)-\\d+'),
    'tw-animate keyframes: use a transition on data-starting-style / data-ending-style',
  ],
  [
    token('slide-(?:in-from|out-to)-[\\w/[\\].-]+'),
    'tw-animate keyframes: use a transition on data-starting-style / data-ending-style',
  ],
  [
    token('ease-in'),
    '`ease-in` makes entrances feel slow: use ease-out-strong (or ease-in-out-strong on screen)',
  ],
  [token('scale-0'), 'never start from scale(0): use --motion-pop-scale with opacity'],
];

const files = dirs.flatMap((dir) =>
  readdirSync(join(root, dir))
    .filter((file) => /\.tsx?$/.test(file))
    .map((file) => join(root, dir, file)),
);

// The portfolio app is held to the cheap, unambiguous rule only: it has its own motion style.
const webRoot = join(import.meta.dirname, '..', 'apps', 'web', 'src');
const webFiles = readdirSync(webRoot, { recursive: true })
  .filter((file) => /\.tsx?$/.test(file))
  .map((file) => join(webRoot, file));
const webRules = rules.slice(0, 1);

const scan = (list, ruleSet, base) =>
  list.flatMap((file) =>
    readFileSync(file, 'utf-8')
      .split('\n')
      .flatMap((line, index) =>
        line.includes('motion-ok')
          ? []
          : ruleSet
              .filter(([pattern]) => pattern.test(line))
              .map(([, message]) => `${file.replace(`${base}/`, '')}:${index + 1}  ${message}`),
      ),
  );

const problems = [...scan(files, rules, root), ...scan(webFiles, webRules, webRoot)];

if (problems.length > 0) {
  console.error(problems.join('\n'));
  process.exit(1);
}
