'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import { type KeyboardEvent, type ReactNode, useEffect, useId, useRef, useState } from 'react';

import { MaximizeIcon, MinimizeIcon, RotateCcwIcon } from '~/components/icons/ui';

type Tab = 'preview' | 'code';

type PreviewShellProps = {
  preview: ReactNode;
  code: ReactNode;
  // Blocks and templates are page-sized: taller panel, scrollable.
  fullPage: boolean;
  className?: string;
};

const toolButtonClassName = cn(
  'flex w-10 items-center justify-center border-s border-foreground/10 text-foreground/50 transition-colors',
  'hover:bg-foreground/3 hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
  'disabled:pointer-events-none disabled:opacity-40',
);

// Square, hairline preview frame matching the docs chrome: mono tabs on the left, replay and
// fullscreen on the right. The preview and code are rendered on the server and passed in.
export const PreviewShell = ({ preview, code, fullPage, className }: PreviewShellProps) => {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<Tab>('preview');
  const [replayKey, setReplayKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Hidden where the browser can't do it (e.g. iOS Safari on iPhone, sandboxed iframes).
  const [canFullscreen, setCanFullscreen] = useState(false);

  useEffect(() => {
    setCanFullscreen(document.fullscreenEnabled);
    const onChange = () => setIsFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener('fullscreenchange', onChange);

    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = () => {
    // Embedded contexts (iframes without `allowfullscreen`) reject the request: ignore it.
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      rootRef.current?.requestFullscreen().catch(() => {});
    }
  };

  // Two tabs: either arrow key moves to the other one (WAI-ARIA tabs pattern).
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const next: Tab = tab === 'preview' ? 'code' : 'preview';
    setTab(next);
    document.getElementById(`${id}-${next}-tab`)?.focus();
  };

  const tabs: { value: Tab; label: string }[] = [
    { value: 'preview', label: 'Aperçu' },
    { value: 'code', label: 'Code' },
  ];

  return (
    <div
      className={cn(
        'not-prose flex flex-col border border-foreground/10 bg-background',
        '[&:fullscreen]:border-0',
        className,
      )}
      ref={rootRef}
    >
      <div className="flex h-10 items-stretch border-b border-foreground/10">
        <div aria-label="Affichage" className="flex items-stretch" role="tablist">
          {tabs.map((item) => {
            const selected = tab === item.value;

            return (
              <button
                aria-controls={`${id}-${item.value}`}
                aria-selected={selected}
                className={cn(
                  'relative border-e border-foreground/10 px-4 font-mono text-[0.6875rem] tracking-widest text-foreground/55 uppercase transition-colors',
                  'hover:bg-foreground/3 hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
                  selected &&
                    'bg-foreground/3 text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-foreground',
                )}
                id={`${id}-${item.value}-tab`}
                key={item.value}
                onClick={() => setTab(item.value)}
                onKeyDown={onTabKeyDown}
                role="tab"
                tabIndex={selected ? 0 : -1}
                type="button"
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="ms-auto flex items-stretch">
          <button
            aria-label="Rejouer l'aperçu"
            className={toolButtonClassName}
            disabled={tab !== 'preview'}
            onClick={() => setReplayKey((key) => key + 1)}
            title="Rejouer"
            type="button"
          >
            <RotateCcwIcon aria-hidden="true" className="size-3.5" />
          </button>
          {canFullscreen && (
            <button
              aria-label={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
              className={toolButtonClassName}
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
              type="button"
            >
              {isFullscreen ? (
                <MinimizeIcon aria-hidden="true" className="size-3.5" />
              ) : (
                <MaximizeIcon aria-hidden="true" className="size-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      <div
        aria-labelledby={`${id}-preview-tab`}
        className={cn(
          'flex items-center-safe justify-center',
          fullPage ? 'max-h-192 min-h-80 overflow-auto' : 'h-128 overflow-hidden',
          '[:fullscreen_&]:h-auto [:fullscreen_&]:flex-1',
        )}
        hidden={tab !== 'preview'}
        id={`${id}-preview`}
        role="tabpanel"
      >
        {/* Changing the key remounts the example, restarting its entrance animations. */}
        <div className="contents" key={replayKey}>
          {preview}
        </div>
      </div>

      <div
        aria-labelledby={`${id}-code-tab`}
        className="h-128 overflow-hidden [:fullscreen_&]:h-auto [:fullscreen_&]:flex-1"
        hidden={tab !== 'code'}
        id={`${id}-code`}
        role="tabpanel"
      >
        {code}
      </div>
    </div>
  );
};
