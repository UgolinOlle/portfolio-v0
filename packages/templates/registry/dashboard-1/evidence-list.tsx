'use client';

import { CalendarDaysIcon, FileTextIcon, ShoppingCartIcon, WarehouseIcon } from 'lucide-react';
import { m } from 'motion/react';

import type { EvidenceItem } from './data';
import { rise, riseGroup, useQuick } from './motion';

const icons = {
  cart: ShoppingCartIcon,
  document: FileTextIcon,
  calendar: CalendarDaysIcon,
  warehouse: WarehouseIcon,
};

export function EvidenceList({ items }: { items: EvidenceItem[] }) {
  const quick = useQuick();

  return (
    <m.section
      className="overflow-hidden rounded-xl border border-slate-200"
      variants={riseGroup(quick, 0.04)}
    >
      <header className="flex items-center justify-between bg-slate-50 px-4 py-2 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
        <h3>Evidence</h3>
        <span className="font-normal tracking-normal normal-case">Read only</span>
      </header>
      <ul className="divide-y divide-slate-100">
        {items.map((item) => {
          const Icon = icons[item.icon];
          return (
            <m.li className="flex items-center gap-3 px-4 py-2.5" key={item.id} variants={rise}>
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Icon className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-slate-900">
                  {item.title}{' '}
                  <span className="ml-1 text-[11px] font-medium text-blue-600">{item.agent}</span>
                </p>
                <p className="truncate text-xs text-slate-500">{item.detail}</p>
              </div>
              <button
                className="rounded-md px-2 py-1 text-xs font-medium text-blue-600 transition-[background-color,transform] duration-150 hover:bg-blue-50 active:scale-[0.97]"
                type="button"
              >
                Open
              </button>
            </m.li>
          );
        })}
      </ul>
    </m.section>
  );
}
