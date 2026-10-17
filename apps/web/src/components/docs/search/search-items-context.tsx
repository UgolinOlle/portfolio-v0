'use client';

import { createContext, type ReactNode, useContext } from 'react';

import type { RegistryCategory } from '~/lib/registry';

// The slice of a registry item the search dialog needs. Built on the server (root layout) and
// handed down through context: fumadocs mounts `SearchDialog` as a component reference, so it
// cannot receive props.
export type SearchItem = {
  title: string;
  description?: string;
  href: string;
  category: RegistryCategory;
  featured?: boolean;
};

const SearchItemsContext = createContext<SearchItem[]>([]);

export const SearchItemsProvider = ({
  items,
  children,
}: {
  items: SearchItem[];
  children: ReactNode;
}) => <SearchItemsContext.Provider value={items}>{children}</SearchItemsContext.Provider>;

export const useSearchItems = () => useContext(SearchItemsContext);
