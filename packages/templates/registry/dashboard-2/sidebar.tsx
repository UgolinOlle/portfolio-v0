'use client';

import {
  ChevronDownIcon,
  ClockIcon,
  LogOutIcon,
  PanelLeftIcon,
  PlusIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { navItems, pipelines, recents } from './data';
import { EASE_OUT_STRONG, slide } from './motion';

export const SIDEBAR_WIDTH = { expanded: 232, collapsed: 60 } as const;

const hoverOnly = '[@media(hover:hover)_and_(pointer:fine)]:hover';
const ring = 'outline-none focus-visible:ring-2 focus-visible:ring-white/30';

/** Fades with the sidebar width so labels never wrap or clip mid-animation. */
const label = (collapsed: boolean) =>
  cn('whitespace-nowrap transition-opacity duration-150', collapsed ? 'opacity-0' : 'opacity-100');

type Tip = { text: string; y: number };

function SectionTitle({
  id,
  collapsed,
  children,
  action,
}: {
  id: string;
  collapsed: boolean;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  if (collapsed) return <div aria-hidden className="mx-3 my-3 border-t border-(--d2-line)" />;
  return (
    <div className="flex items-center justify-between px-3 pb-1.5">
      <h2 className="text-[11px] font-semibold tracking-wide text-(--d2-dim) uppercase" id={id}>
        {children}
      </h2>
      {action}
    </div>
  );
}

function UserMenu({
  collapsed,
  showTip,
}: {
  collapsed: boolean;
  showTip: (t: Tip | null, el?: HTMLElement) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', down);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('pointerdown', down);
      document.removeEventListener('keydown', key);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <AnimatePresence>
        {open && (
          <m.div
            animate={{ opacity: 1, transform: 'scale(1)' }}
            className="absolute bottom-full left-0 z-30 mb-2 w-[212px] rounded-xl border border-white/10 bg-[#1a1a1a] p-1 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.8)]"
            exit={{ opacity: 0, transform: 'scale(0.96)', transition: { duration: 0.1 } }}
            initial={{ opacity: 0, transform: 'scale(0.96)' }}
            role="menu"
            style={{ transformOrigin: 'bottom left' }}
            transition={{ duration: 0.16, ease: EASE_OUT_STRONG }}
          >
            {[
              { icon: UserIcon, text: 'Profile' },
              { icon: SettingsIcon, text: 'Settings' },
              { icon: LogOutIcon, text: 'Sign out' },
            ].map(({ icon: Icon, text }) => (
              <button
                className={cn(
                  'flex h-8 w-full items-center gap-2.5 rounded-lg px-2.5 text-[12px] text-(--d2-muted) transition-colors duration-150',
                  ring,
                  `${hoverOnly}:bg-white/[0.06] ${hoverOnly}:text-(--d2-fg)`,
                )}
                key={text}
                onClick={() => setOpen(false)}
                role="menuitem"
                type="button"
              >
                <Icon aria-hidden className="size-3.5" strokeWidth={1.8} />
                {text}
              </button>
            ))}
          </m.div>
        )}
      </AnimatePresence>

      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        className={cn(
          'flex h-11 w-full items-center gap-2.5 rounded-xl px-1 text-left transition-colors duration-150',
          ring,
          `${hoverOnly}:bg-white/[0.04]`,
        )}
        onClick={() => setOpen((o) => !o)}
        onPointerEnter={(e) =>
          collapsed && showTip({ text: 'Amara Okafor', y: 0 }, e.currentTarget)
        }
        onPointerLeave={() => showTip(null)}
        type="button"
      >
        <span className="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#ff8f55] to-[#e9521a] text-[11px] font-semibold text-black">
          AO
          <span
            aria-hidden
            className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-(--d2-sidebar) bg-emerald-400"
          />
        </span>
        <span className={cn('min-w-0 flex-1', label(collapsed))}>
          <span className="block truncate text-[12px] font-medium text-(--d2-fg)">
            Amara Okafor
          </span>
          <span className="block truncate text-[11px] text-(--d2-muted)">Sales lead</span>
        </span>
        <ChevronDownIcon
          aria-hidden
          className={cn(
            'size-3.5 shrink-0 -rotate-180 text-(--d2-muted) transition-opacity',
            collapsed && 'opacity-0',
          )}
        />
      </button>
    </div>
  );
}

export function Sidebar({
  active,
  onNavigate,
  collapsed,
  onToggle,
  onNewDeal,
}: {
  active: string;
  onNavigate: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  onNewDeal?: () => void;
}) {
  const pillId = React.useId();
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const navRef = React.useRef<HTMLElement>(null);
  const [tip, setTip] = React.useState<Tip | null>(null);
  const [pipelinesOpen, setPipelinesOpen] = React.useState(true);

  // Collapsed rows have no visible label, so show one beside the hovered or focused row.
  const showTip = (t: Tip | null, el?: HTMLElement) => {
    if (!t || !el || !wrapRef.current) return setTip(null);
    const w = wrapRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setTip({ text: t.text, y: r.top - w.top + r.height / 2 });
  };
  React.useEffect(() => setTip(null), [collapsed]);

  const rowTip = (text: string) => ({
    onPointerEnter: (e: React.PointerEvent<HTMLElement>) =>
      collapsed && showTip({ text, y: 0 }, e.currentTarget),
    onPointerLeave: () => setTip(null),
    onFocus: (e: React.FocusEvent<HTMLElement>) =>
      collapsed &&
      e.currentTarget.matches(':focus-visible') &&
      showTip({ text, y: 0 }, e.currentTarget),
    onBlur: () => setTip(null),
  });

  const onNavKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const items = [...(navRef.current?.querySelectorAll<HTMLElement>('[data-nav]') ?? [])];
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (i === -1) return;
    e.preventDefault();
    items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus();
  };

  return (
    <div className="relative flex shrink-0" ref={wrapRef}>
      <m.aside
        animate={{ width: collapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded }}
        aria-label="Sidebar"
        className="flex shrink-0 flex-col border-r border-(--d2-line) bg-(--d2-sidebar)"
        initial={false}
        transition={{ duration: 0.26, ease: EASE_OUT_STRONG }}
      >
        <div className="flex h-[52px] shrink-0 items-center gap-2.5 px-4">
          <span
            aria-hidden
            className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white text-[16px] leading-none font-black text-black"
          >
            S
          </span>
          <span
            className={cn(
              'flex-1 text-[13px] font-semibold tracking-tight text-(--d2-fg)',
              label(collapsed),
            )}
          >
            SakaniUI
          </span>
          <button
            aria-label="Collapse sidebar"
            className={cn(
              'flex size-7 shrink-0 items-center justify-center rounded-lg text-(--d2-muted) transition-[opacity,background-color,color] duration-150',
              ring,
              `${hoverOnly}:bg-white/[0.07] ${hoverOnly}:text-(--d2-fg)`,
              collapsed && 'pointer-events-none opacity-0',
            )}
            onClick={onToggle}
            tabIndex={collapsed ? -1 : 0}
            type="button"
          >
            <PanelLeftIcon aria-hidden className="size-4" strokeWidth={1.8} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <div className="px-[10px] pb-3">
            <button
              aria-label="New deal"
              className={cn(
                'flex h-8 w-full items-center gap-3 rounded-lg bg-white px-[12px] text-[12px] font-medium text-black transition-[transform,background-color] duration-150 active:scale-[0.98]',
                ring,
                `${hoverOnly}:bg-white/90`,
              )}
              onClick={onNewDeal}
              type="button"
              {...rowTip('New deal')}
            >
              <PlusIcon aria-hidden className="size-4 shrink-0" strokeWidth={2.2} />
              <span className={cn('flex-1 text-left', label(collapsed))}>New deal</span>
              <kbd
                className={cn(
                  'rounded bg-black/10 px-1.5 text-[10px] font-medium',
                  label(collapsed),
                )}
              >
                N
              </kbd>
            </button>
          </div>

          <nav
            aria-label="Primary"
            className="flex flex-col gap-0.5 px-[10px]"
            onKeyDown={onNavKey}
            ref={navRef}
          >
            {navItems.map((item) => {
              const isActive = item.id === active;
              const Icon = item.icon;
              return (
                <button
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.label}
                  className={cn(
                    'relative flex h-8 items-center gap-3 rounded-lg px-[12px] text-[13px] font-medium transition-colors duration-150',
                    ring,
                    isActive
                      ? 'text-(--d2-fg)'
                      : `text-(--d2-muted) ${hoverOnly}:bg-white/[0.04] ${hoverOnly}:text-(--d2-fg)`,
                  )}
                  data-nav=""
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  type="button"
                  {...rowTip(item.label)}
                >
                  {isActive && (
                    <m.span
                      className="absolute inset-0 rounded-lg bg-white/[0.07]"
                      layoutId={pillId}
                      transition={slide}
                    />
                  )}
                  <Icon aria-hidden className="relative size-4 shrink-0" strokeWidth={1.8} />
                  <span className={cn('relative flex-1 text-left', label(collapsed))}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className={cn(
                        'relative flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-white/10 px-1.5 text-[10px] font-medium text-(--d2-fg) transition-opacity duration-150',
                        collapsed && 'opacity-0',
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.badge && (
                    <span
                      aria-hidden
                      className={cn(
                        'absolute top-1.5 right-1.5 size-1.5 rounded-full bg-(--d2-orange) transition-opacity duration-150',
                        collapsed ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <section aria-label="Pipelines" className="mt-5 px-[10px]">
            <SectionTitle
              action={
                <button
                  aria-expanded={pipelinesOpen}
                  aria-label={pipelinesOpen ? 'Collapse pipelines' : 'Expand pipelines'}
                  className={cn(
                    'flex size-5 items-center justify-center rounded-md text-(--d2-dim)',
                    ring,
                    `${hoverOnly}:text-(--d2-fg)`,
                  )}
                  onClick={() => setPipelinesOpen((o) => !o)}
                  type="button"
                >
                  <ChevronDownIcon
                    aria-hidden
                    className={cn(
                      'size-3.5 transition-transform duration-200',
                      !pipelinesOpen && '-rotate-90',
                    )}
                  />
                </button>
              }
              collapsed={collapsed}
              id="d2-pipelines"
            >
              Pipelines
            </SectionTitle>
            <div
              className="grid transition-[grid-template-rows] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{ gridTemplateRows: pipelinesOpen || collapsed ? '1fr' : '0fr' }}
            >
              <div className="flex min-h-0 flex-col gap-0.5 overflow-hidden">
                {pipelines.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      aria-label={`${p.label}, ${p.count} deals`}
                      className={cn(
                        'flex h-8 items-center gap-3 rounded-lg px-[12px] text-[13px] font-medium text-(--d2-muted) transition-colors duration-150',
                        ring,
                        `${hoverOnly}:bg-white/[0.04] ${hoverOnly}:text-(--d2-fg)`,
                      )}
                      key={p.id}
                      tabIndex={pipelinesOpen || collapsed ? 0 : -1}
                      type="button"
                      {...rowTip(`${p.label} · ${p.count}`)}
                    >
                      <Icon
                        aria-hidden
                        className="size-4 shrink-0"
                        strokeWidth={1.8}
                        style={{ color: p.color }}
                      />
                      <span className={cn('flex-1 text-left', label(collapsed))}>{p.label}</span>
                      <span
                        className={cn('text-[11px] text-(--d2-dim) tabular-nums', label(collapsed))}
                      >
                        {p.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section
            aria-label="Recents"
            className={cn(
              'mt-5 px-[10px] transition-opacity duration-150',
              collapsed && 'pointer-events-none h-0 overflow-hidden opacity-0',
            )}
          >
            <SectionTitle collapsed={false} id="d2-recents">
              Recents
            </SectionTitle>
            {recents.map((text) => (
              <button
                className={cn(
                  'flex h-8 w-full items-center gap-3 rounded-lg px-[12px] text-left text-[12px] text-(--d2-muted) transition-colors duration-150',
                  ring,
                  `${hoverOnly}:bg-white/[0.04] ${hoverOnly}:text-(--d2-fg)`,
                )}
                key={text}
                tabIndex={collapsed ? -1 : 0}
                type="button"
              >
                <ClockIcon
                  aria-hidden
                  className="size-3.5 shrink-0 text-(--d2-dim)"
                  strokeWidth={1.8}
                />
                <span className="truncate">{text}</span>
              </button>
            ))}
          </section>
        </div>

        <div className="flex shrink-0 flex-col gap-1 border-t border-(--d2-line) px-[10px] py-2">
          {collapsed && (
            <button
              aria-label="Expand sidebar"
              className={cn(
                'flex h-8 items-center rounded-lg px-[12px] text-(--d2-muted)',
                ring,
                `${hoverOnly}:bg-white/[0.04] ${hoverOnly}:text-(--d2-fg)`,
              )}
              onClick={onToggle}
              type="button"
              {...rowTip('Expand sidebar')}
            >
              <PanelLeftIcon aria-hidden className="size-4 rotate-180" strokeWidth={1.8} />
            </button>
          )}
          <UserMenu collapsed={collapsed} showTip={(t, el) => showTip(t, el)} />
        </div>
      </m.aside>

      <AnimatePresence>
        {tip && collapsed && (
          <m.div
            animate={{ opacity: 1, transform: 'translateX(0px)' }}
            aria-hidden
            className="pointer-events-none absolute left-[68px] z-30 -translate-y-1/2 rounded-lg border border-white/10 bg-[#1a1a1a] px-2.5 py-1 text-[12px] font-medium whitespace-nowrap text-(--d2-fg) shadow-[0_8px_24px_-8px_rgba(0,0,0,0.8)]"
            exit={{ opacity: 0, transition: { duration: 0.08 } }}
            initial={{ opacity: 0, transform: 'translateX(-4px)' }}
            key="tip"
            style={{ top: tip.y }}
            transition={{ duration: 0.14, ease: EASE_OUT_STRONG }}
          >
            {tip.text}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
