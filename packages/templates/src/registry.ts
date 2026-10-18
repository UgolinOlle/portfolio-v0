import { getRegistryUrl } from './env';

export type TemplateSummary = {
  name: string;
  title: string;
  description?: string;
  meta?: { example?: unknown };
};

export const NAME_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

export const templateUrl = (name: string): string => `${getRegistryUrl()}/r/${name}.json`;

const fetchJson = async (url: string): Promise<{ status: number; body?: unknown }> => {
  const response = await fetch(url, { headers: { accept: 'application/json' } });
  if (!response.ok) return { status: response.status };
  return { status: response.status, body: await response.json() };
};

/** Templates published by the registry (`/r/templates.json`, a copy of the templates `registry.json`). */
export const listTemplates = async (): Promise<TemplateSummary[]> => {
  const { status, body } = await fetchJson(`${getRegistryUrl()}/r/templates.json`);
  const items = (body as { items?: TemplateSummary[] } | undefined)?.items;
  if (!items) throw new Error(`Could not read the template index (HTTP ${status}).`);
  // Demo items (`meta.example`) only feed the docs site.
  return items
    .filter((item) => !item.meta?.example)
    .map(({ name, title, description }) => ({ name, title, description }));
};

/** `true` when the template exists, `false` on 404; anything else throws. */
export const templateExists = async (name: string): Promise<boolean> => {
  const { status } = await fetchJson(templateUrl(name));
  if (status === 404) return false;
  if (status !== 200) throw new Error(`Registry answered HTTP ${status} for "${name}".`);
  return true;
};
