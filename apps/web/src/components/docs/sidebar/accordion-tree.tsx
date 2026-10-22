'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { useTreeContext, useTreePath } from '@fumadocs/base-ui/contexts/tree';
import { usePathname } from 'fumadocs-core/framework';
import Link from 'fumadocs-core/link';
import type * as PageTree from 'fumadocs-core/page-tree';
import { AnimatePresence, m } from 'motion/react';
import { type ReactNode, useEffect, useId, useRef, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';

import { ChevronDownIcon } from '~/components/icons/ui';
import { isActive } from '~/lib/urls';

// Better Auth–style sidebar: full-bleed rows separated by hairlines, top-level folders
// as a single-open accordion, flat item rows with a tinted active background.

const focusRing =
  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring';

const rowClassName = cn(
  'flex w-full items-center gap-2 border-b border-foreground/6 px-4 py-2.5 text-start text-sm font-medium tracking-wide transition-colors',
  focusRing,
);

const iconBoxClassName = 'flex size-5 shrink-0 items-center justify-center [&>svg]:size-3.5';

const labelClassName =
  'px-4 pt-3 pb-1 text-xs font-medium tracking-wider text-foreground/45 uppercase';

const getFolderKey = (folder: PageTree.Folder) => folder.$id ?? String(folder.name);

const NodeIcon = ({ icon }: { icon?: ReactNode }) =>
  icon ? (
    <span aria-hidden="true" className={iconBoxClassName}>
      {icon}
    </span>
  ) : null;

export function SidebarAccordionTree() {
  const { root } = useTreeContext();
  const path = useTreePath();
  const pathname = usePathname();

  const activeFolder = path.find(
    (node): node is PageTree.Folder => node.type === 'folder' && root.children.includes(node),
  );
  const activeKey = activeFolder ? getFolderKey(activeFolder) : undefined;
  const [openKey, setOpenKey] = useState(activeKey);

  // Navigating to a page in another group opens that group (and closes the current one).
  const [previousActiveKey, setPreviousActiveKey] = useState(activeKey);
  if (previousActiveKey !== activeKey) {
    setPreviousActiveKey(activeKey);
    if (activeKey) setOpenKey(activeKey);
  }

  return (
    <div className="flex flex-col">
      {root.children.map((node, index) => {
        if (node.type === 'separator') {
          return (
            <p className={labelClassName} key={index}>
              {node.name}
            </p>
          );
        }

        if (node.type === 'page') {
          const active = isActive(node.url, pathname);

          return (
            <Link
              aria-current={active ? 'page' : undefined}
              className={cn(
                rowClassName,
                active
                  ? 'bg-foreground/3 text-foreground'
                  : 'text-foreground/70 hover:bg-foreground/3 hover:text-foreground',
              )}
              external={node.external}
              href={node.url}
              key={node.url}
            >
              <NodeIcon icon={node.icon} />
              <span className="truncate">{node.name}</span>
            </Link>
          );
        }

        const key = getFolderKey(node);

        return (
          <AccordionGroup
            containsActive={key === activeKey}
            folder={node}
            key={key}
            onToggle={() => setOpenKey((current) => (current === key ? undefined : key))}
            open={openKey === key}
            pathname={pathname}
          />
        );
      })}
    </div>
  );
}

type AccordionGroupProps = {
  folder: PageTree.Folder;
  open: boolean;
  containsActive: boolean;
  onToggle: () => void;
  pathname: string;
};

function AccordionGroup({ folder, open, containsActive, onToggle, pathname }: AccordionGroupProps) {
  const contentId = useId();

  return (
    <div>
      <button
        aria-controls={contentId}
        aria-expanded={open}
        className={cn(
          rowClassName,
          open
            ? 'bg-foreground/3 text-foreground'
            : containsActive
              ? 'text-foreground hover:bg-foreground/3'
              : 'text-foreground/70 hover:bg-foreground/3 hover:text-foreground',
        )}
        onClick={onToggle}
        type="button"
      >
        <NodeIcon icon={folder.icon} />
        <span className="flex-1 truncate">{folder.name}</span>
        <ChevronDownIcon
          aria-hidden="true"
          className={cn(
            'size-3.5 shrink-0 text-foreground/40 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <m.div
            animate={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden border-b border-foreground/6"
            exit={{ height: 0, opacity: 0 }}
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            key="content"
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <ul className="flex flex-col py-1">
              {folder.index && <LeafItem node={folder.index} pathname={pathname} />}
              {folder.children.map((child, index) => (
                <GroupChild
                  key={child.type === 'page' ? child.url : index}
                  node={child}
                  pathname={pathname}
                />
              ))}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GroupChild({ node, pathname }: { node: PageTree.Node; pathname: string }) {
  if (node.type === 'page') return <LeafItem node={node} pathname={pathname} />;

  if (node.type === 'separator') {
    return (
      <li>
        <p className={labelClassName}>{node.name}</p>
      </li>
    );
  }

  // Nested folders flatten into a labelled sub-list rather than a second accordion level.
  return (
    <li>
      <p className={labelClassName}>{node.name}</p>
      <ul className="flex flex-col">
        {node.index && <LeafItem node={node.index} pathname={pathname} />}
        {node.children.map((child, index) => (
          <GroupChild
            key={child.type === 'page' ? child.url : index}
            node={child}
            pathname={pathname}
          />
        ))}
      </ul>
    </li>
  );
}

function LeafItem({ node, pathname }: { node: PageTree.Item; pathname: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const active = isActive(node.url, pathname);

  useEffect(() => {
    const element = ref.current;
    if (!active || !element) return;

    scrollIntoView(element, {
      boundary: element.closest('aside'),
      block: 'center',
      scrollMode: 'if-needed',
    });
  }, [active]);

  return (
    <li>
      <Link
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex w-full items-center gap-2.5 px-4 py-1 text-sm transition-colors',
          focusRing,
          active
            ? 'bg-foreground/6 text-foreground'
            : 'text-foreground/65 hover:bg-foreground/3 hover:text-foreground/90',
        )}
        external={node.external}
        href={node.url}
        ref={ref}
      >
        <NodeIcon icon={node.icon} />
        <span className="truncate">{node.name}</span>
      </Link>
    </li>
  );
}
