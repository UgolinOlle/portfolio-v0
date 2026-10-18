'use client';

import { ChevronRightIcon } from 'lucide-react';
import { m } from 'motion/react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';

import { list, rise } from './motion';
import type { NavGroup, NavItem } from './nav';

export interface NavMainProps {
  groups: NavGroup[];
  activeId: string;
  onNavigate: (id: string) => void;
}

// A thin bar scales in beside the active item; hover nudges the icon, press shrinks the row.
const BUTTON_CLASS = [
  'relative active:scale-[0.98]',
  'transition-[width,height,padding,background-color,color,transform] ',
  'before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:origin-center before:scale-y-0 before:rounded-full before:bg-sidebar-primary',
  'before:transition-transform before:duration-[var(--duration-base,180ms)] before:ease-[cubic-bezier(0.23,1,0.32,1)]',
  'data-active:before:scale-y-100',
  '[&>svg]:transition-transform [&>svg]:duration-[var(--duration-base,180ms)] [&>svg]:ease-[cubic-bezier(0.23,1,0.32,1)]',
  '[@media(hover:hover)]:hover:[&>svg:first-child]:scale-110',
].join(' ');

// Labels fade out ahead of the width transition so text never reflows while the rail narrows.
const FADE_ON_COLLAPSE =
  'transition-opacity duration-[var(--duration-base,180ms)] ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[collapsible=icon]:opacity-0';

const navigate = (
  event: React.MouseEvent,
  id: string,
  href: string | undefined,
  go: (id: string) => void,
) => {
  if (!href || href === '#') event.preventDefault();
  go(id);
};

function NavLeaf({
  item,
  activeId,
  onNavigate,
}: { item: NavItem } & Pick<NavMainProps, 'activeId' | 'onNavigate'>) {
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <m.div variants={rise}>
        <SidebarMenuButton
          className={BUTTON_CLASS}
          isActive={item.id === activeId}
          render={
            <a
              aria-current={item.id === activeId ? 'page' : undefined}
              href={item.href ?? '#'}
              onClick={(event) => navigate(event, item.id, item.href, onNavigate)}
            />
          }
          tooltip={item.title}
        >
          <Icon />
          <span className={FADE_ON_COLLAPSE}>{item.title}</span>
        </SidebarMenuButton>
        {item.badge && <SidebarMenuBadge className="tabular-nums">{item.badge}</SidebarMenuBadge>}
      </m.div>
    </SidebarMenuItem>
  );
}

function NavBranch({
  item,
  activeId,
  onNavigate,
}: { item: NavItem } & Pick<NavMainProps, 'activeId' | 'onNavigate'>) {
  const { state, setOpen, isMobile } = useSidebar();
  const Icon = item.icon;
  const childActive = item.items?.some((sub) => sub.id === activeId) ?? false;

  return (
    <SidebarMenuItem>
      <m.div variants={rise}>
        <Collapsible defaultOpen={childActive}>
          <CollapsibleTrigger
            render={
              <SidebarMenuButton
                className={BUTTON_CLASS}
                isActive={childActive}
                tooltip={item.title}
              />
            }
            // In icon mode the submenu has no room: expand the rail so the click is not a no-op.
            onClick={() => {
              if (state === 'collapsed' && !isMobile) setOpen(true);
            }}
          >
            <Icon />
            <span className={FADE_ON_COLLAPSE}>{item.title}</span>
            <ChevronRightIcon
              className={`ml-auto text-sidebar-foreground/50 transition-transform duration-[var(--duration-slow,240ms)] ease-[cubic-bezier(0.23,1,0.32,1)] group-data-panel-open/menu-button:rotate-90 ${FADE_ON_COLLAPSE}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items?.map((sub) => (
                <SidebarMenuSubItem key={sub.id}>
                  <SidebarMenuSubButton
                    className="transition-colors duration-[var(--duration-fast,120ms)] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98]"
                    isActive={sub.id === activeId}
                    render={
                      <a
                        aria-current={sub.id === activeId ? 'page' : undefined}
                        href={sub.href ?? '#'}
                        onClick={(event) => navigate(event, sub.id, sub.href, onNavigate)}
                      />
                    }
                  >
                    <span>{sub.title}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </m.div>
    </SidebarMenuItem>
  );
}

export function NavMain({ groups, activeId, onNavigate }: NavMainProps) {
  return (
    <m.div animate="visible" initial="hidden" variants={list}>
      {groups.map((group) => (
        <SidebarGroup key={group.id}>
          <m.div variants={rise}>
            <SidebarGroupLabel className="text-[0.6875rem] font-medium tracking-[0.08em] uppercase">
              {group.label}
            </SidebarGroupLabel>
          </m.div>
          <SidebarMenu>
            {group.items.map((item) =>
              item.items?.length ? (
                <NavBranch activeId={activeId} item={item} key={item.id} onNavigate={onNavigate} />
              ) : (
                <NavLeaf activeId={activeId} item={item} key={item.id} onNavigate={onNavigate} />
              ),
            )}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </m.div>
  );
}
