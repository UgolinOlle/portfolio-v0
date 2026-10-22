'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { useEffect, useRef, useState } from 'react';

const REDUCED = '(prefers-reduced-motion: reduce)';

/**
 * The Hairline "pipeline" figure (maquette → code → conteneur → production).
 *
 * Decorative and below the LCP: the kernel and the figure load once the
 * browser is idle and the box is in view. The box reserves its 5:4 ratio so nothing shifts.
 * Theme follows the site's `.dark` class (the kernel restyles itself under it). With reduced
 * motion the figure stays at rest and ignores the pointer.
 */
export function HeroFigure({ className }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState('');
  const [still, setStill] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const reduced = matchMedia(REDUCED);
    const syncStill = () => setStill(reduced.matches);
    syncStill();
    reduced.addEventListener('change', syncStill);

    let handle: { destroy: () => void } | undefined;
    let cancelled = false;
    let idle: number | undefined;
    let io: IntersectionObserver | undefined;

    async function start() {
      const [{ default: HL }, figure] = await Promise.all([
        import('~/lib/hairline/kernel'),
        import('~/lib/hairline/pipeline'),
      ]);
      if (cancelled || !el) return;
      HL.inject(document);
      el.setAttribute('data-hairline', 'pipeline');
      const svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, el);
      const read = {
        get textContent() {
          return stage;
        },
        set textContent(value: string | null) {
          setStage(value && value !== 'rest' ? value : '');
        },
      };
      handle = figure.mount({ stage: el, svg, read }, figure.range[1]);
      // Next frame, so the resting (hidden) state is painted before the transition starts.
      requestAnimationFrame(() => !cancelled && setReady(true));
    }

    const arm = () => {
      if (io || handle) return;
      io = new IntersectionObserver(([entry]) => {
        if (!entry?.isIntersecting) return;
        io?.disconnect();
        const run = () => void start();
        idle =
          typeof requestIdleCallback === 'function'
            ? requestIdleCallback(run)
            : (setTimeout(run, 200) as unknown as number);
      });
      io.observe(el);
    };
    arm();

    return () => {
      cancelled = true;
      io?.disconnect();
      if (idle !== undefined) {
        if (typeof cancelIdleCallback === 'function') cancelIdleCallback(idle);
        else clearTimeout(idle);
      }
      reduced.removeEventListener('change', syncStill);
      handle?.destroy();
    };
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- mounts once; `stage` is only the read-out
  }, []);

  return (
    <div
      className={cn('hero-figure w-64 max-w-full md:w-full', className)}
      aria-hidden="true"
      data-ready={ready}
    >
      <div className={cn('aspect-[5/4] w-full', still && 'pointer-events-none')} ref={stageRef} />
      <p className="h-4 text-right font-mono text-xs text-zinc-500">{stage}</p>
    </div>
  );
}
