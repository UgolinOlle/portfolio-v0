import type {
  SearchFilters,
  SearchItem,
  SearchItemType,
  SearchTab,
  SearchTone,
  SearchUpdated,
} from './types';

export const SECTION_ORDER: SearchItemType[] = ['chat', 'agent', 'document', 'knowledge'];

export const TAB_TYPES: Record<SearchTab, SearchItemType[]> = {
  all: SECTION_ORDER,
  chats: ['chat'],
  agents: ['agent'],
  documents: ['document', 'knowledge'],
};

export const UPDATED_OPTIONS: SearchUpdated[] = [
  'any',
  'today',
  'yesterday',
  'week',
  'month',
  'year',
];

const MAX_DAYS: Record<SearchUpdated, (days: number) => boolean> = {
  any: () => true,
  today: (days) => days === 0,
  yesterday: (days) => days === 1,
  week: (days) => days <= 7,
  month: (days) => days <= 30,
  year: (days) => days <= 365,
};

export const DEFAULT_FILTERS: SearchFilters = {
  updated: 'any',
  types: [],
  statuses: [],
  mineOnly: false,
};

export function hasActiveFilters(filters: SearchFilters) {
  return (
    filters.updated !== 'any' ||
    filters.types.length > 0 ||
    filters.statuses.length > 0 ||
    filters.mineOnly
  );
}

/** Solid tile (chats, documents) and soft tile (agents) colours per tone. */
export const TONE_SOLID: Record<SearchTone, string> = {
  blue: 'bg-blue-500 text-white',
  orange: 'bg-orange-500 text-white',
  violet: 'bg-violet-500 text-white',
  rose: 'bg-rose-500 text-white',
  emerald: 'bg-emerald-500 text-white',
  sky: 'bg-sky-500 text-white',
  amber: 'bg-amber-500 text-white',
};

export const TONE_SOFT: Record<SearchTone, string> = {
  blue: 'bg-blue-500/12 text-blue-600 dark:text-blue-400',
  orange: 'bg-orange-500/12 text-orange-600 dark:text-orange-400',
  violet: 'bg-violet-500/12 text-violet-600 dark:text-violet-400',
  rose: 'bg-rose-500/12 text-rose-600 dark:text-rose-400',
  emerald: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400',
  sky: 'bg-sky-500/12 text-sky-600 dark:text-sky-400',
  amber: 'bg-amber-500/12 text-amber-600 dark:text-amber-400',
};

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

/** 0 = title match, 1 = description match, -1 = no match. */
function rank(item: SearchItem, query: string) {
  if (!query) return 0;
  if (normalize(item.title).includes(query)) return 0;
  if (item.description && normalize(item.description).includes(query)) return 1;
  return -1;
}

export function filterItems(
  items: SearchItem[],
  { query, tab, filters }: { query: string; tab: SearchTab; filters: SearchFilters },
) {
  const needle = normalize(query.trim());
  const tabTypes = TAB_TYPES[tab];

  return items
    .map((item) => ({ item, rank: rank(item, needle) }))
    .filter(({ item, rank }) => {
      if (rank < 0) return false;
      if (!tabTypes.includes(item.type)) return false;
      if (filters.types.length > 0 && !filters.types.includes(item.type)) return false;
      if (!MAX_DAYS[filters.updated](item.updatedDaysAgo)) return false;
      if (filters.statuses.length > 0 && (!item.status || !filters.statuses.includes(item.status)))
        return false;
      if (filters.mineOnly && !item.mine) return false;
      return true;
    })
    .sort((a, b) => a.rank - b.rank || a.item.updatedDaysAgo - b.item.updatedDaysAgo)
    .map(({ item }) => item);
}

/** Splits `text` around case/accent-insensitive matches of `query`. */
export function splitMatches(text: string, query: string) {
  const needle = normalize(query.trim());
  if (!needle) return [{ text, match: false }];

  // NFD only adds combining marks, so indexes in `normalize(text)` need a map back to `text`.
  const parts: { text: string; match: boolean }[] = [];
  const haystack = normalize(text);
  let cursor = 0;

  if (haystack.length !== text.length) return [{ text, match: false }];

  while (cursor < text.length) {
    const found = haystack.indexOf(needle, cursor);
    if (found === -1) break;
    if (found > cursor) parts.push({ text: text.slice(cursor, found), match: false });
    parts.push({ text: text.slice(found, found + needle.length), match: true });
    cursor = found + needle.length;
  }

  if (cursor < text.length) parts.push({ text: text.slice(cursor), match: false });
  return parts;
}
