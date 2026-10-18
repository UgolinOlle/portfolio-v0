export const DEFAULT_REGISTRY_URL = 'https://ugolin-olle.com';

/** Registry origin: `WHOA_REGISTRY_URL` when set, without trailing slashes. */
export const getRegistryUrl = (): string =>
  (process.env.WHOA_REGISTRY_URL?.trim() || DEFAULT_REGISTRY_URL).replace(/\/+$/, '');
