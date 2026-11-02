'use client';

import type { TOCItemType } from 'fumadocs-core/toc';
import { m, useReducedMotion } from 'motion/react';
import {
  type MouseEvent,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { TextIcon } from '~/components/icons/ui';

type TocGroupItem = {
  id: string;
  title: ReactNode;
  children: { id: string; title: ReactNode }[];
};

// A heading is "current" once it rises above this fraction of the viewport height (just before the middle).
const SPY_LINE = 0.45;
const LEADING_EMOJI = /^(?:\p{Extended_Pictographic}[️‍]*)+\s*/u;
const MOVE = { duration: 0.22, ease: [0.23, 1, 0.32, 1] as const };
const DOT = 6;

const toId = (url: string) => decodeURIComponent(url.replace(/^#/, ''));

const stripEmoji = (title: ReactNode): ReactNode => {
  if (typeof title === 'string') return title.replace(LEADING_EMOJI, '');
  if (Array.isArray(title)) return title.map((part, i) => (i === 0 ? stripEmoji(part) : part));
  return title;
};

/** H2 → section header, H3 → sub-item under the preceding H2. */
const groupItems = (items: TOCItemType[]): TocGroupItem[] => {
  const groups: TocGroupItem[] = [];
  for (const item of items) {
    if (item.depth === 2) {
      groups.push({ id: toId(item.url), title: stripEmoji(item.title), children: [] });
    } else if (item.depth === 3) {
      groups.at(-1)?.children.push({ id: toId(item.url), title: stripEmoji(item.title) });
    }
  }
  return groups;
};

function useActiveHeading(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0] ?? '');
  const key = ids.join('|');

  useEffect(() => {
    const list = key ? key.split('|') : [];
    let frame = 0;

    const update = () => {
      frame = 0;
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      let current = list[0] ?? '';
      if (atBottom) {
        current = list.at(-1) ?? current;
      } else {
        for (const id of list) {
          const el = document.getElementById(id);
          if (!el) continue;
          if (el.getBoundingClientRect().top > window.innerHeight * SPY_LINE) break;
          current = id;
        }
      }
      setActiveId(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [key]);

  return activeId;
}

/**
 * One blue line + dot for the whole list, so the indicator glides between any two rows
 * (H3 → H3, H3 → next H2, H2 → H2) instead of resetting per section.
 * Positions are measured in the list's own coordinates and animated with transforms only.
 */
function useIndicator(activeId: string, groups: TocGroupItem[]) {
  const rootRef = useRef<HTMLUListElement>(null);
  const [pos, setPos] = useState({ lineX: 0, lineTop: 0, lineLength: 0, dotX: 0, dotY: 0 });
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const row = root?.querySelector<HTMLElement>(`[data-toc-row="${CSS.escape(activeId)}"]`);
    if (!root || !row) return;

    const rootRect = root.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const y = rowRect.top + rowRect.height / 2 - rootRect.top;
    const branch = row.closest<HTMLElement>('[data-toc-children]');

    if (branch) {
      const branchRect = branch.getBoundingClientRect();
      const lineX = branchRect.left - rootRect.left;
      setPos({
        lineX,
        lineTop: branchRect.top - rootRect.top,
        lineLength: y - (branchRect.top - rootRect.top),
        dotX: lineX + 12 - DOT / 2,
        dotY: y - DOT / 2,
      });
    } else {
      // Section header: no branch line, the dot sits in the gutter left of the icon.
      setPos((prev) => ({ ...prev, lineLength: 0, dotX: 0, dotY: y - DOT / 2 }));
    }
    setReady(true);
  }, [activeId, groups]);

  return { rootRef, pos, ready };
}

function TocGroup({
  group,
  activeId,
  onJump,
}: {
  group: TocGroupItem;
  activeId: string;
  onJump: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
}) {
  const isActive = group.id === activeId || group.children.some((child) => child.id === activeId);

  return (
    <li>
      <a
        className={`flex items-center gap-2 text-sm leading-6 transition-colors duration-150 ${
          isActive
            ? 'font-medium text-zinc-950 dark:text-zinc-50'
            : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50'
        }`}
        data-toc-row={group.id}
        href={`#${group.id}`}
        onClick={(event) => onJump(event, group.id)}
      >
        <TextIcon aria-hidden="true" className="size-4 shrink-0 text-zinc-400" />
        <span className="text-balance">{group.title}</span>
      </a>

      {group.children.length > 0 && (
        <ul className="relative mt-1.5 ml-2 flex flex-col pl-5" data-toc-children>
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-px bg-zinc-200 dark:bg-zinc-800"
          />
          {group.children.map((child) => {
            const current = child.id === activeId;
            return (
              <li className="relative" key={child.id}>
                <span
                  aria-hidden="true"
                  className={`absolute top-[calc(50%-8px)] -left-5 h-2 w-3 rounded-bl-md border-b border-l transition-colors duration-150 ${
                    current ? 'border-blue-500' : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                />
                <a
                  aria-current={current ? 'location' : undefined}
                  className={`block py-1 text-sm leading-5 transition-colors duration-150 ${
                    current
                      ? 'text-zinc-950 dark:text-zinc-50'
                      : 'text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300'
                  }`}
                  data-toc-row={child.id}
                  href={`#${child.id}`}
                  onClick={(event) => onJump(event, child.id)}
                >
                  {child.title}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

/**
 * Sticky table of contents for long pages, built from the page's H2/H3 headings.
 * Hidden on phones. From `md` the article reserves a left gutter for it (`md:has-[>aside]:pl-48`);
 * from `xl` there is room, so it moves into the page margin instead.
 */
export function Toc({ items, label = 'On this page' }: { items: TOCItemType[]; label?: string }) {
  const reduceMotion = useReducedMotion();
  const groups = useMemo(() => groupItems(items), [items]);
  const ids = groups.flatMap((group) => [group.id, ...group.children.map((child) => child.id)]);
  const activeId = useActiveHeading(ids);
  const { rootRef, pos, ready } = useIndicator(activeId, groups);
  const navRef = useRef<HTMLElement>(null);

  // Long lists overflow the sticky nav: keep the active row centred as the reader moves through the page.
  useEffect(() => {
    const nav = navRef.current;
    const row = nav?.querySelector<HTMLElement>(`[data-toc-row="${CSS.escape(activeId)}"]`);
    if (!nav || !row || nav.scrollHeight <= nav.clientHeight) return;

    const navRect = nav.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const rowCenter = rowRect.top + rowRect.height / 2 - navRect.top + nav.scrollTop;
    nav.scrollTo({
      top: rowCenter - nav.clientHeight / 2,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, [activeId, reduceMotion]);

  if (groups.length < 2) {
    return null;
  }

  const jump = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    history.pushState(null, '', `${window.location.pathname}${window.location.search}#${id}`);
  };

  return (
    <aside className="absolute inset-y-0 left-0 hidden w-40 md:block xl:right-full xl:left-auto xl:mr-8 xl:w-48">
      <nav
        aria-label={label}
        className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={navRef}
      >
        <ul className="relative flex flex-col gap-5 pl-3" ref={rootRef}>
          <m.span
            animate={{
              opacity: ready && pos.lineLength > 0 ? 1 : 0,
              transform: `translate(${pos.lineX}px, ${pos.lineTop}px) scaleY(${Math.max(pos.lineLength, 0)})`,
            }}
            aria-hidden="true"
            className="absolute top-0 left-0 z-10 h-px w-px origin-top bg-blue-500"
            initial={false}
            transition={MOVE}
          />
          <m.span
            animate={{
              opacity: ready ? 1 : 0,
              transform: `translate(${pos.dotX}px, ${pos.dotY}px)`,
            }}
            aria-hidden="true"
            className="absolute top-0 left-0 z-10 size-1.5 rounded-full bg-blue-500"
            initial={false}
            transition={MOVE}
          />
          {groups.map((group) => (
            <TocGroup activeId={activeId} group={group} key={group.id} onJump={jump} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
