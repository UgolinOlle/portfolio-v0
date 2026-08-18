'use client';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@portfolio-v0/shadcn/components/collapsible';
import { cn } from '@portfolio-v0/shadcn/utils';

import { useTranslations } from '@fuma-translate/react';
import { useTreePath } from '@fumadocs/base-ui/contexts/tree';
import {
  createContext,
  use,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';

import { ChevronDownIcon, TextIcon } from '~/components/icons/ui';
import * as Base from '~/components/toc';
import * as TocClerk from '~/components/toc/clerk';
import * as TocDefault from '~/components/toc/default';

import { useDocsLayout } from '../..';

export type TOCProviderProps = Base.TOCProviderProps;

export function TOCProvider(props: TOCProviderProps) {
  return <Base.TOCProvider {...props} />;
}

export type TOCProps = {
  container?: ComponentProps<'div'>;
  /**
   * Custom content in TOC container, before the main TOC
   */
  header?: ReactNode;

  /**
   * Custom content in TOC container, after the main TOC
   */
  footer?: ReactNode;
} & (
  | {
      style?: 'normal';
      list?: TocDefault.TOCItemsProps;
    }
  | {
      style: 'clerk';
      list?: TocClerk.TOCItemsProps;
    }
);

export function TOC({ container, header, footer, style = 'normal', list }: TOCProps) {
  const t = useTranslations({ note: 'table of contents' });
  const items = Base.useTOCItems();
  const { TOCItems, TOCEmpty, TOCItem } = style === 'clerk' ? TocClerk : TocDefault;

  if (items.length === 0 && !header && !footer) {
    return <div id="nd-toc-placeholder" className="xl:layout:[--fd-toc-width:268px] hidden" />;
  }

  return (
    <div
      id="nd-toc"
      {...container}
      className={cn(
        'xl:layout:[--fd-toc-width:268px] sticky top-(--fd-docs-row-1) flex h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] w-(--fd-toc-width) flex-col pe-4 pt-12 pb-2 [grid-area:toc] max-xl:hidden',
        container?.className,
      )}
    >
      {header}
      <h3
        id="toc-title"
        className="text-fd-muted-foreground inline-flex items-center gap-1.5 text-sm"
      >
        <TextIcon className="size-4" />
        {t('On this page')}
      </h3>
      <Base.TOCScrollArea className="ms-px">
        <TOCItems {...list}>
          {items.length === 0 && <TOCEmpty />}
          {items.map((item) => (
            <TOCItem key={item.url} item={item} />
          ))}
        </TOCItems>
      </Base.TOCScrollArea>
      {footer}
    </div>
  );
}

const TocPopoverContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export type TOCPopoverProps = {
  container?: ComponentProps<'div'>;
  trigger?: ComponentProps<'button'>;
  content?: ComponentProps<'div'>;

  /**
   * Custom content in TOC container, before the main TOC
   */
  header?: ReactNode;

  /**
   * Custom content in TOC container, after the main TOC
   */
  footer?: ReactNode;
} & (
  | {
      style?: 'normal';
      list?: TocDefault.TOCItemsProps;
    }
  | {
      style: 'clerk';
      list?: TocClerk.TOCItemsProps;
    }
);

export function TOCPopover({
  container,
  trigger,
  content,
  header,
  footer,
  style = 'normal',
  list,
}: TOCPopoverProps) {
  const items = Base.useTOCItems();
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const { isNavTransparent } = useDocsLayout();
  const { TOCItems, TOCItem, TOCEmpty } = style === 'clerk' ? TocClerk : TocDefault;

  const onClickOutside = useEffectEvent((e: Event) => {
    if (!open || !(e.target instanceof HTMLElement)) return;

    if (ref.current && !ref.current.contains(e.target)) setOpen(false);
  });

  const onClickItem = () => {
    setOpen(false);
  };

  useEffect(() => {
    window.addEventListener('click', onClickOutside);

    return () => {
      window.removeEventListener('click', onClickOutside);
    };
  }, []);

  return (
    <TocPopoverContext
      value={useMemo(
        () => ({
          open,
          setOpen,
        }),
        [setOpen, open],
      )}
    >
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        data-toc-popover=""
        {...container}
        className={cn(
          'max-xl:layout:[--fd-toc-popover-height:--spacing(10)] sticky top-(--fd-docs-row-2) z-10 h-(--fd-toc-popover-height) [grid-area:toc-popover] xl:hidden',
          container?.className,
        )}
      >
        <header
          ref={ref}
          className={cn(
            'border-b backdrop-blur-sm transition-colors',
            (!isNavTransparent || open) && 'bg-fd-background/80',
            open && 'shadow-lg',
          )}
        >
          <PageTOCPopoverTrigger {...trigger} />
          <PageTOCPopoverContent {...content}>
            {header}
            <Base.TOCScrollArea className="ms-px">
              <TOCItems {...list}>
                {items.length === 0 && <TOCEmpty />}
                {items.map((item) => (
                  <TOCItem key={item.url} item={item} onClick={onClickItem} />
                ))}
              </TOCItems>
            </Base.TOCScrollArea>
            {footer}
          </PageTOCPopoverContent>
        </header>
      </Collapsible>
    </TocPopoverContext>
  );
}

function PageTOCPopoverTrigger({ className, ...props }: ComponentProps<'button'>) {
  const t = useTranslations({ note: 'table of contents' });
  const { open } = use(TocPopoverContext)!;
  const items = Base.useItems();
  const selectedIdx = items.findIndex((item) => item.active);
  const path = useTreePath().at(-1);
  const showItem = selectedIdx !== -1 && !open;

  return (
    <CollapsibleTrigger
      className={cn(
        'text-fd-muted-foreground flex h-10 w-full items-center gap-2.5 px-4 py-2.5 text-start text-sm focus-visible:outline-none md:px-6 [&_svg]:size-4',
        className,
      )}
      data-toc-popover-trigger=""
      {...props}
    >
      <ProgressCircle
        value={(items.findLastIndex((item) => item.active) + 1) / Math.max(1, items.length)}
        max={1}
        className={cn('shrink-0', open && 'text-fd-primary')}
      />
      <span className="grid flex-1 *:col-start-1 *:row-start-1 *:my-auto">
        <span
          className={cn(
            'truncate transition-[opacity,translate,color]',
            open && 'text-fd-foreground',
            showItem && 'pointer-events-none -translate-y-full opacity-0',
          )}
        >
          {path?.name ?? t('On this page')}
        </span>
        <span
          className={cn(
            'truncate transition-[opacity,translate]',
            !showItem && 'pointer-events-none translate-y-full opacity-0',
          )}
        >
          {items[selectedIdx]?.original.title}
        </span>
      </span>
      <ChevronDownIcon
        className={cn('mx-0.5 shrink-0 transition-transform', open && 'rotate-180')}
      />
    </CollapsibleTrigger>
  );
}

interface ProgressCircleProps extends Omit<React.ComponentProps<'svg'>, 'strokeWidth'> {
  value: number;
  strokeWidth?: number;
  size?: number;
  min?: number;
  max?: number;
}

function clamp(input: number, min: number, max: number): number {
  if (input < min) return min;
  if (input > max) return max;
  return input;
}

function ProgressCircle({
  value,
  strokeWidth = 1.5,
  size = 18,
  min = 0,
  max = 100,
  style,
  ...restSvgProps
}: ProgressCircleProps) {
  const normalizedValue = clamp(value, min, max);
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const progress = (normalizedValue / max) * circumference;
  const circleProps = {
    cx: size / 2,
    cy: size / 2,
    r: radius,
    fill: 'none',
    strokeWidth,
  };

  return (
    <svg
      role="progressbar"
      viewBox={`0 0 ${size} ${size}`}
      aria-valuenow={normalizedValue}
      aria-valuemin={min}
      aria-valuemax={max}
      style={{ width: size, height: size, ...style }}
      {...restSvgProps}
    >
      <circle {...circleProps} className="stroke-current/25" />
      <circle
        {...circleProps}
        stroke="currentColor"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-all"
      />
    </svg>
  );
}

function PageTOCPopoverContent(props: ComponentProps<'div'>) {
  return (
    <CollapsibleContent data-toc-popover-content="" {...props}>
      <div className="flex max-h-[50vh] flex-col px-4 md:px-6">{props.children}</div>
    </CollapsibleContent>
  );
}
