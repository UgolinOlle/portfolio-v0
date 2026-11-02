'use client';

import { useReducedMotion } from 'motion/react';
import {
  type ComponentType,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import {
  BriefcaseIcon,
  EnvelopeIcon,
  FolderOpenIcon,
  PenNibIcon,
  StackIcon,
  TextIcon,
  UserIcon,
} from '~/components/icons/ui';

type HomeTocItem = { id: string; title: string };

// A section is "current" once its heading rises above this fraction of the viewport height.
const SPY_LINE = 0.45;

const SECTION_ICONS: Record<
  string,
  ComponentType<{ className?: string; 'aria-hidden'?: 'true' }>
> = {
  projects: FolderOpenIcon,
  works: BriefcaseIcon,
  about: UserIcon,
  writings: PenNibIcon,
  stacks: StackIcon,
  contact: EnvelopeIcon,
};

/** Top-level headings only; the id comes from the enclosing section. */
const collectHeadings = (root: HTMLElement): HomeTocItem[] => {
  const items: HomeTocItem[] = [];
  for (const heading of root.querySelectorAll<HTMLElement>('h2')) {
    const title = heading.textContent?.trim();
    const id = heading.id || heading.closest('section[id]')?.id;
    if (title && id) items.push({ id, title });
  }
  return items;
};

const sameItems = (a: HomeTocItem[], b: HomeTocItem[]) =>
  a.length === b.length && a.every((item, i) => item.id === b[i]?.id && item.title === b[i]?.title);

/** Section whose heading most recently rose above the spy line, plus overall page progress (0 → 1). */
function useActiveSection(ids: string[]) {
  const [state, setState] = useState({ activeId: '', progress: 0 });
  const key = ids.join('|');

  useEffect(() => {
    const list = key ? key.split('|') : [];
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * SPY_LINE;
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      let activeId = '';
      for (const id of list) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top > line) break;
        activeId = id;
      }
      if (atBottom && list.length > 0) {
        activeId = list.at(-1) ?? activeId;
      }
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;
      setState((prev) =>
        prev.activeId === activeId && prev.progress === progress ? prev : { activeId, progress },
      );
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

  return state;
}

function HomeTocNav({ items, label }: { items: HomeTocItem[]; label?: string }) {
  const reduceMotion = useReducedMotion();
  const { activeId, progress } = useActiveSection(items.map((item) => item.id));
  const listRef = useRef<HTMLUListElement>(null);
  const [dotY, setDotY] = useState<number | null>(null);

  // The dot jumps beside the icon of the active row (the first one before any section is reached), measured in the list's own coordinates.
  useLayoutEffect(() => {
    const row = listRef.current?.querySelector<HTMLElement>(
      `[data-toc-row="${CSS.escape(activeId || items[0]?.id || '')}"]`,
    );
    setDotY(row ? row.offsetTop + row.offsetHeight / 2 : null);
  }, [activeId, items]);

  const jump = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    history.pushState(null, '', `${window.location.pathname}${window.location.search}#${id}`);
  };

  return (
    <aside className="absolute inset-y-0 left-0 hidden w-40 md:block xl:right-full xl:left-auto xl:mr-8 xl:w-48">
      <nav aria-label={label} className="sticky top-0 flex h-dvh items-center">
        <ul className="relative flex flex-col gap-5 pl-6" ref={listRef}>
          {/* Track links every header; the blue fill is the page progression. */}
          <span
            aria-hidden="true"
            className="absolute top-1 bottom-3 left-0 w-px bg-zinc-200 dark:bg-zinc-800"
          >
            <span
              className="absolute inset-0 origin-top bg-blue-500"
              style={{ transform: `scaleY(${progress})` }}
            />
          </span>
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 size-1.5 rounded-full bg-blue-500 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
            style={{
              opacity: dotY === null ? 0 : 1,
              transform: `translate(15px, ${(dotY ?? 0) - 3}px)`,
            }}
          />
          {items.map((item) => {
            const Icon = SECTION_ICONS[item.id] ?? TextIcon;
            const current = item.id === activeId;
            return (
              <li className="relative" data-toc-row={item.id} key={item.id}>
                <span
                  aria-hidden="true"
                  className={`absolute top-1 -left-6 h-2 w-3 rounded-bl-md border-b border-l transition-colors duration-150 ${
                    current ? 'border-blue-500' : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                />
                <a
                  aria-current={current ? 'location' : undefined}
                  className={`flex items-center gap-2 rounded text-sm leading-6 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                    current
                      ? 'font-medium text-zinc-950 dark:text-zinc-50'
                      : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50'
                  }`}
                  href={`#${item.id}`}
                  onClick={(event) => jump(event, item.id)}
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0 text-zinc-400" />
                  <span className="text-balance">{item.title}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

/** Home page wrapper: a sticky table of contents built from the page's real section headings. */
export function HomeToc({ children, label }: { children: ReactNode; label?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<HomeTocItem[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const next = collectHeadings(root);
      setItems((prev) => (sameItems(prev, next) ? prev : next));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    // Streamed sections (recent writings) arrive after mount.
    const observer = new MutationObserver(schedule);
    observer.observe(root, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative md:has-[>aside]:pl-48 xl:has-[>aside]:pl-0" ref={rootRef}>
      {items.length > 1 && <HomeTocNav items={items} label={label} />}
      {children}
    </div>
  );
}
