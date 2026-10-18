'use client';

import { m, useInView, useReducedMotion, useSpring } from 'motion/react';
import * as React from 'react';

import { AnimatedNumber } from './animated-number';
import type { Stage } from './data';

const usd = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(2)}M` : `$${Math.round(n)}K`);

function Row({
  stage,
  max,
  total,
  index,
  go,
  dim,
  onActive,
}: {
  stage: Stage;
  max: number;
  total: number;
  index: number;
  go: boolean;
  dim: boolean;
  onActive: (on: boolean) => void;
}) {
  const reduce = useReducedMotion();
  const scale = useSpring(reduce ? stage.value / max : 0, { stiffness: 120, damping: 17 });
  React.useEffect(() => {
    if (reduce) return scale.jump(stage.value / max);
    if (!go) return;
    const t = window.setTimeout(() => scale.set(stage.value / max), index * 90);
    return () => window.clearTimeout(t);
  }, [go, stage.value, max, index, reduce, scale]);

  return (
    <button
      aria-label={`${stage.label}: ${usd(stage.value)}, ${stage.deals} deals, ${Math.round((stage.value / total) * 100)}% of pipeline`}
      className="group grid grid-cols-[88px_1fr_auto] items-center gap-3 rounded-xl px-2 py-1.5 text-left transition-[opacity,background-color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white/30 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/[0.04]"
      onBlur={() => onActive(false)}
      onFocus={() => onActive(true)}
      onPointerEnter={() => onActive(true)}
      onPointerLeave={() => onActive(false)}
      style={{ opacity: dim ? 0.45 : 1 }}
      type="button"
    >
      <span className="text-[12px] text-(--d2-muted)">{stage.label}</span>
      <span className="h-7 overflow-hidden rounded-lg bg-white/[0.05]">
        <m.span
          className="block h-full origin-left rounded-lg bg-linear-to-r from-[#e9521a] to-[#ff8f55]"
          style={{ scaleX: scale, opacity: 1 - index * 0.13 }}
        />
      </span>
      <span className="w-[92px] text-right text-[12px] tabular-nums">
        <AnimatedNumber
          className="font-medium text-(--d2-fg)"
          delay={index * 0.09}
          format={usd}
          value={go ? stage.value : 0}
        />
        <span className="ml-1.5 text-(--d2-dim)">{stage.deals}</span>
      </span>
    </button>
  );
}

export function StageChart({ stages }: { stages: Stage[] }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const go = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  const [active, setActive] = React.useState<string | null>(null);
  const max = Math.max(...stages.map((s) => s.value));
  const total = stages.reduce((a, s) => a + s.value, 0);

  return (
    <section
      aria-labelledby="d2-stages"
      className="rounded-[22px] border border-(--d2-line) bg-(--d2-card) px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
      ref={ref}
    >
      <div className="flex items-baseline justify-between px-2">
        <h2 className="text-[16px] font-medium text-(--d2-fg)" id="d2-stages">
          Pipeline by stage
        </h2>
        <span className="text-[12px] text-(--d2-muted) tabular-nums">
          {usd(total)} · {stages.reduce((a, s) => a + s.deals, 0)} deals
        </span>
      </div>
      <div className="mt-3 flex flex-col">
        {stages.map((s, i) => (
          <Row
            dim={active != null && active !== s.id}
            go={go}
            index={i}
            key={s.id}
            max={max}
            onActive={(on) => setActive(on ? s.id : null)}
            stage={s}
            total={total}
          />
        ))}
      </div>
    </section>
  );
}
