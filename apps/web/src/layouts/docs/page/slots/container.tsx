'use client';

import { cn } from '@portfolio-v0/shadcn/utils';

import type { ComponentProps } from 'react';

import { useDocsPage } from './..';

export function Container(props: ComponentProps<'article'>) {
  const { full } = useDocsPage();

  return (
    <article
      id="nd-page"
      data-full={full}
      {...props}
      className={cn(
        'mx-auto flex w-full max-w-225 flex-col gap-4 px-4 pt-[calc(var(--fd-banner-height,0px)+1.5rem)] pb-6 [grid-area:main] md:px-6 md:pb-8 xl:px-8 xl:pb-14',
        full && 'max-w-292',
        props.className,
      )}
    >
      {props.children}
    </article>
  );
}
