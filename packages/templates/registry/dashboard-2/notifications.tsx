'use client';

import { BellIcon } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import type { Notice } from './data';
import { EASE_OUT_STRONG } from './motion';

export function Notifications({ initial }: { initial: Notice[] }) {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState(initial);
  const ref = React.useRef<HTMLDivElement>(null);
  const unread = items.filter((n) => n.unread).length;

  React.useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
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
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        className="relative flex size-9 items-center justify-center rounded-xl border border-(--d2-line) text-(--d2-muted) transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white/30 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/[0.05] [@media(hover:hover)_and_(pointer:fine)]:hover:text-(--d2-fg)"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <BellIcon aria-hidden className="size-4" strokeWidth={1.8} />
        <AnimatePresence>
          {unread > 0 && (
            <m.span
              animate={{ opacity: 1, transform: 'scale(1)' }}
              className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-(--d2-orange) px-1 text-[10px] font-semibold text-black"
              exit={{ opacity: 0, transform: 'scale(0.6)' }}
              initial={{ opacity: 0, transform: 'scale(0.6)' }}
              transition={{ duration: 0.18, ease: EASE_OUT_STRONG }}
            >
              {unread}
            </m.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            animate={{ opacity: 1, transform: 'scale(1)' }}
            aria-label="Notifications"
            className="absolute top-full right-0 z-40 mt-2 w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/10 bg-[#161616] p-1.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.85)]"
            exit={{ opacity: 0, transform: 'scale(0.97)', transition: { duration: 0.1 } }}
            initial={{ opacity: 0, transform: 'scale(0.97)' }}
            role="dialog"
            style={{ transformOrigin: 'top right' }}
            transition={{ duration: 0.16, ease: EASE_OUT_STRONG }}
          >
            <div className="flex items-center justify-between px-2.5 py-2">
              <h2 className="text-[13px] font-medium text-(--d2-fg)">Notifications</h2>
              <button
                className="rounded-md text-[11px] text-(--d2-muted) outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-40 [@media(hover:hover)_and_(pointer:fine)]:hover:text-(--d2-fg)"
                disabled={unread === 0}
                onClick={() => setItems((all) => all.map((n) => ({ ...n, unread: false })))}
                type="button"
              >
                Mark all read
              </button>
            </div>
            <ul>
              {items.map((n) => (
                <li
                  className="flex gap-2.5 rounded-xl px-2.5 py-2 transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/[0.04]"
                  key={n.id}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'mt-1.5 size-1.5 shrink-0 rounded-full transition-colors duration-200',
                      n.unread ? 'bg-(--d2-orange)' : 'bg-transparent',
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-(--d2-fg)">{n.title}</p>
                    <p className="truncate text-[12px] text-(--d2-muted)">{n.body}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-(--d2-dim)">{n.time}</span>
                </li>
              ))}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
