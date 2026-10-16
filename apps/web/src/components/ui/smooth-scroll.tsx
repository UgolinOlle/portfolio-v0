'use client';

import { ReactLenis, type LenisRef } from 'lenis/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const LERP = 0.1;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();

  // Toggling via options recreates the Lenis instance without remounting children.
  return (
    <ReactLenis root options={{ lerp: LERP, smoothWheel: !reducedMotion }}>
      {children}
    </ReactLenis>
  );
}

/**
 * Smooth-scrolling scroll container, for layouts that scroll an element instead of the
 * window. Jumps back to the top when the route changes, like a page navigation would.
 */
function SmoothScrollArea({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const lenisRef = useRef<LenisRef>(null);
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    lenisRef.current?.lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return (
    <ReactLenis
      className={className}
      options={{ lerp: LERP, smoothWheel: !reducedMotion }}
      ref={lenisRef}
    >
      {children}
    </ReactLenis>
  );
}

export { SmoothScroll, SmoothScrollArea };
