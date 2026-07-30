'use client';
import { buttonVariants } from '@portfolio-v0/shadcn/components/button';
import { Popover, PopoverContent, PopoverTrigger } from '@portfolio-v0/shadcn/components/popover';
import { cn } from '@portfolio-v0/shadcn/utils';

import { useTreePath } from '@fumadocs/base-ui/contexts/tree';
import { cva } from 'class-variance-authority';
import { usePathname } from 'fumadocs-core/framework';
import Link from 'fumadocs-core/link';
import { Check, ChevronDown, ChevronsUpDown, Languages, SidebarIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { type ComponentProps, type ReactNode, useMemo, useState } from 'react';

import * as Base from '~/components/docs/sidebar/base';
import { createLinkItemRenderer } from '~/components/docs/sidebar/link-item';
import {
  createPageTreeRenderer,
  type SidebarPageTreeComponents,
} from '~/components/docs/sidebar/page-tree';
import { LinkItem, isLayoutTabActive, type LayoutTab } from '~/layouts/shared';
import { mergeRefs } from '~/lib/merge-refs';

import { useDocsLayout } from '../client';

const itemVariants = cva(
  'relative flex flex-row items-center gap-2 rounded-xl p-2 text-start text-fd-muted-foreground wrap-anywhere transition-colors duration-150 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        link: 'hover:bg-fd-accent/60 hover:text-fd-accent-foreground data-[active=true]:bg-fd-primary/[0.08] data-[active=true]:text-fd-primary data-[active=true]:font-medium',
        button: 'hover:bg-fd-accent/60 hover:text-fd-accent-foreground',
      },
    },
  },
);

// Category headers are static section labels — a classic, always-expanded sidebar layout
// (no folder/file-tree affordance, no click-to-toggle, no chevron).
const folderHeaderVariants = cva(
  cn(
    'relative flex w-full items-center gap-2 px-2 py-1.5 text-start text-[13px]',
    'text-fd-muted-foreground/90 font-medium',
    '[&_svg]:text-fd-muted-foreground/70 [&_svg]:size-3.5 [&_svg]:shrink-0',
  ),
  {
    variants: {
      // only used when the category itself is a navigable link (has an index page)
      interactive: {
        true: 'cursor-pointer rounded-md transition-colors duration-150 hover:text-fd-foreground',
      },
      active: {
        true: 'text-fd-primary [&_svg]:text-fd-primary/70',
      },
    },
  },
);

function ActiveIndicator() {
  return (
    <motion.span
      className="bg-fd-primary absolute inset-y-2.5 inset-s-1 w-1 rounded-full shadow-[0_0_6px_-1px_var(--color-fd-primary)]"
      layoutId="sidebar-active-indicator"
      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
    />
  );
}

export interface SidebarProps extends ComponentProps<'aside'> {
  components?: Partial<SidebarPageTreeComponents>;
  banner?: ReactNode;
  footer?: ReactNode;
}

export type SidebarProviderProps = Base.SidebarProviderProps;

export const { useSidebar } = Base;

export function SidebarProvider(props: SidebarProviderProps) {
  return <Base.SidebarProvider {...props} />;
}

