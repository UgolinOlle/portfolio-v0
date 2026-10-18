'use client';

import { m } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import type { Task } from './data';
import { EASE_OUT_STRONG, rise, slide, stagger, stage } from './motion';

function Checkbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <m.button
      aria-checked={checked}
      aria-label={label}
      className="relative mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      onClick={onChange}
      role="checkbox"
      type="button"
      whileTap={{ transform: 'scale(0.9)' }}
    >
      <span className="absolute inset-0 rounded-lg border border-white/25" />
      <m.span
        animate={
          checked ? { opacity: 1, transform: 'scale(1)' } : { opacity: 0, transform: 'scale(0.6)' }
        }
        className="absolute inset-0 rounded-lg bg-(--d2-orange)"
        initial={false}
        transition={checked ? { type: 'spring', duration: 0.35, bounce: 0.35 } : { duration: 0.12 }}
      />
      <svg aria-hidden className="relative size-3.5" fill="none" viewBox="0 0 16 16">
        <m.path
          animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          d="M3.5 8.5l3 3 6-7"
          initial={false}
          stroke="#0a0a0a"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.2}
          transition={{
            duration: checked ? 0.22 : 0.1,
            delay: checked ? 0.08 : 0,
            ease: EASE_OUT_STRONG,
          }}
        />
      </svg>
    </m.button>
  );
}

export function TaskRail({ initial }: { initial: Task[] }) {
  const [tasks, setTasks] = React.useState(initial);
  const toggle = (id: string) =>
    setTasks((all) => all.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const open = tasks.filter((t) => !t.done);
  const overdue = open.filter((t) => t.overdue).length;
  // Completed tasks sink to the bottom; `layout` animates the reorder.
  const sorted = [...tasks].sort((a, b) => Number(!!a.done) - Number(!!b.done));

  return (
    <section
      aria-labelledby="d2-today"
      className="rounded-[22px] border border-(--d2-line) bg-(--d2-card) px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
    >
      <h2 className="text-[17px] leading-tight font-medium text-(--d2-fg)" id="d2-today">
        Today
      </h2>
      <p aria-live="polite" className="mt-1 text-[13px] text-(--d2-muted) tabular-nums">
        {open.length} {open.length === 1 ? 'task' : 'tasks'} · {overdue} overdue
      </p>

      <m.ul
        animate="visible"
        className="mt-5 flex flex-col"
        initial="hidden"
        variants={stagger(stage.tasks + 0.1, 0.06)}
      >
        {sorted.map((task) => (
          <m.li
            className="flex gap-2.5 py-2.5"
            key={task.id}
            layout="position"
            transition={slide}
            variants={rise}
          >
            <Checkbox
              checked={!!task.done}
              label={`Mark “${task.title}” ${task.done ? 'not done' : 'done'}`}
              onChange={() => toggle(task.id)}
            />
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  'relative w-fit max-w-full truncate text-[13px] leading-snug font-medium transition-colors duration-200',
                  task.done ? 'text-(--d2-dim)' : 'text-(--d2-fg)',
                )}
              >
                {task.title}
                <m.span
                  animate={{ transform: task.done ? 'scaleX(1)' : 'scaleX(0)' }}
                  aria-hidden
                  className="absolute top-1/2 left-0 h-px w-full bg-(--d2-dim)"
                  initial={false}
                  style={{ transformOrigin: 'left center' }}
                  transition={{ duration: 0.25, ease: EASE_OUT_STRONG }}
                />
              </p>
              <p
                className={cn(
                  'mt-0.5 truncate text-[12px] transition-colors duration-200',
                  task.overdue && !task.done ? 'text-red-400' : 'text-(--d2-muted)',
                )}
              >
                {task.meta}
                {task.overdue && !task.done ? ' · Overdue' : ''}
              </p>
            </div>
          </m.li>
        ))}
      </m.ul>
    </section>
  );
}
