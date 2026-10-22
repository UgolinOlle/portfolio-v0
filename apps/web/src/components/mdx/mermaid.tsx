'use client';

import { useTheme } from 'next-themes';
import { use, useEffect, useId, useState } from 'react';

type MermaidProps = {
  /** Diagram source, injected by `remarkMdxMermaid` from a ```mermaid code block. */
  chart: string;
};

// Shared across renders: mermaid (~hundreds of KB) is only fetched on pages that contain a diagram.
const promiseCache = new Map<string, Promise<unknown>>();

function cached<T>(key: string, create: () => Promise<T>): Promise<T> {
  if (!promiseCache.has(key)) {
    promiseCache.set(key, create());
  }

  return promiseCache.get(key) as Promise<T>;
}

/** Renders a Mermaid diagram on the client, following the site's light/dark theme. */
export function Mermaid({ chart }: MermaidProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // The SVG depends on the resolved theme, which only exists in the browser.
  if (!mounted) {
    return <div aria-hidden="true" className="my-6 h-40 animate-pulse rounded-xl bg-muted/40" />;
  }

  return <MermaidDiagram chart={chart} />;
}

function MermaidDiagram({ chart }: MermaidProps) {
  // React ids contain characters that are invalid in the element id mermaid generates.
  const id = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? 'dark' : 'default';

  const { default: mermaid } = use(cached('mermaid', () => import('mermaid')));

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    fontFamily: 'inherit',
    theme,
  });

  const { svg, bindFunctions } = use(
    cached(`${theme}:${chart}`, () => mermaid.render(id, chart.replaceAll('\\n', '\n'))),
  );

  return (
    <div
      className="my-6 flex justify-center overflow-x-auto [&_svg]:max-w-full"
      // Mermaid output, rendered with securityLevel "strict" from first-party MDX content.
      dangerouslySetInnerHTML={{ __html: svg }}
      ref={(container) => {
        if (container) bindFunctions?.(container);
      }}
    />
  );
}