export function Sidebar({ footer, banner, components, ...rest }: SidebarProps) {
  const {
    menuItems,
    slots,
    props: { tabs, nav, tabMode },
  } = useDocsLayout();
  const iconLinks = menuItems.filter((item) => item.type === 'icon');
  const viewport = (
    <Base.SidebarViewport>
      <div className="flex flex-col gap-0.5">
        {menuItems
          .filter((v) => v.type !== 'icon')
          .map((item, i, list) => (
            <SidebarLinkItem key={i} item={item} className={cn(i === list.length - 1 && 'mb-4')} />
          ))}
        <SidebarPageTree {...components} />
      </div>
    </Base.SidebarViewport>
  );

  return (
    <>
      <SidebarContent {...rest}>
        <div className="flex flex-col gap-3 p-4 pb-2">
          <div className="flex">
            {slots.navTitle && (
              <slots.navTitle className="me-auto inline-flex items-center gap-2.5 text-[0.9375rem] font-medium" />
            )}
            {nav?.children}
          </div>
          {slots.searchTrigger && <slots.searchTrigger.full hideIfDisabled />}
          {tabs.length > 0 && tabMode === 'auto' && <SidebarTabsDropdown tabs={tabs} />}
          {banner}
        </div>
        {viewport}
        {(slots.languageSelect || iconLinks.length > 0 || slots.themeSwitch || footer) && (
          <div className="flex flex-col p-4 pt-2">
            {slots.languageSelect && (
              <slots.languageSelect.root
                variant="secondary"
                className="text-fd-muted-foreground bg-fd-secondary/50 mb-2 justify-start text-start"
              >
                <Languages className="size-4.5" />
                <slots.languageSelect.text />
                <ChevronDown className="ms-auto size-3.5" />
              </slots.languageSelect.root>
            )}
            <div className="text-fd-muted-foreground bg-fd-secondary/50 flex items-center rounded-lg border p-0.5 pe-0 empty:hidden">
              {iconLinks.map((item, i) => (
                <LinkItem
                  key={i}
                  item={item}
                  className={cn(buttonVariants({ size: 'icon-sm', variant: 'ghost' }))}
                  aria-label={item.label}
                >
                  {item.icon}
                </LinkItem>
              ))}
              {slots.themeSwitch && (
                <slots.themeSwitch className="ms-auto rounded-none border-y-0 border-e-0 px-1 py-0 *:rounded-md" />
              )}
            </div>
            {footer}
          </div>
        )}
      </SidebarContent>
      <SidebarDrawer>
        <div className="flex flex-col gap-3 p-4 pb-2">
          <div className="text-fd-muted-foreground flex items-center gap-1.5">
            <div className="flex flex-1">
              {iconLinks.map((item, i) => (
                <LinkItem
                  key={i}
                  item={item}
                  className={cn(
                    buttonVariants({
                      size: 'icon-sm',
                      variant: 'ghost',
                      className: 'p-2',
                    }),
                  )}
                  aria-label={item.label}
                >
                  {item.icon}
                </LinkItem>
              ))}
            </div>
            {slots.languageSelect && (
              <slots.languageSelect.root>
                <Languages className="size-4.5" />
                <slots.languageSelect.text />
              </slots.languageSelect.root>
            )}
            {slots.themeSwitch && <slots.themeSwitch className="p-0" />}
            <SidebarTrigger
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  size: 'icon-sm',
                  className: 'p-2',
                }),
              )}
            >
              <SidebarIcon />
            </SidebarTrigger>
          </div>
          {tabs.length > 0 && <SidebarTabsDropdown tabs={tabs} />}
          {banner}
        </div>
        {viewport}
        <div className="flex flex-col border-t p-4 pt-2 empty:hidden">{footer}</div>
      </SidebarDrawer>
    </>
  );
}

function SidebarFolder({ className, ...props }: ComponentProps<typeof Base.SidebarFolder>) {
  return <Base.SidebarFolder className={cn('py-6 first:pt-0 last:pb-0', className)} {...props} />;
}

export function SidebarTrigger(props: ComponentProps<'button'>) {
  return <Base.SidebarTrigger {...props} />;
}

function SidebarContent({ ref: refProp, className, children, ...props }: ComponentProps<'aside'>) {
  return (
    <Base.SidebarContent>
      {({ ref: asideRef }) => (
        <div
          data-sidebar-placeholder=""
          className="md:layout:[--fd-sidebar-width:268px] pointer-events-none sticky top-(--fd-docs-row-1) z-20 h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] [grid-area:sidebar] *:pointer-events-auto max-md:hidden"
        >
          <aside
            id="nd-sidebar"
            ref={mergeRefs(refProp, asideRef)}
            className={cn(
              'bg-fd-card absolute inset-y-0 inset-s-0 flex w-full flex-col items-end border-e text-sm *:w-(--fd-sidebar-width)',
              className,
            )}
            {...props}
          >
            {children}
          </aside>
        </div>
      )}
    </Base.SidebarContent>
  );
}

function SidebarDrawer({
  children,
  className,
  ...props
}: ComponentProps<typeof Base.SidebarDrawerContent>) {
  return (
    <>
      <Base.SidebarDrawerOverlay className="data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out fixed inset-0 z-40 backdrop-blur-xs" />
      <Base.SidebarDrawerContent
        className={cn(
          'bg-fd-background data-[state=open]:animate-fd-sidebar-in',
          'data-[state=closed]:animate-fd-sidebar-out fixed inset-y-0 inset-e-0 z-40 flex w-[85%]',
          'max-w-95 flex-col border-s text-[0.9375rem] shadow-lg',
          className,
        )}
        {...props}
      >
        {children}
      </Base.SidebarDrawerContent>
    </>
  );
}

function SidebarSeparator({ className, style, children, ...props }: ComponentProps<'p'>) {
  const depth = Base.useFolderDepth();

  return (
    <Base.SidebarSeparator
      className={cn(
        'mt-6 mb-1 inline-flex items-center gap-2 px-2 empty:mb-0 [&_svg]:size-4 [&_svg]:shrink-0',
        depth === 0 && 'first:mt-0',
        className,
      )}
      style={{
        paddingInlineStart: getItemOffset(depth),
        ...style,
      }}
      {...props}
    >
      {children}
    </Base.SidebarSeparator>
  );
}

