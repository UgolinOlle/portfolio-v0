import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import { renderToString } from 'react-dom/server';

const dist = join(import.meta.dirname, '../dist');
const require = createRequire(import.meta.url);

test('ESM subpath entries render', async () => {
  const { Button } = await import(join(dist, 'button.js'));
  const { Card, CardTitle } = await import(join(dist, 'card.js'));
  const { Tabs, TabsList, TabsTrigger } = await import(join(dist, 'tabs.js'));

  expect(renderToString(<Button>Go</Button>)).toContain('Go');
  expect(
    renderToString(
      <Card>
        <CardTitle>Title</CardTitle>
      </Card>,
    ),
  ).toContain('Title');
  expect(
    renderToString(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
      </Tabs>,
    ),
  ).toContain('A');
});

test('CJS entry and root barrel resolve', () => {
  expect(typeof require(join(dist, 'button.cjs')).Button).toBe('function');
  expect(typeof require(join(dist, 'index.cjs')).Dialog).toBe('function');
});

test('"use client" survives on client entries only', () => {
  for (const name of ['button', 'dialog', 'tabs', 'sidebar']) {
    expect(readFileSync(join(dist, `${name}.js`), 'utf-8').startsWith('"use client"')).toBe(true);
  }
  expect(readFileSync(join(dist, 'card.js'), 'utf-8').startsWith('"use client"')).toBe(false);
});

test('no Radix in the output', () => {
  const css = readFileSync(join(dist, 'styles.css'), 'utf-8');
  expect(css).toContain('@source');
  for (const name of ['button', 'dialog', 'select']) {
    expect(readFileSync(join(dist, `${name}.js`), 'utf-8')).not.toContain('@radix-ui');
  }
});
