'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { TreeContextProvider, useTreePath } from '@fumadocs/base-ui/contexts/tree';
import { useIsScrollTop } from '@fumadocs/base-ui/utils/use-is-scroll-top';
import { usePathname } from 'fumadocs-core/framework';
import Link from 'fumadocs-core/link';
import { type ComponentProps, createContext, type FC, use, useMemo } from 'react';

import {
  baseSlots,
  isLayoutTabActive,
  useLinkItems,
  type LayoutTab,
  type BaseSlots,
  type BaseSlotsProps,
  type LinkItemType,
} from '../shared';

import { Container } from './slots/container';
import { Header } from './slots/header';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
  type SidebarProps,
  type SidebarProviderProps,
} from './slots/sidebar';

import type { DocsLayoutProps } from './index';

export interface DocsSlots extends BaseSlots {
  container: FC<ComponentProps<'div'>>;
  header: FC<ComponentProps<'header'>>;
  sidebar: {
    provider: FC<SidebarProviderProps>;
    root: FC<SidebarProps>;
    trigger: FC<ComponentProps<'button'>>;
    useSidebar: () => { collapsed: boolean; open: boolean; setOpen: (v: boolean) => void };
  };
}

const { useBaseSlots } = baseSlots({
  useProps() {
    return useDocsLayout().props;
  },
});

interface SlotsProps extends BaseSlotsProps<DocsLayoutProps> {
  tabs: LayoutTab[];
  tabMode: NonNullable<DocsLayoutProps['tabMode']>;
}

const LayoutContext = createContext<{
  props: SlotsProps;
  isNavTransparent: boolean;
  navItems: LinkItemType[];
  menuItems: LinkItemType[];
  slots: DocsSlots;
} | null>(null);

export function useIsDocsLayout() {
  return use(LayoutContext) !== null;
}

export function useDocsLayout() {
  const context = use(LayoutContext);
  if (!context)
    throw new Error(
      'Please use <DocsPage /> (`fumadocs-ui/layouts/docs/page`) under <DocsLayout /> (`fumadocs-ui/layouts/docs`).',
    );
  return context;
}

export function LayoutBody(
  props: Omit<DocsLayoutProps, 'tabs'> & {
    tabs: LayoutTab[];
  },
) {
  const {
    nav: { enabled: navEnabled = true, transparentMode: navTransparentMode = 'none' } = {},
    sidebar: { enabled: sidebarEnabled = true, defaultOpenLevel, prefetch, ...sidebarProps } = {},
    slots: defaultSlots,
    tabs,
    tabMode = 'auto',
    tree,
    containerProps,
    children,
  } = props;
  const isTop = useIsScrollTop({ enabled: navTransparentMode === 'top' }) ?? true;
  const isNavTransparent = navTransparentMode === 'top' ? isTop : navTransparentMode === 'always';
  const { baseSlots, baseProps } = useBaseSlots(props);
  const linkItems = useLinkItems(props);
  const slots: DocsSlots = {
    ...baseSlots,
    header: defaultSlots?.header ?? Header,
    container: defaultSlots?.container ?? Container,
    sidebar: defaultSlots?.sidebar ?? {
      provider: SidebarProvider,
      root: Sidebar,
      trigger: SidebarTrigger,
      useSidebar: useSidebar,
    },
  };

  return (
    <TreeContextProvider tree={tree}>
      <LayoutContext
        value={{
          props: {
            tabMode,
            tabs,
            ...baseProps,
          },
          isNavTransparent,
          slots,
          ...linkItems,
        }}
      >
        <slots.sidebar.provider defaultOpenLevel={defaultOpenLevel} prefetch={prefetch}>
          <slots.container {...containerProps}>
            {navEnabled && <slots.header />}
            {sidebarEnabled && <slots.sidebar.root {...sidebarProps} />}
            {tabMode === 'top' && tabs.length > 0 && (
              <LayoutTabs
                tabs={tabs}
                className="bg-fd-background z-10 border-b px-6 pt-3 max-md:hidden xl:px-8"
              />
            )}
            {children}
          </slots.container>
        </slots.sidebar.provider>
      </LayoutContext>
    </TreeContextProvider>
  );
}

function LayoutTabs({
  tabs,
  ...props
}: ComponentProps<'div'> & {
  tabs: LayoutTab[];
}) {
  const pathname = usePathname();
  const path = useTreePath();
  const selected = useMemo(() => {
    return tabs.findLast((option) => isLayoutTabActive(option, path, pathname));
  }, [tabs, path, pathname]);

  return (
    <div
      {...props}
      className={cn(
        'flex flex-row items-end gap-6 overflow-auto [grid-area:main]',
        props.className,
      )}
    >
      {tabs.map((tab, i) => (
        <Link
          key={i}
          href={tab.url}
          className={cn(
            'text-fd-muted-foreground hover:text-fd-accent-foreground inline-flex items-center gap-2 border-b-2 border-transparent pb-1.5 text-sm font-medium text-nowrap transition-colors',
            tab.unlisted && selected !== tab && 'hidden',
            selected === tab && 'border-fd-primary text-fd-primary',
          )}
        >
          {tab.title}
        </Link>
      ))}
    </div>
  );
}