function SidebarItem({
  className,
  style,
  children,
  active,
  ...props
}: ComponentProps<typeof Base.SidebarItem>) {
  const depth = Base.useFolderDepth();

  return (
    <Base.SidebarItem
      active={active}
      className={cn(itemVariants({ variant: 'link' }), className)}
      style={{
        paddingInlineStart: getItemOffset(depth),
        ...style,
      }}
      {...props}
    >
      {active && <ActiveIndicator />}
      {children}
    </Base.SidebarItem>
  );
}

function SidebarFolderTrigger({
  className,
  style,
  ...props
}: ComponentProps<typeof Base.SidebarFolderTrigger>) {
  const { depth } = Base.useFolder()!;

  return (
    <Base.SidebarFolderTrigger
      className={cn(folderHeaderVariants(), className)}
      style={{
        paddingInlineStart: getItemOffset(depth - 1),
        ...style,
      }}
      {...props}
    >
      {props.children}
    </Base.SidebarFolderTrigger>
  );
}

function SidebarFolderLink({
  className,
  style,
  active,
  ...props
}: ComponentProps<typeof Base.SidebarFolderLink>) {
  const depth = Base.useFolderDepth();

  return (
    <Base.SidebarFolderLink
      active={active}
      className={cn(folderHeaderVariants({ active, interactive: true }), className)}
      style={{
        paddingInlineStart: getItemOffset(depth - 1),
        ...style,
      }}
      {...props}
    >
      {active && <ActiveIndicator />}
      {props.children}
    </Base.SidebarFolderLink>
  );
}

function SidebarFolderContent({
  className,
  children,
  ...props
}: ComponentProps<typeof Base.SidebarFolderContent>) {
  return (
    <Base.SidebarFolderContent
      className={cn('relative flex flex-col gap-0.5 pt-0.5', className)}
      {...props}
    >
      {children}
    </Base.SidebarFolderContent>
  );
}

function SidebarTabsDropdown({
  tabs,
  placeholder,
  ...props
}: {
  placeholder?: ReactNode;
  tabs: LayoutTab[];
} & ComponentProps<'button'>) {
  const [open, setOpen] = useState(false);
  const { closeOnRedirect } = useSidebar();
  const pathname = usePathname();
  const path = useTreePath();

  const selected = useMemo(() => {
    return tabs.findLast((item) => isLayoutTabActive(item, path, pathname));
  }, [tabs, path, pathname]);

  const onClick = () => {
    closeOnRedirect.current = false;
    setOpen(false);
  };

  const item = selected ? (
    <>
      <div className="size-9 shrink-0 empty:hidden md:size-5">{selected.icon}</div>
      <div>
        <p className="text-sm font-medium">{selected.title}</p>
        <p className="text-fd-muted-foreground text-sm empty:hidden md:hidden">
          {selected.description}
        </p>
      </div>
    </>
  ) : (
    placeholder
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {item && (
        <PopoverTrigger
          {...props}
          className={cn(
            'bg-fd-secondary/50 text-fd-secondary-foreground hover:bg-fd-accent flex',
            'data-popup-open:bg-fd-accent data-popup-open:text-fd-accent-foreground gap-2',
            'items-center rounded-lg border p-2 text-start transition-colors',
            props.className,
          )}
        >
          {item}
          <ChevronsUpDown className="text-fd-muted-foreground ms-auto size-4 shrink-0" />
        </PopoverTrigger>
      )}
      <PopoverContent className="fd-scroll-container flex w-(--anchor-width) flex-col gap-1 p-1">
        {tabs.map((item) => {
          const isActive = selected && item.url === selected.url;
          if (!isActive && item.unlisted) return;

          return (
            <Link
              key={item.url}
              href={item.url}
              onClick={onClick}
              {...item.props}
              className={cn(
                'hover:bg-fd-accent hover:text-fd-accent-foreground flex items-center gap-2 rounded-lg p-1.5',
                item.props?.className,
              )}
            >
              <div className="size-9 shrink-0 empty:hidden md:mb-auto md:size-5">{item.icon}</div>
              <div>
                <p className="text-sm leading-none font-medium">{item.title}</p>
                <p className="text-fd-muted-foreground mt-1 text-[0.8125rem] empty:hidden">
                  {item.description}
                </p>
              </div>

              <Check
                className={cn(
                  'text-fd-primary ms-auto size-3.5 shrink-0',
                  !isActive && 'invisible',
                )}
              />
            </Link>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

function getItemOffset(depth: number) {
  return `calc(${3 + 3 * depth} * var(--spacing))`;
}

const SidebarPageTree = createPageTreeRenderer({
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
  SidebarSeparator,
});

const SidebarLinkItem = createLinkItemRenderer({
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
});
